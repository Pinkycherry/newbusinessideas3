import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Link } from "@tanstack/react-router";

/**
 * BUSINESS BRAIN — a living constellation of business opportunities.
 *
 * Thousands of tiny triangles arranged into an organic brain silhouette. Every
 * particle is an "opportunity"; clusters on the surface map to real category
 * routes on the site. Rendered as a single instanced draw call, with all
 * per-particle motion, mouse displacement and cluster response computed in the
 * vertex shader so React never re-renders during animation.
 *
 * Integration rules honoured here:
 *  - purely additive: lives inside its own section, covers no existing content
 *  - the canvas is `pointer-events: none`; hover/click is handled by a sibling
 *    overlay, so site buttons and links are never intercepted
 *  - particle budget adapts to viewport/device; animation pauses when the tab
 *    is hidden; `prefers-reduced-motion` drops motion to a near-still field
 */

/** Clusters map to real category routes that already exist on the site. */
const CLUSTERS: { label: string; slug: string; dir: [number, number, number] }[] = [
  { label: "AI & Automation", slug: "app-software-side-income-ideas", dir: [0.42, 0.55, 0.72] },
  { label: "Online Business", slug: "online-business-ideas", dir: [-0.5, 0.5, 0.7] },
  { label: "Low Investment", slug: "low-investment-business-ideas", dir: [0.82, 0.14, 0.55] },
  { label: "Zero Investment", slug: "zero-investment-business-ideas", dir: [-0.86, 0.2, 0.46] },
  { label: "Side Hustles", slug: "side-hustle-ideas", dir: [0.62, -0.32, 0.72] },
  { label: "Work From Home", slug: "work-from-home-business-ideas", dir: [-0.6, -0.3, 0.74] },
  { label: "Passive Income", slug: "passive-income-business-ideas", dir: [0.2, 0.86, 0.1] },
  { label: "Local Services", slug: "local-service-business-ideas", dir: [-0.22, 0.8, -0.35] },
  { label: "Food & Home Kitchen", slug: "food-from-home-business-ideas", dir: [0.74, 0.24, -0.6] },
  { label: "Creator & Content", slug: "writing-content-business-ideas", dir: [-0.76, 0.2, -0.56] },
  { label: "Subscription Models", slug: "subscription-based-business-ideas", dir: [0.3, -0.6, -0.66] },
  { label: "Recurring Revenue", slug: "recurring-revenue-business-ideas", dir: [-0.34, -0.56, -0.7] },
];

/** Opportunity palette: brand indigo/violet lifted by signal accents. */
const COLORS = [
  new THREE.Color("#4643BA"), // BBI primary
  new THREE.Color("#8886DB"), // BBI ember
  new THREE.Color("#7C5CFF"), // electric violet
  new THREE.Color("#4C7DFF"), // blue
  new THREE.Color("#39C6E8"), // cyan
  new THREE.Color("#2FBFA0"), // teal
  new THREE.Color("#FFB43A"), // amber — money signal
  new THREE.Color("#FF6FC4"), // magenta
  new THREE.Color("#E8E6FF"), // near-white spark
];

