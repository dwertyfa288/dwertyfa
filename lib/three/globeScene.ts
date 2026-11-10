import * as THREE from "three";
import { damp, palette, seededRandom } from "./palette";
import type { SceneFactory } from "./runner";

const RADIUS = 2;

const dotVertex = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vFacing;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = normalize(normalMatrix * position).z;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (8.0 / -mv.z);
  }
`;

const dotFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vFacing;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    float alpha = mix(0.08, 0.75, smoothstep(-0.3, 0.7, vFacing));
    gl_FragColor = vec4(uColor, alpha);
  }
`;

const nodeVertex = /* glsl */ `
  uniform float uPixelRatio;
  uniform float uTime;
  attribute float aPhase;
  varying float vFacing;
  varying float vPulse;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vFacing = normalize(normalMatrix * position).z;
    vPulse = 0.5 + 0.5 * sin(uTime * 2.2 + aPhase * 6.2831);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (10.0 + vPulse * 8.0) * uPixelRatio * (8.0 / -mv.z);
  }
`;

const nodeFragment = /* glsl */ `
  uniform vec3 uSignal;
  varying float vFacing;
  varying float vPulse;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float core = smoothstep(0.22, 0.12, d);
    float ring = smoothstep(0.5, 0.42, d) * smoothstep(0.32, 0.4, d) * (1.0 - vPulse);
    float visible = smoothstep(-0.25, 0.2, vFacing);
    gl_FragColor = vec4(uSignal, (core + ring * 0.8) * visible);
  }
`;

const arcVertex = /* glsl */ `
  attribute float aProgress;
  attribute float aOffset;
  varying float vProgress;
  varying float vOffset;
  varying float vFacing;
  void main() {
    vProgress = aProgress;
    vOffset = aOffset;
    vFacing = normalize(normalMatrix * position).z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDim;
  uniform vec3 uSignal;
  varying float vProgress;
  varying float vOffset;
  varying float vFacing;
  void main() {
    float head = fract(uTime * 0.28 + vOffset);
    float trail = smoothstep(head - 0.22, head, vProgress) * step(vProgress, head);
    float visible = mix(0.15, 1.0, smoothstep(-0.3, 0.3, vFacing));
    vec3 color = mix(uDim, uSignal, trail);
    gl_FragColor = vec4(color, (0.5 + trail * 0.5) * visible);
  }
`;

function fibonacciSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * ring * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ring * radius;
  }
  return positions;
}

function arcPoints(from: THREE.Vector3, to: THREE.Vector3, segments: number) {
  const points: THREE.Vector3[] = [];
  const lift = 1 + from.distanceTo(to) * 0.12;
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const point = from.clone().lerp(to, t).normalize();
    const height = RADIUS * (1 + (lift - 1) * Math.sin(Math.PI * t));
    points.push(point.multiplyScalar(height));
  }
  return points;
}

