import { Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const MAX_POINTS = 64;

const VERTEX_SHADER = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
#define MAX_POINTS 64

uniform vec2 uResolution;
uniform vec2 uPoints[MAX_POINTS];
uniform float uPointCount;
uniform vec3 uColor;
uniform vec3 uSecondaryColor;
uniform float uTrailWidth;
uniform float uTaper;
uniform float uGlowIntensity;
uniform float uGlowSpread;
uniform float uHotspot;
uniform float uBrightness;
uniform float uOpacity;
uniform float uPulseSpeed;
uniform float uNoiseStrength;
uniform float uTime;
uniform float uFade;

varying vec2 vUv;

float sRGB(float x) {
  if (x <= 0.00031308) return 12.92 * x;
  return 1.055 * pow(x, 1.0 / 2.4) - 0.055;
}
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float filmGrain(vec2 p, float time) {
  float frame = time * 18.0;
  float frameIndex = mod(floor(frame), 256.0);
  float nextFrameIndex = mod(frameIndex + 1.0, 256.0);
  float blend = fract(frame);
  blend = blend * blend * (3.0 - 2.0 * blend);
  vec2 pixel = floor(p);
  float current = hash(pixel + vec2(frameIndex * 17.0, frameIndex * 31.0));
  float next = hash(pixel + vec2(nextFrameIndex * 17.0, nextFrameIndex * 31.0));
  return mix(current, next, blend) * 2.0 - 1.0;
}

void main() {
  vec2 pixel = vUv * uResolution;
  float denominator = max(uPointCount - 1.0, 1.0);
  float strongest = 0.0;
  float strongestCore = 0.0;
  float colorWeight = 0.0;
  vec3 colorSum = vec3(0.0);

  for (int i = 0; i < MAX_POINTS - 1; i++) {
    float index = float(i);
    float active = 1.0 - step(uPointCount - 1.0, index);
    vec2 start = uPoints[i];
    vec2 end = uPoints[i + 1];
    vec2 toPixel = pixel - start;
    vec2 segment = end - start;
    float along = clamp(dot(toPixel, segment) / max(dot(segment, segment), 0.0001), 0.0, 1.0);
    float progress = clamp((index + along) / denominator, 0.0, 1.0);
    float life = pow(max(1.0 - progress, 0.0), mix(0.55, 1.25, uTaper));
    float width = uTrailWidth * mix(1.0, 0.25, pow(progress, mix(0.55, 1.6, uTaper)));
    float distanceToTrail = length(toPixel - segment * along);
    float falloff = max(width * (0.8 + uGlowSpread * 1.4), 0.5);
    float beam = min(1.0, (falloff * falloff) / (distanceToTrail * distanceToTrail + falloff * falloff));
    float core = exp(-pow(distanceToTrail / max(width, 0.5), 2.0) * 2.5);
    float pulseAmount = min(abs(uPulseSpeed), 1.0);
    float pulse = 1.0 + sin(uTime * uPulseSpeed * 3.0 - progress * 11.0) * 0.16 * pulseAmount;
    float intensity = (core + beam * uGlowIntensity * 0.55) * life * pulse * active;
    vec3 segmentColor = mix(uColor, uSecondaryColor, progress);
    strongest = max(strongest, intensity);
    strongestCore = max(strongestCore, core * life * active);
    colorSum += segmentColor * intensity;
    colorWeight += intensity;
  }

  float grain = filmGrain(pixel, uTime);
  float noiseAmount = (1.0 - exp(-uNoiseStrength * 2.2)) * 0.4;
  float alpha = clamp(strongest * uOpacity * uFade, 0.0, 1.0);
  if (alpha < 0.0005) discard;

  vec3 color = colorSum / max(colorWeight, 0.0001);
  color = mix(color, vec3(1.0), smoothstep(0.25, 0.95, strongestCore) * uHotspot);
  float luminance = sRGB(clamp(strongest * uBrightness, 0.0, 1.0));
  luminance *= 1.0 + grain * noiseAmount;
  gl_FragColor = vec4(color * luminance, alpha);
}
`;

const hexToRgb = (hex: string): [number, number, number] => {
  let value = (hex || "").replace("#", "").trim();
  if (value.length === 3)
    value = value
      .split("")
      .map((c) => c + c)
      .join("");
  const parsed = Number.parseInt(value || "000000", 16);
  return [((parsed >> 16) & 255) / 255, ((parsed >> 8) & 255) / 255, (parsed & 255) / 255];
};
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/**
 * GlowCursor — React Bits / ogl, ported to this stack.
 *
 * A trail of light that chases the pointer across the whole page.
 *
 * CLAUDE.md records that a custom cursor was removed at the founder's request.
 * That note stands for the old cursor; this one is here because the founder
 * asked for it directly, by name, with its source. It does not replace the
 * system cursor — the real one stays visible and every hit target is
 * unchanged, because the canvas is pointer-events:none.
 *
 * Colours are the brand greyscale, white fading to #B2B2B2. It never starts
 * on a coarse pointer or under `prefers-reduced-motion`.
 */
export default function GlowCursor({
  color = "#FFFFFF",
  secondaryColor = "#B2B2B2",
  trailLength = 38,
  trailWidth = 7,
  trailTaper = 0.8,
  followSpeed = 0.18,
  glowIntensity = 1.5,
  glowSpread = 1.1,
  hotspot = 0.6,
  brightness = 1.05,
  opacity = 0.85,
  pulseSpeed = 1,
  noiseStrength = 0.035,
  idleTimeout = 700,
  fadeDuration = 900,
  maxDevicePixelRatio = 1.5,
  className,
}: {
  color?: string;
  secondaryColor?: string;
  trailLength?: number;
  trailWidth?: number;
  trailTaper?: number;
  followSpeed?: number;
  glowIntensity?: number;
  glowSpread?: number;
  hotspot?: number;
  brightness?: number;
  opacity?: number;
  pulseSpeed?: number;
  noiseStrength?: number;
  idleTimeout?: number;
  fadeDuration?: number;
  maxDevicePixelRatio?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr: Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const pointData = new Array<number>(MAX_POINTS * 2).fill(0);
    const points = Array.from({ length: MAX_POINTS }, () => ({ x: 0, y: 0 }));
    const target = { x: 0, y: 0 };
    const head = { x: 0, y: 0 };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms: {
        uResolution: { value: [1, 1] },
        uPoints: { value: pointData },
        uPointCount: { value: trailLength },
        uColor: { value: hexToRgb(color) },
        uSecondaryColor: { value: hexToRgb(secondaryColor) },
        uTrailWidth: { value: trailWidth },
        uTaper: { value: trailTaper },
        uGlowIntensity: { value: glowIntensity },
        uGlowSpread: { value: glowSpread },
        uHotspot: { value: hotspot },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uPulseSpeed: { value: pulseSpeed },
        uNoiseStrength: { value: noiseStrength },
        uTime: { value: 0 },
        uFade: { value: 0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    let width = 1;
    let height = 1;
    let initialized = false;
    let fade = 0;
    let lastInput = performance.now();
    let lastFrame = performance.now();
    let raf = 0;
    let destroyed = false;

    const resize = () => {
      width = Math.max(window.innerWidth, 1);
      height = Math.max(window.innerHeight, 1);
      renderer.setSize(width, height);
      program.uniforms["uResolution"].value = [width, height];
    };

    // The trail follows the pointer over the WHOLE page, so the listener is on
    // the window and coordinates are viewport-relative — the canvas is fixed.
    const onMove = (event: PointerEvent) => {
      const x = clamp(event.clientX, 0, width);
      const y = clamp(height - event.clientY, 0, height);
      if (!initialized) {
        target.x = x;
        target.y = y;
        head.x = x;
        head.y = y;
        for (const point of points) {
          point.x = x;
          point.y = y;
        }
        initialized = true;
        fade = 1;
      }
      target.x = x;
      target.y = y;
      lastInput = performance.now();
    };

    const render = (now: number) => {
      if (destroyed) return;
      const delta = Math.min((now - lastFrame) / 16.667, 3);
      lastFrame = now;

      if (initialized) {
        const headEase = 1 - Math.pow(1 - clamp(followSpeed, 0.01, 0.99), delta);
        const chainEase = 1 - Math.pow(1 - clamp(0.28 + followSpeed * 0.35, 0.08, 0.92), delta);
        head.x += (target.x - head.x) * headEase;
        head.y += (target.y - head.y) * headEase;
        const first = points[0];
        if (first) {
          first.x = head.x;
          first.y = head.y;
        }
        for (let i = 1; i < MAX_POINTS; i++) {
          const prev = points[i - 1];
          const cur = points[i];
          if (!prev || !cur) continue;
          cur.x += (prev.x - cur.x) * chainEase;
          cur.y += (prev.y - cur.y) * chainEase;
        }
        for (let i = 0; i < MAX_POINTS; i++) {
          const point = points[i];
          if (!point) continue;
          pointData[i * 2] = point.x;
          pointData[i * 2 + 1] = point.y;
        }
      }

      const idleFor = now - lastInput;
      const fadeStep = (16.667 * delta) / Math.max(fadeDuration, 16);
      const fadeTarget = initialized && idleFor <= idleTimeout ? 1 : 0;
      fade += (fadeTarget - fade) * Math.min(1, fadeStep * 7);

      program.uniforms["uTime"].value = now * 0.001;
      program.uniforms["uFade"].value = fade;
      renderer.render({ scene: mesh });
      raf = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = window.requestAnimationFrame(render);

    return () => {
      destroyed = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    color,
    secondaryColor,
    trailLength,
    trailWidth,
    trailTaper,
    followSpeed,
    glowIntensity,
    glowSpread,
    hotspot,
    brightness,
    opacity,
    pulseSpeed,
    noiseStrength,
    idleTimeout,
    fadeDuration,
    maxDevicePixelRatio,
  ]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={
        "pointer-events-none fixed inset-0 z-[60] block h-full w-full select-none mix-blend-screen " +
        (className ?? "")
      }
    />
  );
}
