import * as THREE from "three";
import { facetFragment, facetVertex } from "./facetShader";
import { damp, palette } from "./palette";
import type { SceneFactory } from "./runner";

const TRAIL_LENGTH = 120;
const FLIGHT_SPEED = 0.5;
const ROLL_DURATION = 1.1;

function paperPlaneGeometry() {
  const nose = [0, 0, 1.4];
  const leftTip = [-1.15, 0.14, -1];
  const rightTip = [1.15, 0.14, -1];
  const leftCrease = [-0.2, 0.03, -1];
  const rightCrease = [0.2, 0.03, -1];
  const spine = [0, 0, -1];
  const keel = [0, -0.42, -1];
  const faces = [
    nose, leftCrease, leftTip,
    nose, spine, leftCrease,
    nose, rightCrease, spine,
    nose, rightTip, rightCrease,
    nose, keel, spine,
    nose, spine, keel,
  ];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(faces.flat(), 3));
  return geometry;
}

function flightPoint(t: number, target: THREE.Vector3) {
  return target.set(
    Math.sin(t) * 2.3,
    Math.sin(t * 2) * 0.35 + Math.cos(t * 0.5) * 0.3,
    Math.sin(t * 2) * 1.9,
  );
}

function easeInOut(value: number) {
  return value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

const trailVertex = /* glsl */ `
  attribute float aAlpha;
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vAlpha;
  void main() {
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * aAlpha * (8.0 / -mv.z);
  }
`;

const trailLineFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(uColor, vAlpha * vAlpha);
  }
`;

const trailPointFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, vAlpha);
  }
`;

export const createPlaneScene: SceneFactory = ({ scene, camera, pointer, hover }) => {
  camera.position.set(0, 3.4, 7.2);
  camera.lookAt(0, 0, 0);
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

  const planeGeometry = paperPlaneGeometry();
  const planeUniforms = {
    uBase: { value: palette.panel },
    uLight: { value: palette.paper },
    uGlow: { value: 0 },
    uGlowColor: { value: palette.signal },
  };
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: planeUniforms,
    vertexShader: facetVertex,
    fragmentShader: facetFragment,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  const edgeGeometry = new THREE.EdgesGeometry(planeGeometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: palette.paper });
  plane.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
  plane.scale.setScalar(0.72);

  const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
  const trailAlpha = new Float32Array(TRAIL_LENGTH);
  for (let i = 0; i < TRAIL_LENGTH; i++) trailAlpha[i] = 1 - i / TRAIL_LENGTH;
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1));

  const trailUniforms = { uColor: { value: palette.signal }, uPixelRatio: { value: pixelRatio }, uSize: { value: 7 } };
  const trailLineMaterial = new THREE.ShaderMaterial({
    uniforms: trailUniforms,
    vertexShader: trailVertex,
    fragmentShader: trailLineFragment,
    transparent: true,
    depthWrite: false,
  });
  const trailPointMaterial = new THREE.ShaderMaterial({
    uniforms: trailUniforms,
    vertexShader: trailVertex,
    fragmentShader: trailPointFragment,
    transparent: true,
    depthWrite: false,
  });
  const trailLine = new THREE.Line(trailGeometry, trailLineMaterial);
  const trailPoints = new THREE.Points(trailGeometry, trailPointMaterial);

  const pathGeometry = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 240 }, (_, i) => flightPoint((i / 239) * Math.PI * 4, new THREE.Vector3())),
  );
  const pathMaterial = new THREE.LineDashedMaterial({ color: palette.dim, dashSize: 0.04, gapSize: 0.1 });
  const path = new THREE.Line(pathGeometry, pathMaterial);
  path.computeLineDistances();

  const flight = new THREE.Group();
  flight.add(path, trailLine, trailPoints, plane);
  const root = new THREE.Group();
  root.add(flight);
  scene.add(root);

  const position = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  const previousTangent = new THREE.Vector3(1, 0, 0);
  let bank = 0;
  let primed = false;
  let seenTaps = hover.tapCount;
  let rollStart = -10;

  return {
    resize(width, height) {
      root.scale.setScalar(Math.min(1.1, (width / height) * 0.82));
    },
    update(time, delta) {
      const step = delta || 0.016;
      const t = time * FLIGHT_SPEED;
      flightPoint(t, position);
      flightPoint(t + 0.04, ahead);
      tangent.subVectors(ahead, position).normalize();

      const yawRate = (previousTangent.z * tangent.x - previousTangent.x * tangent.z) / step;
      previousTangent.copy(tangent);
      bank = damp(bank, THREE.MathUtils.clamp(-yawRate * 0.45, -0.85, 0.85), 3.5, step);

      if (hover.tapCount !== seenTaps) {
        seenTaps = hover.tapCount;
        if (time - rollStart > ROLL_DURATION) rollStart = time;
      }
      const rollProgress = THREE.MathUtils.clamp((time - rollStart) / ROLL_DURATION, 0, 1);
      const roll = rollProgress < 1 ? easeInOut(rollProgress) * Math.PI * 2 : 0;

      plane.position.copy(position);
      plane.lookAt(ahead.x, ahead.y, ahead.z);
      plane.rotateZ(bank + roll);
      plane.position.y += Math.sin(time * 3.1) * 0.02;
      planeUniforms.uGlow.value = Math.sin(rollProgress * Math.PI);

      if (!primed) {
        for (let i = 0; i < TRAIL_LENGTH; i++) {
          flightPoint(t - i * 0.012, ahead);
          ahead.toArray(trailPositions, i * 3);
        }
        primed = true;
      } else {
        trailPositions.copyWithin(3, 0, (TRAIL_LENGTH - 1) * 3);
        position.toArray(trailPositions, 0);
      }
      trailGeometry.attributes.position.needsUpdate = true;

      const steerX = hover.inside ? hover.local.x * 0.9 : 0;
      const steerY = hover.inside ? hover.local.y * 0.6 : 0;
      flight.position.x = damp(flight.position.x, steerX, 2, step);
      flight.position.y = damp(flight.position.y, steerY, 2, step);
      root.rotation.y = damp(root.rotation.y, pointer.x * 0.3, 2, step);
      root.rotation.x = damp(root.rotation.x, -pointer.y * 0.12, 2, step);
    },
    dispose() {
      [planeGeometry, edgeGeometry, trailGeometry, pathGeometry].forEach((geometry) => geometry.dispose());
      [planeMaterial, edgeMaterial, trailLineMaterial, trailPointMaterial, pathMaterial].forEach((material) =>
        material.dispose(),
      );
    },
  };
};
