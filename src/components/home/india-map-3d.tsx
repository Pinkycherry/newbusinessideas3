import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, MapPin } from "lucide-react";

import { MAP_CITIES, MAP_H, MAP_STATES, MAP_W, type MapState } from "@/data/india-map";

/**
 * A real 3D India: every state is extruded to a height set by its DPIIT-recognised startups with
 * at least one woman director/partner (PIB release 2241313, 17 Mar 2026, data as on 31 Jan 2026).
 * Server and no-WebGL readers get the flat SVG map with the same numbers; the WebGL scene loads
 * only when the section scrolls into view.
 */

const MAX = Math.max(...MAP_STATES.map((s) => s.total));
const TOTAL = MAP_STATES.reduce((a, s) => a + s.total, 0);
const T2025 = MAP_STATES.reduce((a, s) => a + s.y2025, 0);
const fmt = (n: number) => n.toLocaleString("en-IN");
// Ember theme (black site, 7 Nov 2026 sample): deep maroon -> fire red. Default stays lavender -> indigo.
let EMBER = false;
const shade = (t: number) => {
  // lavender -> brand indigo
  const a = EMBER ? [46, 30, 26] : [228, 224, 255], b = EMBER ? [253, 67, 4] : [62, 46, 205];
  const c = a.map((v, i) => Math.round(v + ((b[i] ?? v) - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
const level = (s: MapState) => Math.log(s.total + 1) / Math.log(MAX + 1);
const rise = (s: MapState) => Math.sqrt(s.total / MAX);

type Hover = { s: MapState; x: number; y: number } | null;
type Label = { name: string; x: number; y: number };

export function IndiaMap3D({ ember = false }: { ember?: boolean } = {}) {
  EMBER = ember;
  const wrapRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const api = useRef<{ select: (id: string | null) => void; zoom: (f: number) => void } | null>(null);
  const [ready, setReady] = useState(false);
  const [hover, setHover] = useState<Hover>(null);
  const [selected, setSelected] = useState<MapState | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const top = useMemo(() => [...MAP_STATES].sort((a, b) => b.total - a.total).slice(0, 7), []);

  useEffect(() => {
    const mount = mountRef.current;
    const wrap = wrapRef.current;
    if (!mount || !wrap) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      // Founder, 8 Nov 2026: the 3D map vanished on his phone. Phones get the flat map, which always draws.
      if (window.innerWidth < 640) return;
      const canvasTest = document.createElement("canvas");
      if (!canvasTest.getContext("webgl2") && !canvasTest.getContext("webgl")) return;
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      if (disposed) return;

      const W0 = mount.clientWidth, H0 = mount.clientHeight;
      // Speed (7 Nov 2026): lighter renderer, no shadow map, no scroll-linked redraws.
      const renderer = new THREE.WebGLRenderer({ antialias: window.devicePixelRatio < 1.5, alpha: true, powerPreference: "low-power" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      renderer.setSize(W0, H0);
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.toneMappingExposure = 0.9;
      renderer.domElement.style.position = "absolute";
      renderer.domElement.style.inset = "0";
      mount.appendChild(renderer.domElement);
      renderer.domElement.style.touchAction = "pan-y";

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(32, W0 / H0, 1, 5000);
      const near = W0 < 640 ? 0.86 : 1;
      const home = { pos: new THREE.Vector3(0, -700 * near, 1120 * near), target: new THREE.Vector3(0, -15, 0) };
      camera.position.copy(home.pos);
      const target = home.target.clone();
      camera.lookAt(target);

      scene.add(new THREE.HemisphereLight(0xffffff, EMBER ? 0x2a1a14 : 0xd9d4ff, 2.2)); // replaces the costly environment map (speed)
      const key = new THREE.DirectionalLight(0xffffff, 1.6);
      key.position.set(-300, -400, 800);
      scene.add(key);
      const rimPink = new THREE.PointLight(EMBER ? 0xfd4304 : 0xff7ab6, 60000, 0, 2);
      rimPink.position.set(380, 300, 260);
      scene.add(rimPink);
      const rimBlue = new THREE.PointLight(EMBER ? 0xba5105 : 0x5aa3ff, 50000, 0, 2);
      rimBlue.position.set(-420, 260, 220);
      scene.add(rimBlue);


      const group = new THREE.Group();
      scene.add(group);
      const svg = `<svg xmlns="http://www.w3.org/2000/svg">${MAP_STATES.map((s) => `<path id="${s.id}" d="${s.d}"/>`).join("")}</svg>`;
      const parsed = new SVGLoader().parse(svg);
      type Entry = { s: MapState; mesh: InstanceType<typeof THREE.Mesh>; mat: InstanceType<typeof THREE.MeshStandardMaterial>; h: number; lift: number; base: InstanceType<typeof THREE.Color> };
      const entries: Entry[] = [];
      const edgeMat = new THREE.LineBasicMaterial({ color: EMBER ? 0xffb08a : 0xffffff, transparent: true, opacity: EMBER ? 0.45 : 0.75 });
      parsed.paths.forEach((p) => {
        const id = (p.userData as { node: Element }).node.getAttribute("id");
        const s = MAP_STATES.find((x) => x.id === id);
        if (!s) return;
        const t = level(s);
        const h = 5 + 62 * rise(s);
        const shapes = SVGLoader.createShapes(p);
        const geo = new THREE.ExtrudeGeometry(shapes, { depth: h, bevelEnabled: true, bevelThickness: 1.2, bevelSize: 0.6, bevelSegments: 1, curveSegments: 2 });
        geo.translate(-MAP_W / 2, -MAP_H / 2, 0);
        const base = new THREE.Color(shade(t));
        const mat = new THREE.MeshStandardMaterial({
          color: base, roughness: 0.3, metalness: 0.0, envMapIntensity: 0.35,
          side: THREE.FrontSide,
          emissive: new THREE.Color(EMBER ? 0xfd4304 : 0x7b6ff0), emissiveIntensity: 0,
        });
        const side = new THREE.MeshStandardMaterial({ color: new THREE.Color(shade(Math.min(1, t + 0.25))).multiplyScalar(0.85), roughness: 0.25, envMapIntensity: 0.8, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, [mat, side]);
        mesh.scale.y = -1; // SVG y runs down; a negative scale flips it and three.js keeps faces correct
        mesh.userData['id'] = s.id;
        const edges = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 35), edgeMat);
        mesh.add(edges);
        group.add(mesh);
        entries.push({ s, mesh, mat, h, lift: 0, base });
      });

      // glowing city dots sitting on top of their state
      const dotGeo = new THREE.SphereGeometry(2.6, 16, 12);
      const dotMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: EMBER ? 0xffd2b0 : 0xff7ab6, emissiveIntensity: 1.4, roughness: 0.3 });
      const cityPts = MAP_CITIES.map((c) => {
        const e = entries.find((x) => x.s.id === c.stateId);
        const z = (e ? e.h : 8) + 4;
        const m = new THREE.Mesh(dotGeo, dotMat);
        m.position.set(c.x - MAP_W / 2, -(c.y - MAP_H / 2), z);
        group.add(m);
        return { c, m };
      });

      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2();
      let hovered: Entry | null = null;
      let selectedId: string | null = null;
      const camGoal = { pos: home.pos.clone(), target: home.target.clone() };

      const pick = (ev: PointerEvent) => {
        const r = renderer.domElement.getBoundingClientRect();
        ndc.set(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(entries.map((e) => e.mesh), false)[0];
        return { hit: hit ? entries.find((e) => e.mesh === hit.object) ?? null : null, x: ev.clientX - r.left, y: ev.clientY - r.top };
      };
      const onMove = (ev: PointerEvent) => {
        if (ev.pointerType === "touch") return;
        const { hit, x, y } = pick(ev);
        hovered = hit;
        renderer.domElement.style.cursor = hit ? "pointer" : "grab";
        setHover(hit ? { s: hit.s, x, y } : null);
      };
      const onLeave = () => { hovered = null; setHover(null); };
      let downAt = { x: 0, y: 0 };
      const onDown = (ev: PointerEvent) => { downAt = { x: ev.clientX, y: ev.clientY }; };
      const onUp = (ev: PointerEvent) => {
        if (Math.hypot(ev.clientX - downAt.x, ev.clientY - downAt.y) > 6) return;
        const { hit, x, y } = pick(ev);
        if (ev.pointerType === "touch") setHover(hit ? { s: hit.s, x, y } : null);
        select(hit ? hit.s.id : null);
      };

      // drag to turn the map a little (desktop); never captures page scroll
      let dragging = false, lastX = 0, lastY = 0, yaw = 0, pitch = 0, yawGoal = 0, pitchGoal = 0;
      const onDragStart = (ev: PointerEvent) => { if (ev.pointerType === "touch") return; dragging = true; lastX = ev.clientX; lastY = ev.clientY; };
      const onDragMove = (ev: PointerEvent) => {
        if (!dragging) return;
        yawGoal = Math.max(-0.6, Math.min(0.6, yawGoal + (ev.clientX - lastX) * 0.004));
        pitchGoal = Math.max(-0.25, Math.min(0.35, pitchGoal + (ev.clientY - lastY) * 0.003));
        lastX = ev.clientX; lastY = ev.clientY;
      };
      const onDragEnd = () => { dragging = false; };

      const select = (id: string | null) => {
        selectedId = id;
        const e = entries.find((x) => x.s.id === id) ?? null;
        setSelected(e ? e.s : null);
        if (!e) { camGoal.pos.copy(home.pos); camGoal.target.copy(home.target); return; }
        const [x0 = 0, y0 = 0, x1 = 0, y1 = 0] = e.s.box;
        const cx = (x0 + x1) / 2 - MAP_W / 2, cy = -((y0 + y1) / 2 - MAP_H / 2);
        const size = Math.max(x1 - x0, y1 - y0, 40);
        const dist = Math.min(900, size * 3.2 + 160);
        camGoal.target.set(cx, cy, e.h);
        camGoal.pos.set(cx, cy - dist * 0.55, e.h + dist * 0.85);
      };
      const zoom = (f: number) => {
        const dir = camGoal.pos.clone().sub(camGoal.target);
        const len = Math.max(140, Math.min(1500, dir.length() * f));
        camGoal.pos.copy(camGoal.target.clone().add(dir.setLength(len)));
      };
      api.current = { select, zoom };

      const el = renderer.domElement;
      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      el.addEventListener("pointerdown", onDown);
      el.addEventListener("pointerup", onUp);
      el.addEventListener("pointerdown", onDragStart);
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragEnd);

      const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      let visible = true;
      const io = new IntersectionObserver(([en]) => { visible = !!en?.isIntersecting; }, { threshold: 0 });
      io.observe(wrap);

      let raf = 0;
      const clock = new THREE.Clock();
      const v = new THREE.Vector3();
      let labelTick = 0;
      let hadLabels = false;
      let lastProg = -1;
      let settleFrames = 30;
      const glow = new THREE.Color(EMBER ? 0xff6a35 : 0x8f86ff);
      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!visible) return;
        clock.getElapsedTime();
        // scroll: the map tilts up as the section rises through the screen
        const prog = 0.5; // no scroll-linked tilt (founder, 7 Nov 2026)
        // render only while something moves: keeps scrolling smooth on phones
        const moving = Math.abs(prog - lastProg) > 0.0005 || Math.abs(yawGoal - yaw) > 1e-4 || Math.abs(pitchGoal - pitch) > 1e-4 ||
          camera.position.distanceTo(camGoal.pos) > 0.3 || target.distanceTo(camGoal.target) > 0.3 ||
          entries.some((e) => Math.abs((e === hovered || e.s.id === selectedId ? 1 : 0) - e.lift) > 0.01);
        if (moving) settleFrames = 6;
        else if (settleFrames-- <= 0) return;
        lastProg = prog;
        yaw += (yawGoal - yaw) * 0.08;
        pitch += (pitchGoal - pitch) * 0.08;
        group.rotation.z = yaw;
        group.rotation.x = pitch;
        camera.position.lerp(camGoal.pos, 0.07);
        target.lerp(camGoal.target, 0.07);
        camera.lookAt(target);
        for (const e of entries) {
          const goal = e === hovered || e.s.id === selectedId ? 1 : 0;
          e.lift += (goal - e.lift) * 0.15;
          e.mesh.position.z = e.lift * 14;
          e.mat.emissiveIntensity = e.lift * 0.45;
          e.mat.color.copy(e.base).lerp(glow, e.lift * 0.35);
        }
        for (const { c, m } of cityPts) {
          const on = !selectedId || c.stateId === selectedId;
          const e = entries.find((x) => x.s.id === c.stateId);
          m.position.z = (e ? e.h + e.mesh.position.z : 8) + 4;
          m.scale.setScalar(on ? (selectedId ? 1.5 : 1) : 0.001);
        }
        renderer.render(scene, camera);
        if (++labelTick % 4 === 0) {
          if (!selectedId) { if (hadLabels) { hadLabels = false; setLabels([]); } }
          else {
            const rr = el.getBoundingClientRect();
            const next: Label[] = [];
            for (const { c, m } of cityPts) {
              if (c.stateId !== selectedId) continue;
              m.getWorldPosition(v);
              v.project(camera);
              next.push({ name: c.name, x: ((v.x + 1) / 2) * rr.width, y: ((1 - v.y) / 2) * rr.height });
            }
            hadLabels = true;
            setLabels(next);
          }
        }
      };
      renderer.domElement.addEventListener("webglcontextlost", (ev) => { ev.preventDefault(); setReady(false); });
      renderer.render(scene, camera);
      loop();
      if (renderer.info.render.calls > 0) setReady(true);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
        el.removeEventListener("pointerdown", onDown);
        el.removeEventListener("pointerup", onUp);
        el.removeEventListener("pointerdown", onDragStart);
        window.removeEventListener("pointermove", onDragMove);
        window.removeEventListener("pointerup", onDragEnd);
        // Leaving the home page must never throw: state meshes carry an array of materials.
        scene.traverse((o) => {
          const m = o as unknown as { geometry?: { dispose?: () => void }; material?: { dispose?: () => void } | { dispose?: () => void }[] };
          m.geometry?.dispose?.();
          const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
          mats.forEach((x) => x.dispose?.());
        });
        renderer.dispose();
        el.remove();
      };
    };

    const gate = new IntersectionObserver(([en]) => {
      if (en?.isIntersecting) { gate.disconnect(); const go = () => { void start().catch(() => setReady(false)); }; if ("requestIdleCallback" in window) (window as unknown as { requestIdleCallback: (f: () => void, o?: { timeout: number }) => void }).requestIdleCallback(go, { timeout: 1500 }); else setTimeout(go, 200); }
    }, { rootMargin: "300px" });
    gate.observe(wrap);
    return () => { disposed = true; gate.disconnect(); try { cleanup(); } catch (e) { console.error("map cleanup", e); } };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const info = selected ?? hover?.s ?? null;

  return (
    <div ref={wrapRef} className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.65fr] [&>*]:min-w-0">
      <div className="relative">
        <div aria-hidden className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(124,111,240,0.28),transparent_65%)] blur-2xl" />
        <div ref={mountRef} className="relative aspect-[6/6.4] w-full sm:aspect-[6/5.6]">
          {/* Flat map for first paint, search engines and devices without WebGL */}
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} role="img" aria-label="Map of India: women-led startups recognised by DPIIT in each state" className={"absolute inset-0 h-full w-full transition-opacity duration-700 " + (ready ? "pointer-events-none opacity-0" : "opacity-100")} style={{ filter: ember ? "drop-shadow(0 8px 0 #2a1a14) drop-shadow(0 24px 30px rgba(253,67,4,.3))" : "drop-shadow(0 8px 0 #c9c3ff) drop-shadow(0 24px 30px rgba(70,67,186,.25))" }}>
            {MAP_STATES.map((s) => (
              <path key={s.id} d={s.d} fill={shade(level(s))} stroke={ember ? "#ffb08a" : "#fff"} strokeWidth={0.8}>
                <title>{`${s.name}: ${fmt(s.total)} women-led startups recognised (since 2017)`}</title>
              </path>
            ))}
          </svg>
        </div>

        {hover && !selected && (
          <div className="pointer-events-none absolute z-10 w-56 -translate-x-1/2 -translate-y-[115%] rounded-2xl border border-white/80 bg-white/80 p-3 shadow-[0_20px_40px_-20px_rgba(70,67,186,0.8)] backdrop-blur-xl" style={{ left: hover.x, top: hover.y }}>
            <p className="font-display text-sm font-semibold text-slate-900">{hover.s.name}</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#4643ba]">{fmt(hover.s.total)}</p>
            <p className="text-[11px] leading-tight text-slate-500">women-led startups recognised since 2017</p>
            <p className="mt-1.5 text-xs text-slate-600"><span className="font-semibold text-slate-900">{fmt(hover.s.y2025)}</span> in 2025 · <span className="font-semibold text-slate-900">{fmt(hover.s.y2026)}</span> in Jan 2026</p>
            <p className="mt-1 text-[10px] text-[#7b6ff0]">Click to zoom in</p>
          </div>
        )}
        {labels.map((l) => (
          <span key={l.name} className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[160%] whitespace-nowrap rounded-full border border-white/90 bg-white/85 px-2 py-0.5 text-[11px] font-semibold text-slate-800 shadow-md backdrop-blur" style={{ left: l.x, top: l.y }}>
            <MapPin aria-hidden size={10} className="mr-0.5 inline text-[#d6337f]" />{l.name}
          </span>
        ))}

        <div className="absolute bottom-3 left-3 z-10 flex gap-2">
          <button type="button" aria-label="Zoom in" onClick={() => api.current?.zoom(0.75)} className="g-btn-light !min-h-10 !px-3"><Plus size={16} /></button>
          <button type="button" aria-label="Zoom out" onClick={() => api.current?.zoom(1.3)} className="g-btn-light !min-h-10 !px-3"><Minus size={16} /></button>
          {selected && <button type="button" onClick={() => api.current?.select(null)} className="g-btn-light !min-h-10 !px-3"><RotateCcw size={15} /> All of India</button>}
        </div>
        <p className="absolute right-3 bottom-3 z-10 hidden rounded-full bg-white/70 px-2.5 py-1 text-[10px] text-slate-500 backdrop-blur sm:block">Hover a state · click to zoom · drag to turn</p>
      </div>

      {/* Dashboard panel */}
      <div className="g-tile p-5 sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#4643ba]">{info ? "State close-up" : "All of India"}</p>
        {info ? (
          <>
            <h3 className="mt-1 font-display text-xl font-semibold text-slate-900">{info.name}</h3>
            <p className="mt-3 font-display text-4xl font-bold tracking-tight text-[#4643ba]">{fmt(info.total)}</p>
            <p className="text-xs text-slate-500">women-led startups recognised by DPIIT since 2017</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#4643ba]/10"><p className="font-display text-lg font-bold text-slate-900">{fmt(info.y2025)}</p><p className="text-[11px] text-slate-500">recognised in 2025</p></div>
              <div className="rounded-xl bg-white/80 p-3 ring-1 ring-[#4643ba]/10"><p className="font-display text-lg font-bold text-slate-900">{fmt(info.y2026)}</p><p className="text-[11px] text-slate-500">in January 2026</p></div>
            </div>
            <p className="mt-3 text-xs text-slate-500">{((info.total / TOTAL) * 100).toFixed(1)}% of India's women-led startups. Pink dots are cities on the map; state-level data only, city counts are not published.</p>
          </>
        ) : (
          <>
            <p className="mt-2 font-display text-4xl font-bold tracking-tight text-slate-900">{fmt(TOTAL)}</p>
            <p className="text-xs text-slate-500">startups with at least one woman director or partner, out of 2,12,283 recognised by DPIIT</p>
            <p className="mt-2 text-sm text-slate-600"><span className="font-semibold text-slate-900">{fmt(T2025)}</span> of them were recognised in 2025 alone.</p>
          </>
        )}
        <ul className="mt-5 space-y-2">
          {top.map((s) => (
            <li key={s.id}>
              <button type="button" onClick={() => api.current?.select(s.id)} className={"group w-full rounded-lg px-1 py-0.5 text-left transition hover:bg-white/70 " + (selected?.id === s.id ? "bg-white/80" : "")}>
                <span className="flex justify-between text-xs"><span className="font-medium text-slate-700 group-hover:text-[#4643ba]">{s.name}</span><span className="font-semibold text-slate-900">{fmt(s.total)}</span></span>
                <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#4643ba]/10"><span className="block h-full rounded-full bg-gradient-to-r from-[#8f86ff] to-[#4643ba]" style={{ width: `${(s.total / MAX) * 100}%` }} /></span>
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[10px] leading-relaxed text-slate-400">
          Source: <a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2241313" target="_blank" rel="noopener noreferrer" className="underline">PIB, Ministry of Commerce and Industry, 17 Mar 2026</a> (data as on 31 Jan 2026). Jammu and Kashmir includes Ladakh. Boundaries: <a href="https://github.com/datameet/maps" target="_blank" rel="noopener noreferrer" className="underline">DataMeet</a>, CC BY 4.0.
        </p>
      </div>
    </div>
  );
}
