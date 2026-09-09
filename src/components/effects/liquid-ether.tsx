/**
 * LiquidEther — GPU fluid simulation used as an ambient ground layer.
 *
 * Ported from React Bits (https://reactbits.dev, MIT) to this project's stack:
 * JavaScript -> strict TypeScript, and the render-pass base class renamed so
 * subclasses can take their own `update(props)` signatures without violating
 * `noImplicitOverride`.
 *
 * Defaults are BBI brand ink, not the upstream demo palette.
 *
 * The canvas is inert: `pointer-events-none` means it never intercepts clicks,
 * and it drives itself from pointer movement over the container. It pauses when
 * scrolled out of view or the tab is hidden, and renders a single static frame
 * when the visitor prefers reduced motion.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";

/** BBI ink: brand indigo -> soft violet -> pale violet. */
export const BRAND_ETHER_COLORS = ["#4643BA", "#8886DB", "#B6B5E3"] as const;

/**
 * The paper the field is printed on.
 *
 * The colour ramp is mixed toward this at low velocity. It must be the real
 * page ground: leaving it black — the upstream default for a transparent
 * canvas — makes every soft edge of the fluid fade through grey before its
 * alpha reaches zero, which reads as smoke over the page rather than ink in
 * it.
 */
const PAPER = "#F7F6FB";