export const createGlobeScene: SceneFactory = ({ scene, camera, pointer, hover, compact }) => {
  camera.position.set(0, 0, 10.5);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);
  const random = seededRandom(288);

  const dotGeometry = new THREE.BufferGeometry();
  dotGeometry.setAttribute("position", new THREE.BufferAttribute(fibonacciSphere(compact ? 1200 : 2200, RADIUS), 3));
  const dotMaterial = new THREE.ShaderMaterial({
    uniforms: { uPixelRatio: { value: pixelRatio }, uSize: { value: 3.0 }, uColor: { value: palette.grey } },
    vertexShader: dotVertex,
    fragmentShader: dotFragment,
    transparent: true,
    depthWrite: false,
  });
  const dots = new THREE.Points(dotGeometry, dotMaterial);

  const nodeCount = 14;
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const latitude = (random() - 0.5) * Math.PI * 0.8;
    const longitude = random() * Math.PI * 2;
    nodes.push(
      new THREE.Vector3(
        Math.cos(latitude) * Math.cos(longitude),
        Math.sin(latitude),
        Math.cos(latitude) * Math.sin(longitude),
      ).multiplyScalar(RADIUS * 1.005),
    );
  }
  const nodePositions = new Float32Array(nodes.flatMap((node) => [node.x, node.y, node.z]));
  const nodePhases = new Float32Array(nodes.map(() => random()));
  const nodeGeometry = new THREE.BufferGeometry();
  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
  nodeGeometry.setAttribute("aPhase", new THREE.BufferAttribute(nodePhases, 1));
  const nodeUniforms = { uPixelRatio: { value: pixelRatio }, uTime: { value: 0 }, uSignal: { value: palette.signal } };
  const nodeMaterial = new THREE.ShaderMaterial({
    uniforms: nodeUniforms,
    vertexShader: nodeVertex,
    fragmentShader: nodeFragment,
    transparent: true,
    depthWrite: false,
  });
  const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);

  const segments = 48;
  const arcPositions: number[] = [];
  const arcProgress: number[] = [];
  const arcOffsets: number[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const targets = [(i + 1) % nodeCount, (i + 5) % nodeCount];
    targets.forEach((target, index) => {
      if (index === 1 && i % 2) return;
      const points = arcPoints(nodes[i], nodes[target], segments);
      const offset = random();
      for (let s = 0; s < segments; s++) {
        arcPositions.push(points[s].x, points[s].y, points[s].z, points[s + 1].x, points[s + 1].y, points[s + 1].z);
        arcProgress.push(s / segments, (s + 1) / segments);
        arcOffsets.push(offset, offset);
      }
    });
  }
  const arcGeometry = new THREE.BufferGeometry();
  arcGeometry.setAttribute("position", new THREE.Float32BufferAttribute(arcPositions, 3));
  arcGeometry.setAttribute("aProgress", new THREE.Float32BufferAttribute(arcProgress, 1));
  arcGeometry.setAttribute("aOffset", new THREE.Float32BufferAttribute(arcOffsets, 1));
  const arcUniforms = { uTime: { value: 0 }, uDim: { value: palette.grey }, uSignal: { value: palette.signal } };
  const arcMaterial = new THREE.ShaderMaterial({
    uniforms: arcUniforms,
    vertexShader: arcVertex,
    fragmentShader: arcFragment,
    transparent: true,
    depthWrite: false,
  });
  const arcs = new THREE.LineSegments(arcGeometry, arcMaterial);

  const ringGeometry = new THREE.BufferGeometry().setFromPoints(
    new THREE.EllipseCurve(0, 0, RADIUS * 1.42, RADIUS * 1.42).getPoints(160),
  );
  const ringMaterial = new THREE.LineDashedMaterial({
    color: palette.dim,
    dashSize: 0.06,
    gapSize: 0.08,
    transparent: true,
    opacity: 0.8,
  });
  const ring = new THREE.LineLoop(ringGeometry, ringMaterial);
  ring.computeLineDistances();
  ring.rotation.x = Math.PI / 2.25;
  ring.rotation.y = 0.25;

  const satelliteGeometry = new THREE.BufferGeometry();
  satelliteGeometry.setAttribute("position", new THREE.Float32BufferAttribute([RADIUS * 1.42, 0, 0], 3));
  const satelliteMaterial = new THREE.PointsMaterial({ color: palette.paper, size: 0.09 });
  const satellite = new THREE.Points(satelliteGeometry, satelliteMaterial);
  const satellitePivot = new THREE.Group();
  satellitePivot.add(satellite);
  satellitePivot.rotation.copy(ring.rotation);

  const globe = new THREE.Group();
  globe.add(dots, arcs, nodePoints);
  const root = new THREE.Group();
  root.add(globe, ring, satellitePivot);
  root.rotation.z = -0.18;
  scene.add(root);

  let spin = 0.12;
  let seenTaps = hover.tapCount;
  let burst = 0;

  return {
    resize(width, height) {
      root.scale.setScalar(Math.min(1, (width / height) * 0.95));
    },
    update(time, delta) {
      const step = delta || 0.016;
      if (hover.tapCount !== seenTaps) {
        seenTaps = hover.tapCount;
        burst = 1;
      }
      burst = damp(burst, 0, 1.6, step);
      spin = damp(spin, hover.inside ? hover.local.x * 1.4 : 0.12, 2.5, step);
      globe.rotation.y += spin * step;
      nodeUniforms.uTime.value += step * (1 + burst * 3);
      arcUniforms.uTime.value += step * (1 + burst * 5);
      satellitePivot.rotation.z = time * 0.4;
      root.rotation.x = damp(root.rotation.x, 0.25 - pointer.y * 0.25, 2.5, delta);
      root.rotation.y = damp(root.rotation.y, pointer.x * 0.4, 2.5, delta);
    },
    dispose() {
      [dotGeometry, nodeGeometry, arcGeometry, ringGeometry, satelliteGeometry].forEach((geometry) => geometry.dispose());
      [dotMaterial, nodeMaterial, arcMaterial, ringMaterial, satelliteMaterial].forEach((material) => material.dispose());
    },
  };
};
