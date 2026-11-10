import * as THREE from "three";
import { facetFragment, facetVertex } from "./facetShader";
import { damp, palette } from "./palette";
import type { SceneFactory } from "./runner";

const TRAIL_LENGTH = 90;

function paperPlaneGeometry() {
  const nose = [0, 0, 1.3];
  const spine = [0, 0.04, -0.9];
  const leftTip = [-1.05, 0.16, -0.95];
  const rightTip = [1.05, 0.16, -0.95];
  const keel = [0, -0.38, -0.9];
  const faces = [nose, leftTip, spine, nose, spine, rightTip, nose, spine, keel, nose, keel, spine];
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(faces.flat(), 3));
  return geometry;
}

function flightPoint(t: number, target: THREE.Vector3) {
  return target.set(Math.sin(t) * 2.2, Math.sin(t * 2) * 0.5 + Math.sin(t * 0.5) * 0.25, Math.sin(t * 2) * 1.2);
}

export const createPlaneScene: SceneFactory = ({ scene, camera, pointer }) => {
  camera.position.set(0, 1.6, 8);
  camera.lookAt(0, 0, 0);

  const planeGeometry = paperPlaneGeometry();
  const planeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: palette.panel },
      uLight: { value: palette.paper },
      uGlow: { value: 0 },
      uGlowColor: { value: palette.signal },
    },
    vertexShader: facetVertex,
    fragmentShader: facetFragment,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  const edgeGeometry = new THREE.EdgesGeometry(planeGeometry);
  const edgeMaterial = new THREE.LineBasicMaterial({ color: palette.paper });
  plane.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));
  plane.scale.setScalar(0.85);

  const trailPositions = new Float32Array(TRAIL_LENGTH * 3);
  const trailAlpha = new Float32Array(TRAIL_LENGTH);
  for (let i = 0; i < TRAIL_LENGTH; i++) trailAlpha[i] = 1 - i / TRAIL_LENGTH;
  const trailGeometry = new THREE.BufferGeometry();
  trailGeometry.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
  trailGeometry.setAttribute("aAlpha", new THREE.BufferAttribute(trailAlpha, 1));
  const trailMaterial = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: palette.signal } },
    vertexShader: /* glsl */ `
      attribute float aAlpha;
      varying float vAlpha;
      void main() {
        vAlpha = aAlpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vAlpha;
      void main() {
        if (mod(gl_FragCoord.x + gl_FragCoord.y, 6.0) < 2.0) discard;
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
  });
  const trail = new THREE.Line(trailGeometry, trailMaterial);

  const pathGeometry = new THREE.BufferGeometry().setFromPoints(
    Array.from({ length: 200 }, (_, i) => flightPoint((i / 199) * Math.PI * 4, new THREE.Vector3())),
  );
  const pathMaterial = new THREE.LineDashedMaterial({ color: palette.dim, dashSize: 0.04, gapSize: 0.1 });
  const path = new THREE.Line(pathGeometry, pathMaterial);
  path.computeLineDistances();

  const root = new THREE.Group();
  root.add(path, trail, plane);
  scene.add(root);

  const position = new THREE.Vector3();
  const ahead = new THREE.Vector3();
  let primed = false;

  return {
    resize(width, height) {
      root.scale.setScalar(Math.min(1, (width / height) * 0.62));
    },
    update(time, delta) {
      const t = time * 0.55;
      flightPoint(t, position);
      flightPoint(t + 0.05, ahead);
      plane.position.copy(position);
      plane.lookAt(ahead);
      const turn = Math.cos(t) * Math.sign(Math.cos(t * 2) || 1);
      plane.rotateZ(-turn * 0.5);

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

      root.rotation.y = damp(root.rotation.y, pointer.x * 0.35, 2, delta);
      root.rotation.x = damp(root.rotation.x, -pointer.y * 0.15, 2, delta);
    },
    dispose() {
      [planeGeometry, edgeGeometry, trailGeometry, pathGeometry].forEach((geometry) => geometry.dispose());
      [planeMaterial, edgeMaterial, trailMaterial, pathMaterial].forEach((material) => material.dispose());
    },
  };
};
