import * as THREE from "three";
import { facetFragment, facetVertex } from "./facetShader";
import { damp, palette } from "./palette";
import type { SceneFactory } from "./runner";

import { STACK_FOCUS_EVENT, STACK_HOVER_EVENT } from "./events";

const WIDTH = 3.2;
const DEPTH = 2.2;
const THICKNESS = 0.14;
const GAP = 0.78;
const LAYER_COUNT = 4;
const CYCLE_SECONDS = 2.8;

function webGlyph() {
  const w = 1.1;
  const d = 0.75;
  const points = [
    [-w, -d, w, -d], [w, -d, w, d], [w, d, -w, d], [-w, d, -w, -d],
    [-w, -d + 0.28, w, -d + 0.28],
    [-w + 0.2, 0, w - 0.9, 0], [-w + 0.2, 0.22, w - 1.3, 0.22],
    [w - 0.7, -0.1, w - 0.2, -0.1], [w - 0.2, -0.1, w - 0.2, 0.5], [w - 0.2, 0.5, w - 0.7, 0.5], [w - 0.7, 0.5, w - 0.7, -0.1],
  ];
  return points.flatMap(([x1, z1, x2, z2]) => [x1, 0, z1, x2, 0, z2]);
}

function serverGlyph() {
  const lines: number[] = [];
  for (let row = 0; row < 3; row++) {
    const z = -0.6 + row * 0.6;
    lines.push(-1.1, 0, z - 0.18, 1.1, 0, z - 0.18, 1.1, 0, z - 0.18, 1.1, 0, z + 0.18);
    lines.push(1.1, 0, z + 0.18, -1.1, 0, z + 0.18, -1.1, 0, z + 0.18, -1.1, 0, z - 0.18);
    for (let led = 0; led < 3; led++) {
      const x = 0.55 + led * 0.18;
      lines.push(x, 0, z - 0.05, x + 0.08, 0, z + 0.05);
    }
  }
  return lines;
}

function voiceGlyph() {
  const lines: number[] = [];
  const bars = 22;
  for (let i = 0; i < bars; i++) {
    const x = -1.1 + (i / (bars - 1)) * 2.2;
    const height = 0.12 + Math.abs(Math.sin(i * 0.9) * Math.cos(i * 0.37)) * 0.6;
    lines.push(x, 0, -height, x, 0, height);
  }
  return lines;
}

function aiGlyph() {
  const nodes = [
    [-1, -0.5], [-1, 0.5], [0, -0.7], [0, 0], [0, 0.7], [1, -0.3], [1, 0.4],
  ];
  const links = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [0, 4], [2, 6]];
  const lines = links.flatMap(([a, b]) => [nodes[a][0], 0, nodes[a][1], nodes[b][0], 0, nodes[b][1]]);
  nodes.forEach(([x, z]) => {
    lines.push(x - 0.07, 0, z - 0.07, x + 0.07, 0, z + 0.07, x - 0.07, 0, z + 0.07, x + 0.07, 0, z - 0.07);
  });
  return lines;
}

const glyphBuilders = [webGlyph, serverGlyph, voiceGlyph, aiGlyph];

