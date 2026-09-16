import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

/**
 * MoltenMetal — React Bits, ported to this stack.
 *
 * The homepage's background field, replacing LineWaves.
 *
 * FOUR CHANGES FROM UPSTREAM, all of them because of how this site uses it:
 *
 * 1. NO POINTER. The founder asked for no cursor drift, so `mouseInteraction`
 *    defaults to false — and when it is false no listener is attached at all,
 *    rather than a listener whose result is multiplied by zero.
 * 2. NO FOREGROUND DAMAGE. The container is pointer-events:none and lives
 *    inside the hero, behind a scrim. It cannot take a click, and it cannot
 *    show through a section that has no ground of its own — which is what put
 *    moving light bands behind every heading on this page once before.
 * 3. IT SLEEPS. Upstream already pauses when off-screen and when the tab is
 *    hidden; `prefers-reduced-motion` now paints one frame and stops, instead
 *    of animating forever at a lower speed.
 * 4. dpr IS CAPPED AT 1. This is a soft, out-of-focus field: at dpr 2 it costs
 *    four times the fragments to render something the eye cannot tell apart.
 *
 * Colours are the brand greyscale. `uColorMode` only moves the midpoint of the
 * ramp — it injects no hue of its own — so three greys in give a greyscale
 * field out, with nothing to un-brand.
 */
export type MoltenMetalColorMode = "molten" | "ember" | "frost";

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  // `noUncheckedIndexedAccess` is on: a matched group is `string | undefined`
  // until it is proved otherwise, so each one is defaulted rather than cast.
  if (!m) return [1, 1, 1];
  return [
    parseInt(m[1] ?? "ff", 16) / 255,
    parseInt(m[2] ?? "ff", 16) / 255,
    parseInt(m[3] ?? "ff", 16) / 255,
  ];
};

