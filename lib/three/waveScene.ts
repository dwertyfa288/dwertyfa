import * as THREE from "three";
import { damp, palette } from "./palette";
import type { SceneFactory } from "./runner";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  varying float vHeight;
  void main() {
    vec3 p = position;
    float d = distance(p.xz, uPointer * vec2(9.0, 4.0));
    float ripple = sin(d * 2.2 - uTime * 3.0) * exp(-d * 0.45) * 0.55;
    float wave = sin(p.x * 0.55 + uTime * 0.8) * 0.45 + sin(p.z * 0.9 + uTime * 0.6) * 0.35 + sin((p.x + p.z) * 0.3 + uTime * 0.4) * 0.5;
    p.y += wave + ripple;
    vHeight = wave + ripple;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uPixelRatio * (2.2 + vHeight * 1.2) * (12.0 / -mv.z);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uPaper;
  uniform vec3 uSignal;
  varying float vHeight;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float lift = smoothstep(0.2, 1.1, vHeight);
    vec3 color = mix(uPaper * 0.55, uSignal, lift);
    gl_FragColor = vec4(color, 0.3 + lift * 0.7);
  }
`;

export const createWaveScene: SceneFactory = ({ scene, camera, pointer, compact }) => {
  camera.position.set(0, 4.2, 11);
  camera.lookAt(0, 0, 0);

  const columns = compact ? 70 : 140;
  const rows = compact ? 36 : 64;
  const positions = new Float32Array(columns * rows * 3);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      const index = (row * columns + column) * 3;
      positions[index] = (column / (columns - 1) - 0.5) * 26;
      positions[index + 1] = 0;
      positions[index + 2] = (row / (rows - 1) - 0.5) * 14;
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const uniforms = {
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(10, 10) },
    uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.6) },
    uPaper: { value: palette.paper },
    uSignal: { value: palette.signal },
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

  return {
    update(time, delta) {
      uniforms.uTime.value = time;
      const target = uniforms.uPointer.value;
      target.x = damp(target.x, pointer.x, 2.5, delta);
      target.y = damp(target.y, -pointer.y, 2.5, delta);
      field.rotation.y = Math.sin(time * 0.08) * 0.12;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