export const createStackScene: SceneFactory = ({ scene, camera, hover }) => {
  camera.position.set(6.2, 5.2, 6.2);
  camera.lookAt(0, 0, 0);
  camera.fov = 30;

  const slabGeometry = new THREE.BoxGeometry(WIDTH, THICKNESS, DEPTH);
  const slabEdges = new THREE.EdgesGeometry(slabGeometry);
  const hitGeometry = new THREE.BoxGeometry(WIDTH * 1.05, GAP * 0.92, DEPTH * 1.05);
  const hitMaterial = new THREE.MeshBasicMaterial();
  const disposables: { dispose: () => void }[] = [slabGeometry, slabEdges, hitGeometry, hitMaterial];
  const hitBoxes: THREE.Mesh[] = [];

  const layers = glyphBuilders.map((build, index) => {
    const uniforms = {
      uBase: { value: palette.panel },
      uLight: { value: palette.dim },
      uGlow: { value: 0 },
      uGlowColor: { value: palette.signal },
    };
    const slabMaterial = new THREE.ShaderMaterial({ uniforms, vertexShader: facetVertex, fragmentShader: facetFragment });
    const slab = new THREE.Mesh(slabGeometry, slabMaterial);

    const edgeMaterial = new THREE.LineBasicMaterial({ color: palette.grey.clone(), transparent: true, opacity: 0.7 });
    const edges = new THREE.LineSegments(slabEdges, edgeMaterial);

    const glyphGeometry = new THREE.BufferGeometry();
    glyphGeometry.setAttribute("position", new THREE.Float32BufferAttribute(build(), 3));
    const glyphMaterial = new THREE.LineBasicMaterial({ color: palette.grey.clone() });
    const glyph = new THREE.LineSegments(glyphGeometry, glyphMaterial);
    glyph.position.y = THICKNESS / 2 + 0.002;

    const hitBox = new THREE.Mesh(hitGeometry, hitMaterial);
    hitBox.visible = false;
    hitBox.userData.layerIndex = index;
    hitBoxes.push(hitBox);

    const layer = new THREE.Group();
    layer.add(slab, edges, glyph, hitBox);
    layer.position.y = ((LAYER_COUNT - 1) / 2 - index) * GAP;
    scene.add(layer);
    disposables.push(slabMaterial, edgeMaterial, glyphGeometry, glyphMaterial);

    return { layer, uniforms, edgeMaterial, glyphMaterial, baseY: layer.position.y, glow: 0 };
  });

  const spineGeometry = new THREE.BufferGeometry();
  const spine: number[] = [];
  [[-WIDTH / 2, -DEPTH / 2], [WIDTH / 2, -DEPTH / 2], [WIDTH / 2, DEPTH / 2], [-WIDTH / 2, DEPTH / 2]].forEach(([x, z]) => {
    spine.push(x, -GAP * 2, z, x, GAP * 2, z);
  });
  spineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(spine, 3));
  const spineMaterial = new THREE.LineDashedMaterial({ color: palette.dim, dashSize: 0.05, gapSize: 0.07 });
  const spineLines = new THREE.LineSegments(spineGeometry, spineMaterial);
  spineLines.computeLineDistances();
  scene.add(spineLines);
  disposables.push(spineGeometry, spineMaterial);

  let pinned: number | null = null;
  let hovered: number | null = null;
  let spread = 1;
  const raycaster = new THREE.Raycaster();

  const pickLayer = () => {
    if (!hover.inside) return null;
    raycaster.setFromCamera(hover.local, camera);
    const hit = raycaster.intersectObjects(hitBoxes, false)[0];
    return hit ? (hit.object.userData.layerIndex as number) : hovered;
  };
  const onFocus = (event: Event) => {
    const detail = (event as CustomEvent<number | null>).detail;
    pinned = typeof detail === "number" ? detail : null;
  };
  window.addEventListener(STACK_FOCUS_EVENT, onFocus);

  const activeColor = palette.signal;
  const idleColor = palette.grey;

  return {
    resize(width, height) {
      const scale = Math.min(1, (width / height) * 0.9);
      layers.forEach(({ layer }) => layer.scale.setScalar(scale));
      spineLines.scale.setScalar(scale);
    },
    update(time, delta) {
      const step = delta || 0.016;
      spread = damp(spread, hover.inside ? 1.35 : 1, 4, step);
      const picked = pickLayer();
      if (picked !== hovered) {
        hovered = picked;
        window.dispatchEvent(new CustomEvent(STACK_HOVER_EVENT, { detail: hovered }));
      }
      const active = pinned ?? hovered ?? Math.floor(time / CYCLE_SECONDS) % LAYER_COUNT;
      layers.forEach((item, index) => {
        const isActive = index === active;
        item.glow = damp(item.glow, isActive ? 1 : 0, 7, step);
        item.uniforms.uGlow.value = item.glow;
        item.layer.position.x = item.glow * 0.55;
        item.layer.position.y = item.baseY * item.layer.scale.y * spread + Math.sin(time * 1.2 + index) * 0.04;
        item.edgeMaterial.color.copy(idleColor).lerp(activeColor, item.glow);
        item.glyphMaterial.color.copy(idleColor).lerp(activeColor, item.glow);
      });
    },
    dispose() {
      window.removeEventListener(STACK_FOCUS_EVENT, onFocus);
      disposables.forEach((item) => item.dispose());
    },
  };
};
