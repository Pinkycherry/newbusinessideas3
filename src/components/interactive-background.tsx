import { useEffect, useRef } from "react";

/**
 * Site-wide 3D particle-cloud background.
 *
 * A volumetric point cloud of outlined triangles rendered with a real
 * perspective projection: the cloud holds a brain silhouette, rotates
 * continuously, tilts toward the pointer, and morphs between shapes as the
 * page scrolls (brain -> dispersed -> sphere). Particles are depth-sorted
 * and scale/fade with distance, and a handful of large "near-camera"
 * triangles drift in front for parallax.
 *
 * Strictly a background layer:
 *  - `position: fixed` at a negative z-index, so it never affects layout
 *  - `pointer-events: none`, so it can never intercept a click
 *  - a single static paint under `prefers-reduced-motion`
 */

type P = {
  // shape targets
  bx: number; by: number; bz: number; // brain
  sx: number; sy: number; sz: number; // sphere
  dx: number; dy: number; dz: number; // dispersed
  // live position
  x: number; y: number; z: number;
  r: number;      // base radius
  rot: number;    // 2D glyph rotation
  spin: number;
  color: string;
  alpha: number;
  filled: boolean;
};

const PALETTE = [
  "#4643BA", "#5B57D6", "#8886DB", "#3A3697",
  "#7C3AED", "#15846e", "#B45309", "#0C0C25", "#6D28D9",
];

