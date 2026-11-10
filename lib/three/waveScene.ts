import * as THREE from "three";
import { damp, palette } from "./palette";
import type { SceneFactory } from "./runner";

const TAP_SLOTS = 4;
const SHOCK_LIFETIME = 3;

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uEnergy;
  uniform float uPixelRatio;
  uniform vec3 uTaps[${TAP_SLOTS}];
  varying float vHeight;
  varying float vGlow;
  varying float vDepth;
  void main() {
    vec3 p = position;
    float wave = sin(p.x * 0.55 + uTime * 0.8) * 0.4
      + sin(p.z * 0.9 + uTime * 0.6) * 0.3
      + sin((p.x + p.z) * 0.3 + uTime * 0.4) * 0.45;

    float d = distance(p.xz, uPointer);
    float lens = exp(-d * d * 0.32) * uHover;
    float ripple = sin(d * 2.6 - uTime * 4.5) * exp(-d * 0.42) * (0.18 + uEnergy * 0.9) * uHover;

    float shock = 0.0;
    for (int i = 0; i < ${TAP_SLOTS}; i++) {
      float age = uTime - uTaps[i].z;
      if (age > 0.0 && age < ${SHOCK_LIFETIME.toFixed(1)}) {
        float radius = age * 6.0;
        float ring = distance(p.xz, uTaps[i].xy) - radius;
        shock += exp(-ring * ring * 1.6) * (1.0 - age / ${SHOCK_LIFETIME.toFixed(1)}) * 1.1;
      }
    }

    p.y += wave + lens * 1.5 + ripple * 0.5 + shock;
    vHeight = wave + ripple * 0.5;
    vGlow = clamp(lens + shock * 0.9, 0.0, 1.4);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = smoothstep(26.0, 6.0, -mv.z);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixelRatio * (2.0 + max(vHeight, 0.0) * 1.1 + vGlow * 3.2) * (12.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uDim;
  uniform vec3 uGrey;
  uniform vec3 uSignal;
  uniform vec3 uPaper;
  varying float vHeight;
  varying float vGlow;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
    float lift = smoothstep(0.25, 1.1, vHeight);
    vec3 color = mix(uDim, uGrey, vDepth * 0.6);
    color = mix(color, uSignal, max(lift, smoothstep(0.05, 0.6, vGlow)));
    color = mix(color, uPaper, smoothstep(0.85, 1.3, vGlow));
    float alpha = (0.22 + vDepth * 0.35 + lift * 0.5 + vGlow * 0.6) * smoothstep(0.25, 0.12, r);
    gl_FragColor = vec4(color, min(alpha, 1.0));
  }
`;

export const createWaveScene: SceneFactory = ({ scene, camera, hover, compact }) => {
  camera.position.set(0, 4.6, 11);
  camera.lookAt(0, 0, 0);

  const columns = compact ? 80 : 150;
  const rows = compact ? 40 : 70;
  const positions = new Float32Array(columns * rows * 3);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = (row * columns + column) * 3;
      positions[index] = (column / (columns - 1) - 0.5) * 28;
      positions[index + 1] = 0;
      positions[index + 2] = (row / (rows - 1) - 0.5) * 15;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const taps = Array.from({ length: TAP_SLOTS }, () => new THREE.Vector3(0, 0, -100));
  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
    uHover: { value: 0 },
    uEnergy: { value: 0 },
    uTaps: { value: taps },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.6) },
    uDim: { value: palette.dim },
    uGrey: { value: palette.grey },
    uSignal: { value: palette.signal },
    uPaper: { value: palette.paper },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const field = new THREE.Points(geometry, material);
  scene.add(field);

  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const hit = new THREE.Vector3();
  const target = new THREE.Vector2();
  const lastTarget = new THREE.Vector2();
  let seenTaps = hover.tapCount;
  let nextSlot = 0;

  const project = (ndc: THREE.Vector2, out: THREE.Vector2) => {
    raycaster.setFromCamera(ndc, camera);
    if (!raycaster.ray.intersectPlane(ground, hit)) return false;
    field.worldToLocal(hit);
    out.set(hit.x, hit.z);
    return true;
  };

  return {
    update(time, delta) {
      uniforms.uTime.value = time;
      const step = delta || 0.016;

      let active = hover.inside && project(hover.local, target);
      if (!active) {
        target.set(Math.sin(time * 0.35) * 8, Math.sin(time * 0.6) * 3);
        active = false;
      }

      const pointer = uniforms.uPointer.value;
      pointer.x = damp(pointer.x, target.x, active ? 9 : 2, step);
      pointer.y = damp(pointer.y, target.y, active ? 9 : 2, step);
      uniforms.uHover.value = damp(uniforms.uHover.value, active ? 1 : 0.55, 4, step);

      const speed = target.distanceTo(lastTarget) / step;
      lastTarget.copy(target);
      uniforms.uEnergy.value = damp(uniforms.uEnergy.value, Math.min(speed / 25, 1.2), active ? 6 : 2, step);

      if (hover.tapCount !== seenTaps) {
        seenTaps = hover.tapCount;
        const point = new THREE.Vector2();
        if (project(hover.tap, point)) {
          taps[nextSlot].set(point.x, point.y, time);
          nextSlot = (nextSlot + 1) % TAP_SLOTS;
        }
      }

      field.rotation.y = Math.sin(time * 0.08) * 0.08;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