const VERT = /* glsl */ `
  attribute vec3 iPos;
  attribute vec3 iColor;
  attribute float iSize;
  attribute float iRot;
  attribute float iSeed;
  attribute float iCluster;
  attribute float iAmbient;

  uniform float uTime;
  uniform vec3  uTrail[6];
  uniform float uTrailAge[6];
  uniform float uActive;      // active cluster index, -1 when none
  uniform vec3  uActivePos;
  uniform float uActiveMix;   // 0..1 eased activation
  uniform float uMotion;      // 0 under reduced-motion, 1 normally

  varying vec3  vColor;
  varying float vGlow;
  varying float vDepthFade;

  // cheap value noise — enough character without a texture fetch
  float n1(float x){ return fract(sin(x * 43758.5453) * 12345.6789); }

  void main() {
    vec3 p = iPos;
    float t = uTime;

    // ---- continuous life: layered sinusoids per particle seed ----
    float s = iSeed * 6.2831;
    vec3 breathe = vec3(
      sin(t * 0.35 + s)        * 0.9,
      cos(t * 0.28 + s * 1.7)  * 0.9,
      sin(t * 0.31 + s * 2.3)  * 0.9
    );
    // slow global "thinking" pulse — the whole field expands a hair
    float pulse = 1.0 + sin(t * 0.22 + length(iPos) * 0.02) * 0.012;
    p = p * pulse + breathe * uMotion;

    // ---- cluster activation: gather inward + brighten ----
    float glow = 0.0;
    if (uActive >= 0.0 && abs(iCluster - uActive) < 0.5 && iAmbient < 0.5) {
      vec3 toC = uActivePos - p;
      p += toC * 0.16 * uActiveMix;
      float ring = sin(t * 2.4 - length(toC) * 0.06) * 0.5 + 0.5;
      glow += uActiveMix * (0.55 + ring * 0.45);
    }

    // ---- pointer trail: recent positions displace with decaying strength ----
    for (int i = 0; i < 6; i++) {
      vec3 m = uTrail[i];
      float age = uTrailAge[i];
      if (age <= 0.0) continue;
      vec3 d = p - m;
      float dist = length(d);
      float R = 78.0;
      if (dist < R) {
        // smooth falloff, no hard edge
        float f = 1.0 - smoothstep(0.0, R, dist);
        f = f * f * age;
        p += normalize(d + 0.0001) * f * 26.0;
        glow += f * 0.9;
      }
    }

    // ---- billboard the triangle, rotate it in screen space ----
    float rot = iRot + t * (0.15 + n1(iSeed) * 0.35) * uMotion;
    float c = cos(rot), sn = sin(rot);
    vec2 local = position.xy * iSize * (1.0 + glow * 0.5);
    vec2 spun = vec2(local.x * c - local.y * sn, local.x * sn + local.y * c);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    mv.xy += spun;

    // depth cue: nearer = brighter
    vDepthFade = clamp((mv.z + 420.0) / 780.0, 0.0, 1.0);
    vColor = iColor;
    vGlow = glow;

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec3  vColor;
  varying float vGlow;
  varying float vDepthFade;
  uniform float uOpacity;

  void main() {
    float base = 0.20 + vDepthFade * 0.72;
    vec3 col = mix(vColor, vec3(1.0), vGlow * 0.45);
    gl_FragColor = vec4(col, (base + vGlow * 0.5) * uOpacity);
  }
`;