export interface LiquidEtherProps {
  /** Hex stops building the velocity-to-color ramp. */
  colors?: readonly string[];
  /** Strength applied to pointer movement when injecting velocity. */
  mouseForce?: number;
  /** Radius of the force brush, in base-resolution pixels. */
  cursorSize?: number;
  /** Simulation texture scale (lower = cheaper, blurrier). */
  resolution?: number;
  /** Fixed simulation timestep. */
  dt?: number;
  /** Error-compensated advection; crisper flow at slight cost. */
  BFECC?: boolean;
  /** Iterative viscosity solve — thicker, smoother motion. */
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  /** Clamp velocity at the edges. */
  isBounce?: boolean;
  /** Drive the pointer automatically while idle. */
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
  /** Page ground the ramp fades into. Defaults to the paper token. */
  groundColor?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function LiquidEther({
  colors = BRAND_ETHER_COLORS,
  mouseForce = 20,
  cursorSize = 100,
  resolution = 0.5,
  dt = 0.014,
  BFECC = true,
  isViscous = false,
  viscous = 30,
  iterationsViscous = 32,
  iterationsPoisson = 32,
  isBounce = false,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6,
  groundColor = PAPER,
  className = "",
  style,
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // Options that only tune the running simulation live in a ref, so changing
  // them never tears down and rebuilds the WebGL context.
  const optsRef = useRef({
    mouseForce,
    cursorSize,
    resolution,
    dt,
    BFECC,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration,
  });
  optsRef.current = {
    mouseForce,
    cursorSize,
    resolution,
    dt,
    BFECC,
    isViscous,
    viscous,
    iterationsViscous,
    iterationsPoisson,
    isBounce,
    autoDemo,
    autoSpeed,
    autoIntensity,
    takeoverDuration,
    autoResumeDelay,
    autoRampDuration,
  };

  const colorKey = colors.join(",");

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const ground = new THREE.Color(groundColor);
    const groundVec = new THREE.Vector4(ground.r, ground.g, ground.b, 0);

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- palette -----------------------------------------------------------
    const stops = colorKey.split(",").filter(Boolean);
    const ramp =
      stops.length === 0
        ? ["#ffffff", "#ffffff"]
        : stops.length === 1
          ? [stops[0]!, stops[0]!]
          : stops;
    const paletteData = new Uint8Array(ramp.length * 4);
    ramp.forEach((hex, i) => {
      const c = new THREE.Color(hex);
      paletteData[i * 4 + 0] = Math.round(c.r * 255);
      paletteData[i * 4 + 1] = Math.round(c.g * 255);
      paletteData[i * 4 + 2] = Math.round(c.b * 255);
      paletteData[i * 4 + 3] = 255;
    });
    const paletteTex = new THREE.DataTexture(paletteData, ramp.length, 1, THREE.RGBAFormat);
    paletteTex.magFilter = THREE.LinearFilter;
    paletteTex.minFilter = THREE.LinearFilter;
    paletteTex.wrapS = THREE.ClampToEdgeWrapping;
    paletteTex.wrapT = THREE.ClampToEdgeWrapping;
    paletteTex.generateMipmaps = false;
    paletteTex.needsUpdate = true;

    // ---- shaders -----------------------------------------------------------
    const face_vert = `
attribute vec3 position;
uniform vec2 px;
uniform vec2 boundarySpace;
varying vec2 uv;
precision highp float;
void main(){
  vec3 pos = position;
  vec2 scale = 1.0 - boundarySpace * 2.0;
  pos.xy = pos.xy * scale;
  uv = vec2(0.5)+(pos.xy)*0.5;
  gl_Position = vec4(pos, 1.0);
}`;
    const line_vert = `
attribute vec3 position;
uniform vec2 px;
precision highp float;
varying vec2 uv;
void main(){
  vec3 pos = position;
  uv = 0.5 + pos.xy * 0.5;
  vec2 n = sign(pos.xy);
  pos.xy = abs(pos.xy) - px * 1.0;
  pos.xy *= n;
  gl_Position = vec4(pos, 1.0);
}`;
    const mouse_vert = `
precision highp float;
attribute vec3 position;
attribute vec2 uv;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 pos = position.xy * scale * 2.0 * px + center;
  vUv = uv;
  gl_Position = vec4(pos, 0.0, 1.0);
}`;
    const advection_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform bool isBFECC;
uniform vec2 fboSize;
uniform vec2 px;
varying vec2 uv;
void main(){
  vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
  if(isBFECC == false){
    vec2 vel = texture2D(velocity, uv).xy;
    vec2 uv2 = uv - vel * dt * ratio;
    vec2 newVel = texture2D(velocity, uv2).xy;
    gl_FragColor = vec4(newVel, 0.0, 0.0);
  } else {
    vec2 spot_new = uv;
    vec2 vel_old = texture2D(velocity, uv).xy;
    vec2 spot_old = spot_new - vel_old * dt * ratio;
    vec2 vel_new1 = texture2D(velocity, spot_old).xy;
    vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
    vec2 error = spot_new2 - spot_new;
    vec2 spot_new3 = spot_new - error / 2.0;
    vec2 vel_2 = texture2D(velocity, spot_new3).xy;
    vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
    vec2 newVel2 = texture2D(velocity, spot_old2).xy;
    gl_FragColor = vec4(newVel2, 0.0, 0.0);
  }
}`;
    const color_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D palette;
uniform vec4 bgColor;
varying vec2 uv;
void main(){
  vec2 vel = texture2D(velocity, uv).xy;
  float lenv = clamp(length(vel), 0.0, 1.0);
  vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
  vec3 outRGB = mix(bgColor.rgb, c, lenv);
  float outA = mix(bgColor.a, 1.0, lenv);
  gl_FragColor = vec4(outRGB, outA);
}`;
    const divergence_frag = `
precision highp float;
uniform sampler2D velocity;
uniform float dt;
uniform vec2 px;
varying vec2 uv;
void main(){
  float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
  float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
  float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
  float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
  float divergence = (x1 - x0 + y1 - y0) / 2.0;
  gl_FragColor = vec4(divergence / dt);
}`;
    const externalForce_frag = `
precision highp float;
uniform vec2 force;
uniform vec2 center;
uniform vec2 scale;
uniform vec2 px;
varying vec2 vUv;
void main(){
  vec2 circle = (vUv - 0.5) * 2.0;
  float d = 1.0 - min(length(circle), 1.0);
  d *= d;
  gl_FragColor = vec4(force * d, 0.0, 1.0);
}`;
    const poisson_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D divergence;
uniform vec2 px;
varying vec2 uv;
void main(){
  float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
  float div = texture2D(divergence, uv).r;
  float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
  gl_FragColor = vec4(newP);
}`;
    const pressure_frag = `
precision highp float;
uniform sampler2D pressure;
uniform sampler2D velocity;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  float step = 1.0;
  float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
  float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
  float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
  float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
  vec2 v = texture2D(velocity, uv).xy;
  vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
  v = v - gradP * dt;
  gl_FragColor = vec4(v, 0.0, 1.0);
}`;
    const viscous_frag = `
precision highp float;
uniform sampler2D velocity;
uniform sampler2D velocity_new;
uniform float v;
uniform vec2 px;
uniform float dt;
varying vec2 uv;
void main(){
  vec2 old = texture2D(velocity, uv).xy;
  vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
  vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
  vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
  vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
  vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
  newv /= 4.0 * (1.0 + v * dt);
  gl_FragColor = vec4(newv, 0.0, 0.0);
}`;

    // ---- renderer ----------------------------------------------------------
    const rect0 = container.getBoundingClientRect();
    let width = Math.max(1, Math.floor(rect0.width));
    let height = Math.max(1, Math.floor(rect0.height));

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.autoClear = false;
    renderer.setClearColor(new THREE.Color(0x000000), 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";

    // ---- pointer -----------------------------------------------------------
    const coords = new THREE.Vector2();
    const coordsOld = new THREE.Vector2();
    const diff = new THREE.Vector2();
    let isHoverInside = false;
    let hasUserControl = false;
    let isAutoActive = false;
    let takeoverActive = false;
    let takeoverStart = 0;
    const takeoverFrom = new THREE.Vector2();
    const takeoverTo = new THREE.Vector2();
    let lastUserInteraction = performance.now();

    const inside = (x: number, y: number) => {
      const r = container.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      return x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
    };
    const setCoords = (x: number, y: number) => {
      const r = container.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      coords.set(((x - r.left) / r.width) * 2 - 1, -(((y - r.top) / r.height) * 2 - 1));
    };
    const onMove = (e: MouseEvent) => {
      isHoverInside = inside(e.clientX, e.clientY);
      if (!isHoverInside) return;
      lastUserInteraction = performance.now();
      if (isAutoActive && !hasUserControl && !takeoverActive) {
        const r = container.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;
        takeoverFrom.copy(coords);
        takeoverTo.set(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          -(((e.clientY - r.top) / r.height) * 2 - 1),
        );
        takeoverStart = performance.now();
        takeoverActive = true;
        hasUserControl = true;
        isAutoActive = false;
        return;
      }
      setCoords(e.clientX, e.clientY);
      hasUserControl = true;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (e.touches.length !== 1 || !t) return;
      isHoverInside = inside(t.clientX, t.clientY);
      if (!isHoverInside) return;
      lastUserInteraction = performance.now();
      setCoords(t.clientX, t.clientY);
      hasUserControl = true;
    };
    const onLeave = () => {
      isHoverInside = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);
    container.ownerDocument.addEventListener("mouseleave", onLeave);

    // Idle auto-drive, so the field is alive before anyone touches it.
    const autoCurrent = new THREE.Vector2(0, 0);
    const autoTarget = new THREE.Vector2();
    const autoTmp = new THREE.Vector2();
    let autoOn = false;
    let autoLast = performance.now();
    let autoActivated = 0;
    const pickTarget = () =>
      autoTarget.set((Math.random() * 2 - 1) * 0.8, (Math.random() * 2 - 1) * 0.8);
    pickTarget();

    const updateAuto = () => {
      const o = optsRef.current;
      if (!o.autoDemo || reduceMotion) return;
      const now = performance.now();
      if (now - lastUserInteraction < o.autoResumeDelay || isHoverInside) {
        autoOn = false;
        isAutoActive = false;
        return;
      }
      if (!autoOn) {
        autoOn = true;
        autoCurrent.copy(coords);
        autoLast = now;
        autoActivated = now;
      }
      isAutoActive = true;
      let dtSec = (now - autoLast) / 1000;
      autoLast = now;
      if (dtSec > 0.2) dtSec = 0.016;
      const dir = autoTmp.subVectors(autoTarget, autoCurrent);
      const dist = dir.length();
      if (dist < 0.01) {
        pickTarget();
        return;
      }
      dir.normalize();
      let ramp = 1;
      if (o.autoRampDuration > 0) {
        const t = Math.min(1, (now - autoActivated) / (o.autoRampDuration * 1000));
        ramp = t * t * (3 - 2 * t);
      }
      autoCurrent.addScaledVector(dir, Math.min(o.autoSpeed * dtSec * ramp, dist));
      coords.set(autoCurrent.x, autoCurrent.y);
    };

    const updatePointer = () => {
      const o = optsRef.current;
      if (takeoverActive) {
        const t = (performance.now() - takeoverStart) / (o.takeoverDuration * 1000);
        if (t >= 1) {
          takeoverActive = false;
          coords.copy(takeoverTo);
          coordsOld.copy(coords);
          diff.set(0, 0);
        } else {
          const k = t * t * (3 - 2 * t);
          coords.copy(takeoverFrom).lerp(takeoverTo, k);
        }
      }
      diff.subVectors(coords, coordsOld);
      coordsOld.copy(coords);
      if (coordsOld.x === 0 && coordsOld.y === 0) diff.set(0, 0);
      if (isAutoActive && !takeoverActive) diff.multiplyScalar(o.autoIntensity);
    };

    // ---- passes ------------------------------------------------------------
    type Uniforms = Record<string, THREE.IUniform>;

    /**
     * One full-screen shader pass. The draw call is `blit()` rather than
     * `update()` so each subclass can take its own options object without
     * breaking the override signature.
     */
    class Pass {
      scene = new THREE.Scene();
      camera = new THREE.Camera();
      uniforms: Uniforms;
      output: THREE.WebGLRenderTarget | null;

      constructor(
        material: (THREE.ShaderMaterialParameters & { uniforms: Uniforms }) | null,
        output: THREE.WebGLRenderTarget | null,
      ) {
        this.uniforms = material?.uniforms ?? {};
        this.output = output;
        if (material) {
          const mat = new THREE.RawShaderMaterial(material);
          this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        }
      }
      blit() {
        renderer.setRenderTarget(this.output);
        renderer.render(this.scene, this.camera);
        renderer.setRenderTarget(null);
      }
    }

    const cellScale = new THREE.Vector2();
    const boundarySpace = new THREE.Vector2();
    const fboSize = new THREE.Vector2();

    const calcSize = () => {
      const o = optsRef.current;
      const w = Math.max(1, Math.round(o.resolution * width));
      const h = Math.max(1, Math.round(o.resolution * height));
      cellScale.set(1 / w, 1 / h);
      fboSize.set(w, h);
    };
    calcSize();

    const rtOpts = {
      type: /(iPad|iPhone|iPod)/i.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping,
    } as const;
    const makeRT = () => new THREE.WebGLRenderTarget(fboSize.x, fboSize.y, { ...rtOpts });
    const vel0 = makeRT();
    const vel1 = makeRT();
    const velVisc0 = makeRT();
    const velVisc1 = makeRT();
    const divRT = makeRT();
    const press0 = makeRT();
    const press1 = makeRT();
    const allRT = [vel0, vel1, velVisc0, velVisc1, divRT, press0, press1];

    const advection = new Pass(
      {
        vertexShader: face_vert,
        fragmentShader: advection_frag,
        uniforms: {
          boundarySpace: { value: cellScale },
          px: { value: cellScale },
          fboSize: { value: fboSize },
          velocity: { value: vel0.texture },
          dt: { value: optsRef.current.dt },
          isBFECC: { value: true },
        },
      },
      vel1,
    );
    // Edge lines, drawn only when bounce is on.
    const boundaryGeom = new THREE.BufferGeometry();
    boundaryGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(
        new Float32Array([
          -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0,
        ]),
        3,
      ),
    );
    const boundaryLine = new THREE.LineSegments(
      boundaryGeom,
      new THREE.RawShaderMaterial({
        vertexShader: line_vert,
        fragmentShader: advection_frag,
        uniforms: advection.uniforms,
      }),
    );
    advection.scene.add(boundaryLine);

    const forcePass = new Pass(null, vel1);
    const forceMat = new THREE.RawShaderMaterial({
      vertexShader: mouse_vert,
      fragmentShader: externalForce_frag,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        px: { value: cellScale },
        force: { value: new THREE.Vector2() },
        center: { value: new THREE.Vector2() },
        scale: { value: new THREE.Vector2(optsRef.current.cursorSize, optsRef.current.cursorSize) },
      },
    });
    forcePass.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), forceMat));

    const viscousPass = new Pass(
      {
        vertexShader: face_vert,
        fragmentShader: viscous_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          velocity: { value: vel1.texture },
          velocity_new: { value: velVisc0.texture },
          v: { value: optsRef.current.viscous },
          px: { value: cellScale },
          dt: { value: optsRef.current.dt },
        },
      },
      velVisc1,
    );
    const divergencePass = new Pass(
      {
        vertexShader: face_vert,
        fragmentShader: divergence_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          velocity: { value: velVisc0.texture },
          px: { value: cellScale },
          dt: { value: optsRef.current.dt },
        },
      },
      divRT,
    );
    const poissonPass = new Pass(
      {
        vertexShader: face_vert,
        fragmentShader: poisson_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          pressure: { value: press0.texture },
          divergence: { value: divRT.texture },
          px: { value: cellScale },
        },
      },
      press1,
    );
    const pressurePass = new Pass(
      {
        vertexShader: face_vert,
        fragmentShader: pressure_frag,
        uniforms: {
          boundarySpace: { value: boundarySpace },
          pressure: { value: press0.texture },
          velocity: { value: velVisc0.texture },
          px: { value: cellScale },
          dt: { value: optsRef.current.dt },
        },
      },
      vel0,
    );

    const outScene = new THREE.Scene();
    const outCamera = new THREE.Camera();
    outScene.add(
      new THREE.Mesh(
        new THREE.PlaneGeometry(2, 2),
        new THREE.RawShaderMaterial({
          vertexShader: face_vert,
          fragmentShader: color_frag,
          transparent: true,
          depthWrite: false,
          uniforms: {
            velocity: { value: vel0.texture },
            boundarySpace: { value: new THREE.Vector2() },
            palette: { value: paletteTex },
            bgColor: { value: groundVec },
          },
        }),
      ),
    );

    const setU = (u: Uniforms, k: string, v: unknown) => {
      const slot = u[k];
      if (slot) slot.value = v;
    };

    const simulate = () => {
      const o = optsRef.current;
      if (o.isBounce) boundarySpace.set(0, 0);
      else boundarySpace.copy(cellScale);

      setU(advection.uniforms, "dt", o.dt);
      setU(advection.uniforms, "isBFECC", o.BFECC);
      boundaryLine.visible = o.isBounce;
      advection.blit();

      const fu = forceMat.uniforms;
      const cx = o.cursorSize * cellScale.x;
      const cy = o.cursorSize * cellScale.y;
      setU(
        fu,
        "force",
        new THREE.Vector2((diff.x / 2) * o.mouseForce, (diff.y / 2) * o.mouseForce),
      );
      setU(
        fu,
        "center",
        new THREE.Vector2(
          Math.min(Math.max(coords.x, -1 + cx + cellScale.x * 2), 1 - cx - cellScale.x * 2),
          Math.min(Math.max(coords.y, -1 + cy + cellScale.y * 2), 1 - cy - cellScale.y * 2),
        ),
      );
      setU(fu, "scale", new THREE.Vector2(o.cursorSize, o.cursorSize));
      forcePass.blit();

      let vel: THREE.WebGLRenderTarget = vel1;
      if (o.isViscous) {
        setU(viscousPass.uniforms, "v", o.viscous);
        setU(viscousPass.uniforms, "dt", o.dt);
        let out = velVisc1;
        for (let i = 0; i < o.iterationsViscous; i++) {
          const inRT = i % 2 === 0 ? velVisc0 : velVisc1;
          out = i % 2 === 0 ? velVisc1 : velVisc0;
          setU(viscousPass.uniforms, "velocity_new", inRT.texture);
          viscousPass.output = out;
          viscousPass.blit();
        }
        vel = out;
      }

      setU(divergencePass.uniforms, "velocity", vel.texture);
      divergencePass.blit();

      let press = press1;
      for (let i = 0; i < o.iterationsPoisson; i++) {
        const inRT = i % 2 === 0 ? press0 : press1;
        press = i % 2 === 0 ? press1 : press0;
        setU(poissonPass.uniforms, "pressure", inRT.texture);
        poissonPass.output = press;
        poissonPass.blit();
      }

      setU(pressurePass.uniforms, "velocity", vel.texture);
      setU(pressurePass.uniforms, "pressure", press.texture);
      pressurePass.blit();

      renderer.setRenderTarget(null);
      renderer.render(outScene, outCamera);
    };

    container.prepend(renderer.domElement);

    let running = false;
    const frame = () => {
      if (!running) return;
      updateAuto();
      updatePointer();
      simulate();
      rafRef.current = requestAnimationFrame(frame);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      frame();
    };
    const stop = () => {
      running = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };

    // A visitor who asked for less motion still gets the field, held still.
    if (reduceMotion) simulate();
    else start();

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (isVisibleRef.current) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;
        isVisibleRef.current = e.isIntersecting && e.intersectionRatio > 0;
        if (isVisibleRef.current && !document.hidden) start();
        else stop();
      },
      { threshold: [0, 0.01, 0.1] },
    );
    io.observe(container);

    let resizeRaf: number | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const r = container.getBoundingClientRect();
        width = Math.max(1, Math.floor(r.width));
        height = Math.max(1, Math.floor(r.height));
        renderer.setSize(width, height, false);
        calcSize();
        for (const rt of allRT) rt.setSize(fboSize.x, fboSize.y);
      });
    });
    ro.observe(container);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
      container.ownerDocument.removeEventListener("mouseleave", onLeave);
      for (const rt of allRT) rt.dispose();
      paletteTex.dispose();
      const canvas = renderer.domElement;
      canvas.parentNode?.removeChild(canvas);
      renderer.dispose();
      renderer.forceContextLoss();
    };
    // Only the palette rebuilds the context; everything else tunes through optsRef.
  }, [colorKey, groundColor]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none relative h-full w-full touch-none overflow-hidden ${className}`}
      {...(style ? { style } : {})}
    />
  );
}