const colorModeToFloat = (mode: MoltenMetalColorMode): number =>
  mode === "ember" ? 1 : mode === "frost" ? 2 : 0;

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uScale;
uniform float uDetail;
uniform float uGlow;
uniform float uCoreSize;
uniform float uSwirl;
uniform float uFold;
uniform float uBlackPoint;
uniform float uBrightness;
uniform float uColorMode;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform bool uEnableMouse;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uBackgroundColor;
uniform bool uLightMode;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float time = iTime * uSpeed;
  vec2 p = uScale * ((gl_FragCoord.xy - 0.5 * iResolution.xy) / iResolution.y) - 0.5;

  vec2 drift = vec2(0.0);
  if (uEnableMouse) {
    drift = (uMouse - 0.5) * uMouseStrength * 2.0;
  }
  p += drift;

  vec2 i = p;
  float c = 0.0;
  float r = length(p + vec2(sin(time), sin(time * 0.3 + 5.0)) * 0.5);
  float d = length(p);
  float rot = d + time + p.x * uSwirl;

  float cosRot = cos(rot);
  mat2 warp = mat2(cos(rot - sin(time / 5.0)), sin(rot), -sin(cosRot - time), cosRot) * uFold;
  float glowCore = uGlow * uCoreSize;

  for (float n = 0.0; n < 8.0; n++) {
    if (n >= uDetail) break;
    p *= warp;
    float t = r - time / (n + 3.0);
    i -= p + vec2(cos(t - i.x - r) + sin(t + i.y), sin(t - i.y) + cos(t + i.x) + r);
    c += glowCore / length(vec2(sin(i.x + t), cos(i.y + t)));
  }

  c /= 6.0;

  float intensity = max(c - uBlackPoint, 0.0) * uBrightness;

  float g = clamp(intensity, 0.0, 1.0);

  float mid = 0.5;
  if (uColorMode > 1.5) {
    mid = 0.65;
  } else if (uColorMode > 0.5) {
    mid = 0.35;
  }

  vec3 col = mix(uColor1, uColor2, smoothstep(0.0, mid, g));
  col = mix(col, uColor3, smoothstep(mid, 1.0, g));

  float a = g;
  if (uGrain > 0.5) {
    float gr = hash(gl_FragCoord.xy + iTime);
    a += (gr - 0.5) * uGrainIntensity;
  }
  a = clamp(a, 0.0, 1.0) * uOpacity;
  if (uLightMode) {
    float signal = 1.0 - exp(-max(c, 0.0) * 6.5);
    float body = smoothstep(0.075, 0.68, signal);
    float ridge = smoothstep(0.42, 0.92, signal);

    vec3 lightCol = mix(uColor1, uColor2, smoothstep(0.08, 0.52, signal));
    lightCol = mix(lightCol, uColor3, smoothstep(0.52, 0.96, signal));
    lightCol = mix(lightCol, lightCol * 0.72, ridge * 0.24);

    float coverage = body * mix(0.2, 0.86, signal) * uOpacity;
    if (uGrain > 0.5) {
      float gr = hash(gl_FragCoord.xy + iTime);
      coverage += (gr - 0.5) * uGrainIntensity * body * 0.16;
    }
    fragColor = vec4(mix(uBackgroundColor, lightCol, clamp(coverage, 0.0, 0.92)), 1.0);
  } else {
    fragColor = vec4(col * a, a);
  }
}
`;

export default function MoltenMetal({
  color1 = "#FFFFFF",
  color2 = "#E0E0E0",
  color3 = "#B2B2B2",
  speed = 0.22,
  scale = 4,
  detail = 3,
  glow = 1.6,
  coreSize = 0.1,
  swirl = 1,
  fold = -0.2,
  blackPoint = 0.05,
  brightness = 1.3,
  colorMode = "molten",
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = false,
  mouseStrength = 0.3,
  opacity = 1,
  backgroundColor = "#141414",
  className,
}: {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  scale?: number;
  detail?: number;
  glow?: number;
  coreSize?: number;
  swirl?: number;
  fold?: number;
  blackPoint?: number;
  brightness?: number;
  colorMode?: MoltenMetalColorMode;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  opacity?: number;
  backgroundColor?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      dpr: 1,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    const canvas = gl.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    const c3 = hexToRgb(color3);
    const bg = hexToRgb(backgroundColor);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uSpeed: { value: speed },
        uScale: { value: scale },
        uDetail: { value: detail },
        uGlow: { value: glow },
        uCoreSize: { value: Math.max(coreSize, 0.001) },
        uSwirl: { value: swirl },
        uFold: { value: fold },
        uBlackPoint: { value: blackPoint },
        uBrightness: { value: brightness },
        uColorMode: { value: colorModeToFloat(colorMode) },
        uGrain: { value: grain ? 1 : 0 },
        uGrainIntensity: { value: grainIntensity },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength },
        uEnableMouse: { value: mouseInteraction },
        uColor1: { value: new Float32Array(c1) },
        uColor2: { value: new Float32Array(c2) },
        uColor3: { value: new Float32Array(c3) },
        uBackgroundColor: { value: new Float32Array(bg) },
        uLightMode: { value: false },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const setSize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
      const res = program.uniforms["iResolution"]?.value as Float32Array;
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;
      renderer.render({ scene: mesh });
    };
    const ro = new ResizeObserver(setSize);
    ro.observe(container);
    setSize();

    // Reduced motion: one frame, then nothing. The field is still there, it
    // just does not move.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        ro.disconnect();
        if (canvas.parentNode === container) container.removeChild(canvas);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    }

    const targetMouse: [number, number] = [0.5, 0.5];
    const currentMouse: [number, number] = [0.5, 0.5];
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetMouse[0] = (e.clientX - rect.left) / rect.width;
      targetMouse[1] = 1 - (e.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      targetMouse[0] = 0.5;
      targetMouse[1] = 0.5;
    };
    // No listener at all unless the pointer is actually wanted.
    if (mouseInteraction) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
    }

    let raf = 0;
    let onScreen = true;
    let tabVisible = !document.hidden;
    const t0 = performance.now();

    const loop = (t: number) => {
      const time = program.uniforms["iTime"];
      if (time) time.value = (t - t0) * 0.001;
      if (mouseInteraction) {
        currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1]);
        const m = program.uniforms["uMouse"]?.value as Float32Array;
        m[0] = currentMouse[0] ?? 0.5;
        m[1] = currentMouse[1] ?? 0.5;
      }
      renderer.render({ scene: mesh });
      raf = window.requestAnimationFrame(loop);
    };
    const start = () => {
      if (onScreen && tabVisible && raf === 0) raf = window.requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf !== 0) {
        window.cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(container);

    const onVisibility = () => {
      tabVisible = !document.hidden;
      if (tabVisible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (mouseInteraction) {
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
      }
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    scale,
    detail,
    glow,
    coreSize,
    swirl,
    fold,
    blackPoint,
    brightness,
    colorMode,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseStrength,
    opacity,
    backgroundColor,
  ]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={
        "pointer-events-none relative h-full w-full overflow-hidden " + (className ?? "")
      }
    />
  );
}