export function BusinessBrain() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [active, setActive] = useState<number>(-1);
  const [labelPos, setLabelPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, reduce ? 1 : 1.75);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — section still renders its copy, just without the canvas
    }
    renderer.setPixelRatio(dpr);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 1, 3000);
    camera.position.set(0, 0, 620);

    // ---- particle budget adapts to viewport / device ----
    const w0 = host.clientWidth;
    const cores = (navigator as Navigator & { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
    const weak = cores <= 4 || w0 < 700;
    const BRAIN = reduce ? 2600 : weak ? 4200 : w0 < 1200 ? 6500 : 9000;
    const AMBIENT = reduce ? 260 : weak ? 420 : 900;
    const TOTAL = BRAIN + AMBIENT;

    const R = 210; // brain radius in world units

    /** fbm-ish noise for organic surface displacement */
    function hash(x: number, y: number, z: number) {
      const s = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
      return s - Math.floor(s);
    }
    function surfaceBump(x: number, y: number, z: number) {
      return (
        Math.sin(x * 3.1 + z * 2.2) * 0.052 +
        Math.cos(y * 3.8 - x * 2.6) * 0.041 +
        Math.sin((x + y + z) * 5.4) * 0.026 +
        (hash(x, y, z) - 0.5) * 0.03
      );
    }

    /** One point on the organic brain shell. */
    function brainPoint(): THREE.Vector3 | null {
      // cerebellum lobe, rear-lower
      if (Math.random() < 0.11) {
        const u = Math.random(), v = Math.random();
        const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1);
        return new THREE.Vector3(
          Math.sin(ph) * Math.cos(th) * 0.36,
          Math.sin(ph) * Math.sin(th) * 0.24 - 0.60,
          Math.cos(ph) * 0.30 - 0.56,
        ).multiplyScalar(R);
      }
      const u = Math.random(), v = Math.random();
      const th = 2 * Math.PI * u, ph = Math.acos(2 * v - 1);
      let x = Math.sin(ph) * Math.cos(th);
      let y = Math.sin(ph) * Math.sin(th);
      let z = Math.cos(ph);
      // ellipsoid: longer front-back, asymmetric left/right so it never reads clinical
      x *= 0.70 + (x > 0 ? 0.045 : 0);
      y *= 0.70;
      z *= 1.18;
      const b = surfaceBump(x * 3, y * 3, z * 3);
      x += x * b; y += y * b; z += z * b;
      if (z > 0.42) { x *= 0.90; y *= 0.93; }      // frontal taper
      if (z < -0.55) { y += 0.06; }                 // occipital lift
      // longitudinal fissure
      if (Math.abs(x) < 0.075 && y > -0.22) {
        if (Math.random() > 0.14) return null;
        y -= 0.035;
      }
      return new THREE.Vector3(x, y, z).multiplyScalar(R);
    }

    // ---- build instance buffers ----
    const iPos = new Float32Array(TOTAL * 3);
    const iColor = new Float32Array(TOTAL * 3);
    const iSize = new Float32Array(TOTAL);
    const iRot = new Float32Array(TOTAL);
    const iSeed = new Float32Array(TOTAL);
    const iCluster = new Float32Array(TOTAL);
    const iAmbient = new Float32Array(TOTAL);

    const clusterDirs = CLUSTERS.map((c) => new THREE.Vector3(...c.dir).normalize());
    const clusterPos = clusterDirs.map((d) => d.clone().multiplyScalar(R * 0.92));

    let i = 0;
    while (i < BRAIN) {
      const p = brainPoint();
      if (!p) continue;
      // nearest cluster on the shell
      let best = 0, bestD = Infinity;
      for (let c = 0; c < clusterPos.length; c += 1) {
        const d = p.distanceToSquared(clusterPos[c]!);
        if (d < bestD) { bestD = d; best = c; }
      }
      iPos[i * 3] = p.x; iPos[i * 3 + 1] = p.y; iPos[i * 3 + 2] = p.z;
      // most particles subtle, a minority act as bright "signals"
      const signal = Math.random() < 0.09;
      const col = COLORS[(Math.random() * COLORS.length) | 0]!;
      iColor[i * 3] = col.r; iColor[i * 3 + 1] = col.g; iColor[i * 3 + 2] = col.b;
      iSize[i] = (signal ? 2.6 : 1.35) + Math.random() * (signal ? 2.2 : 1.15);
      iRot[i] = Math.random() * Math.PI * 2;
      iSeed[i] = Math.random();
      iCluster[i] = best;
      iAmbient[i] = 0;
      i += 1;
    }
    // ambient field — unorganised opportunities drifting around the brain
    for (let a = 0; a < AMBIENT; a += 1) {
      const k = BRAIN + a;
      const dir = new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1).normalize();
      const rad = R * (1.35 + Math.random() * 1.5);
      const p = dir.multiplyScalar(rad);
      iPos[k * 3] = p.x; iPos[k * 3 + 1] = p.y; iPos[k * 3 + 2] = p.z;
      const col = COLORS[(Math.random() * COLORS.length) | 0]!;
      iColor[k * 3] = col.r; iColor[k * 3 + 1] = col.g; iColor[k * 3 + 2] = col.b;
      iSize[k] = 1.1 + Math.random() * 2.4;
      iRot[k] = Math.random() * Math.PI * 2;
      iSeed[k] = Math.random();
      iCluster[k] = -1;
      iAmbient[k] = 1;
    }

    // base geometry: one small triangle, billboarded in the shader
    const tri = new THREE.BufferGeometry();
    tri.setAttribute("position", new THREE.Float32BufferAttribute(
      [0, 1.15, 0, -1.0, -0.7, 0, 1.0, -0.7, 0], 3,
    ));
    const geo = new THREE.InstancedBufferGeometry();
    geo.index = tri.index;
    geo.attributes["position"] = tri.attributes["position"]!;
    geo.instanceCount = TOTAL;
    geo.setAttribute("iPos", new THREE.InstancedBufferAttribute(iPos, 3));
    geo.setAttribute("iColor", new THREE.InstancedBufferAttribute(iColor, 3));
    geo.setAttribute("iSize", new THREE.InstancedBufferAttribute(iSize, 1));
    geo.setAttribute("iRot", new THREE.InstancedBufferAttribute(iRot, 1));
    geo.setAttribute("iSeed", new THREE.InstancedBufferAttribute(iSeed, 1));
    geo.setAttribute("iCluster", new THREE.InstancedBufferAttribute(iCluster, 1));
    geo.setAttribute("iAmbient", new THREE.InstancedBufferAttribute(iAmbient, 1));

    const uniforms = {
      uTime: { value: 0 },
      uTrail: { value: Array.from({ length: 6 }, () => new THREE.Vector3(9999, 9999, 9999)) },
      uTrailAge: { value: new Float32Array(6) },
      uActive: { value: -1 },
      uActivePos: { value: new THREE.Vector3() },
      uActiveMix: { value: 0 },
      uMotion: { value: reduce ? 0 : 1 },
      uOpacity: { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG, uniforms,
      transparent: true, depthWrite: false, blending: THREE.NormalBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.set(0.06, 0.95, 0);
    mesh.frustumCulled = false;
    scene.add(mesh);

    // sparse connections, only drawn around the active cluster
    const LINKS = 90;
    const linkGeo = new THREE.BufferGeometry();
    const linkPos = new Float32Array(LINKS * 6);
    linkGeo.setAttribute("position", new THREE.BufferAttribute(linkPos, 3));
    const linkMat = new THREE.LineBasicMaterial({ color: 0x9d8bff, transparent: true, opacity: 0 });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    links.frustumCulled = false;
    scene.add(links);

    // ---- pointer state ----
    const trail = uniforms.uTrail.value as THREE.Vector3[];
    const ages = uniforms.uTrailAge.value as Float32Array;
    let trailIdx = 0;
    const ndc = new THREE.Vector2(-2, -2);
    let hovering = false;
    let activeIdx = -1;
    let activeMix = 0;
    let lastPush = 0;

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();

    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ray = new THREE.Raycaster();
    const worldPt = new THREE.Vector3();

    function onMove(e: PointerEvent) {
      const r = host!.getBoundingClientRect();
      hovering = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (!hovering) return;
      ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      ray.setFromCamera(ndc, camera);
      ray.ray.intersectPlane(plane, worldPt);
      const now = performance.now();
      if (now - lastPush > 55) { // seed a new trail point
        lastPush = now;
        trailIdx = (trailIdx + 1) % 6;
        trail[trailIdx]!.copy(worldPt);
        ages[trailIdx] = 1;
      }
    }
    function onLeave() { hovering = false; }

    let raf = 0;
    let visible = true;
    let running = true;
    const clock = new THREE.Clock();

    function frame() {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      uniforms.uTime.value += dt;
      // fade the section in once
      uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + dt * 0.7);

      // decay pointer trail — this is the "memory" of the cursor
      for (let k = 0; k < 6; k += 1) {
        if (ages[k]! > 0) ages[k] = Math.max(0, ages[k]! - dt * 0.85);
      }

      // which cluster is the pointer over? screen-space nearest, with a threshold
      let want = -1;
      if (hovering && !reduce) {
        let bestD = Infinity, bestI = -1;
        for (let c = 0; c < clusterPos.length; c += 1) {
          const v = clusterPos[c]!.clone().project(camera);
          if (v.z > 1) continue; // behind camera
          const d = (v.x - ndc.x) ** 2 + (v.y - ndc.y) ** 2;
          if (d < bestD) { bestD = d; bestI = c; }
        }
        if (bestD < 0.035) want = bestI;
      }
      if (want !== activeIdx) {
        activeIdx = want;
        setActive(want);
      }
      const target = activeIdx >= 0 ? 1 : 0;
      activeMix += (target - activeMix) * Math.min(1, dt * 4.5);
      uniforms.uActiveMix.value = activeMix;
      uniforms.uActive.value = activeIdx;
      if (activeIdx >= 0) {
        uniforms.uActivePos.value.copy(clusterPos[activeIdx]!);
        // project centroid for the floating label
        const v = clusterPos[activeIdx]!.clone().project(camera);
        setLabelPos({ x: (v.x * 0.5 + 0.5) * host!.clientWidth, y: (-v.y * 0.5 + 0.5) * host!.clientHeight });
      } else if (activeMix < 0.02) {
        setLabelPos(null);
      }

      // brief connections inside the active cluster
      linkMat.opacity = activeMix * 0.3;
      if (activeMix > 0.02 && activeIdx >= 0) {
        const cp = clusterPos[activeIdx]!;
        let n = 0;
        for (let k = 0; k < TOTAL && n < LINKS; k += 7) {
          if (iCluster[k] !== activeIdx) continue;
          const x = iPos[k * 3]!, y = iPos[k * 3 + 1]!, z = iPos[k * 3 + 2]!;
          linkPos[n * 6] = cp.x; linkPos[n * 6 + 1] = cp.y; linkPos[n * 6 + 2] = cp.z;
          linkPos[n * 6 + 3] = x; linkPos[n * 6 + 4] = y; linkPos[n * 6 + 5] = z;
          n += 1;
        }
        for (let k = n; k < LINKS; k += 1) {
          for (let q = 0; q < 6; q += 1) linkPos[k * 6 + q] = 0;
        }
        (linkGeo.attributes["position"] as THREE.BufferAttribute).needsUpdate = true;
      }

      // extremely slow drift so the silhouette never reads as a spinning object
      if (!reduce) {
        mesh.rotation.y = 0.95 + Math.sin(uniforms.uTime.value * 0.055) * 0.16;
        mesh.rotation.x = 0.06 + Math.sin(uniforms.uTime.value * 0.041) * 0.06;
        links.rotation.copy(mesh.rotation);
      }

      renderer.render(scene, camera);
    }
    frame();

    function onVis() { visible = document.visibilityState === "visible"; if (visible) clock.getDelta(); }
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    window.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      geo.dispose(); tri.dispose(); mat.dispose(); linkGeo.dispose(); linkMat.dispose();
      renderer.dispose();
    };
  }, []);

  const activeCluster = active >= 0 ? CLUSTERS[active] : undefined;

  return (
    <div
      ref={hostRef}
      className="relative h-[78vh] max-h-[820px] min-h-[440px] w-full overflow-hidden rounded-3xl"
      style={{ background: "radial-gradient(120% 90% at 50% 40%, #12122e 0%, #0a0a1c 55%, #06060f 100%)" }}
    >
      {/* decorative canvas — never intercepts clicks */}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />

      {/* floating cluster label; the anchor is the only interactive element */}
      {activeCluster && labelPos && (
        <Link
          to="/category/$categorySlug"
          params={{ categorySlug: activeCluster.slug }}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-sm transition-colors hover:bg-white/20"
          style={{ left: labelPos.x, top: labelPos.y }}
        >
          {activeCluster.label}
        </Link>
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 pb-6 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/45">
          Move your cursor through the field
        </p>
      </div>
    </div>
  );
}