const FOV = 900;          // perspective strength
let CLOUD = 300;          // world radius of the cloud (set from viewport)

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let W = 0, H = 0, raf = 0;
    let pts: P[] = [];
    let near: P[] = [];

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(a: T[]) => a[(Math.random() * a.length) | 0]!;

    /** Point on a unit sphere (even distribution). */
    function onSphere() {
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      return {
        x: Math.sin(phi) * Math.cos(theta),
        y: Math.sin(phi) * Math.sin(theta),
        z: Math.cos(phi),
      };
    }

    /**
     * Brain shell: an ellipsoid deformed by low-frequency noise to suggest
     * gyri, split by a central longitudinal fissure, with a cerebellum lobe
     * at the lower rear.
     */
    function brainPoint() {
      // cerebellum for ~14% of points
      if (Math.random() < 0.14) {
        const s = onSphere();
        return {
          x: s.x * 0.34 + 0.0,
          y: s.y * 0.26 - 0.62,
          z: s.z * 0.30 - 0.52,
        };
      }
      const s = onSphere();
      // ellipsoid: longer front-to-back, narrower side-to-side
      let x = s.x * 0.74;
      let y = s.y * 0.72;
      let z = s.z * 0.95;
      // gyri: low-frequency radial wobble
      const bump =
        Math.sin(x * 7.5) * Math.cos(z * 6.2) * 0.055 +
        Math.sin(y * 8.8 + z * 3.1) * 0.045;
      const len = Math.hypot(x, y, z) || 1;
      x += (x / len) * bump; y += (y / len) * bump; z += (z / len) * bump;
      // frontal lobe taper
      if (z > 0.4) { x *= 0.9; y *= 0.94; }
      // longitudinal fissure down the middle
      if (Math.abs(x) < 0.055 && y > -0.25) {
        if (Math.random() > 0.16) return null;
        y -= 0.03;
      }
      return { x, y, z };
    }

    function build() {
      const count = W < 700 ? 1500 : W < 1300 ? 2800 : 4200;
      pts = [];
      while (pts.length < count) {
        const b = brainPoint();
        if (!b) continue;
        const s = onSphere();
        const d = onSphere();
        const dScale = rand(1.15, 2.3);
        pts.push({
          bx: b.x * CLOUD, by: b.y * CLOUD, bz: b.z * CLOUD,
          sx: s.x * CLOUD * 0.96, sy: s.y * CLOUD * 0.96, sz: s.z * CLOUD * 0.96,
          dx: d.x * CLOUD * dScale, dy: d.y * CLOUD * dScale, dz: d.z * CLOUD * dScale,
          x: 0, y: 0, z: 0,
          r: rand(1.9, 4.2),
          rot: rand(0, Math.PI * 2),
          spin: rand(-0.02, 0.02),
          color: pick(PALETTE),
          alpha: rand(0.55, 1),
          filled: Math.random() < 0.1,
        });
      }
      // large near-camera drifters for parallax
      near = Array.from({ length: W < 700 ? 7 : 14 }, () => {
        const d = onSphere();
        return {
          bx: d.x * CLOUD * 2.4, by: d.y * CLOUD * 2.4, bz: d.z * CLOUD * 1.6,
          sx: 0, sy: 0, sz: 0, dx: 0, dy: 0, dz: 0,
          x: 0, y: 0, z: 0,
          r: rand(10, 26),
          rot: rand(0, Math.PI * 2),
          spin: rand(-0.006, 0.006),
          color: pick(PALETTE),
          alpha: rand(0.35, 0.8),
          filled: false,
        } as P;
      });
    }

    function resize() {
      W = window.innerWidth; H = window.innerHeight;
      CLOUD = Math.min(W, H) * 0.42;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      canvas!.style.width = `${W}px`;
      canvas!.style.height = `${H}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    // pointer drives tilt; smoothed so it never snaps
    const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
    let scrollT = 0, scrollTarget = 0;
    let yaw = 0;

    function glyph(sx: number, sy: number, r: number, rot: number,
                   color: string, alpha: number, filled: boolean) {
      ctx!.save();
      ctx!.translate(sx, sy);
      ctx!.rotate(rot);
      ctx!.beginPath();
      for (let i = 0; i < 3; i += 1) {
        const a = ((Math.PI * 2) / 3) * i - Math.PI / 2;
        const px = Math.cos(a) * r, py = Math.sin(a) * r;
        if (i === 0) ctx!.moveTo(px, py); else ctx!.lineTo(px, py);
      }
      ctx!.closePath();
      ctx!.globalAlpha = alpha;
      if (filled) {
        ctx!.fillStyle = color;
        ctx!.fill();
      } else {
        ctx!.strokeStyle = color;
        ctx!.lineWidth = Math.max(0.6, r * 0.22);
        ctx!.stroke();
      }
      ctx!.restore();
    }

    // scratch buffer so we never allocate inside the frame loop
    let order: { i: number; z: number }[] = [];

    function frame() {
      ctx!.clearRect(0, 0, W, H);

      // ease pointer + scroll
      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;
      scrollT += (scrollTarget - scrollT) * 0.06;
      if (!reduce) yaw += 0.0016;

      // morph weights: 0 -> brain, 0.5 -> dispersed, 1 -> sphere
      const toDisp = Math.min(1, scrollT * 2);
      const toSphere = Math.max(0, scrollT * 2 - 1);

      const pitch = ptr.y * 0.45;
      const roll = ptr.x * 0.6 + yaw;
      const cosY = Math.cos(roll), sinY = Math.sin(roll);
      const cosX = Math.cos(pitch), sinX = Math.sin(pitch);

      const cx = W * 0.5, cy = H * 0.5;

      if (order.length !== pts.length) {
        order = pts.map((_, i) => ({ i, z: 0 }));
      }

      for (let i = 0; i < pts.length; i += 1) {
        const p = pts[i]!;
        // brain -> dispersed -> sphere
        const ax = p.bx + (p.dx - p.bx) * toDisp;
        const ay = p.by + (p.dy - p.by) * toDisp;
        const az = p.bz + (p.dz - p.bz) * toDisp;
        p.x = ax + (p.sx - ax) * toSphere;
        p.y = ay + (p.sy - ay) * toSphere;
        p.z = az + (p.sz - az) * toSphere;

        // rotate Y then X
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.x * sinY + p.z * cosY;
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        order[i]!.i = i;
        order[i]!.z = z2;
        // stash projected depth on the particle for the draw pass
        (p as unknown as { _px: number })._px = x1;
        (p as unknown as { _py: number })._py = y2;
        (p as unknown as { _pz: number })._pz = z2;
        if (!reduce) p.rot += p.spin;
      }

      // painter's algorithm — far first
      order.sort((a, b) => a.z - b.z);

      for (let k = 0; k < order.length; k += 1) {
        const p = pts[order[k]!.i]!;
        const px = (p as unknown as { _px: number })._px;
        const py = (p as unknown as { _py: number })._py;
        const pz = (p as unknown as { _pz: number })._pz;
        const depth = FOV + pz;
        if (depth <= 1) continue;
        const k2 = FOV / depth;
        const sx = cx + px * k2;
        const sy = cy + py * k2;
        if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;
        // depth cue: nearer = bigger + brighter
        const t = (pz + CLOUD * 2) / (CLOUD * 4);
        const a = p.alpha * (0.30 + 0.70 * Math.max(0, Math.min(1, t)));
        glyph(sx, sy, p.r * k2 * 1.15, p.rot, p.color, a, p.filled);
      }

      // near-camera parallax drifters, drawn last (closest)
      for (const p of near) {
        const x1 = p.bx * cosY - p.bz * sinY;
        const z1 = p.bx * sinY + p.bz * cosY;
        const y2 = p.by * cosX - z1 * sinX;
        const z2 = p.by * sinX + z1 * cosX;
        const depth = FOV + z2 - 520; // pulled toward the camera
        if (depth <= 1) continue;
        const k2 = FOV / depth;
        const sx = cx + x1 * k2, sy = cy + y2 * k2;
        if (!reduce) p.rot += p.spin;
        glyph(sx, sy, p.r * k2, p.rot, p.color, p.alpha * 0.35, false);
      }

      ctx!.globalAlpha = 1;
      if (!reduce) raf = window.requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      ptr.tx = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }
    function onScroll() {
      const max = Math.max(1, document.body.scrollHeight - window.innerHeight);
      scrollTarget = Math.min(1, window.scrollY / max);
    }

    resize();
    onScroll();
    frame();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10"
      data-testid="interactive-background"
    />
  );
}
