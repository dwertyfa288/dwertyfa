import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export type SceneVariant =
  | "hero"
  | "interface"
  | "systems"
  | "connections"
  | "portal";
export type FloatingObject = {
  mesh: THREE.Object3D;
  origin: THREE.Vector3;
  phase: number;
  speed: number;
};

export function createObjects(variant: SceneVariant, compact: boolean) {
  const root = new THREE.Group();
  const floating: FloatingObject[] = [];
  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xc5b4ff,
    roughness: 0.07,
    metalness: 0.12,
    transmission: 0.88,
    thickness: 1.2,
    ior: 1.65,
    clearcoat: 1,
    iridescence: 0.7,
    iridescenceIOR: 1.4,
    envMapIntensity: 2.3,
  });
  const rose = new THREE.MeshPhysicalMaterial({
    color: 0xffbaaa,
    roughness: 0.11,
    metalness: 0.15,
    transmission: 0.72,
    thickness: 0.8,
    ior: 1.5,
    clearcoat: 1,
    iridescence: 0.5,
    envMapIntensity: 2,
  });
  const chrome = new THREE.MeshPhysicalMaterial({
    color: 0xa59dcc,
    metalness: 1,
    roughness: 0.17,
    clearcoat: 1,
    envMapIntensity: 2.2,
  });
  const warm = new THREE.MeshStandardMaterial({
    color: 0xffbb91,
    metalness: 0.65,
    roughness: 0.23,
    emissive: 0x7d3524,
    emissiveIntensity: 0.25,
  });
  const glow = new THREE.MeshBasicMaterial({
    color: 0xb29bff,
    transparent: true,
    opacity: 0.48,
  });
  const materials: THREE.Material[] = [glass, rose, chrome, warm, glow];
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    position: [number, number, number],
    scale = 1,
  ) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.scale.setScalar(scale);
    root.add(mesh);
    floating.push({
      mesh,
      origin: mesh.position.clone(),
      phase: floating.length * 1.7,
      speed: 0.08 + (floating.length % 3) * 0.03,
    });
    return mesh;
  };
  const sphere = (radius: number) =>
    new THREE.SphereGeometry(radius, compact ? 28 : 48, compact ? 20 : 32);
  const torus = (radius: number, tube: number) =>
    new THREE.TorusGeometry(
      radius,
      tube,
      compact ? 20 : 32,
      compact ? 64 : 110,
    );

  if (variant === "hero") {
    const ring = add(torus(0.92, 0.28), glass, [2.25, 0.55, 0]);
    ring.rotation.set(0.8, -0.4, 0.6);
    const orb = add(sphere(0.65), rose, [-2.45, -0.9, 0.3]);
    orb.rotation.set(0.4, 0.3, 0);
    class Helix extends THREE.Curve<THREE.Vector3> {
      constructor() {
        super();
      }
      getPoint(t: number, target = new THREE.Vector3()) {
        const angle = t * Math.PI * 8;
        return target.set(
          Math.cos(angle) * 0.43,
          (t - 0.5) * 2,
          Math.sin(angle) * 0.43,
        );
      }
    }
    const coil = add(
      new THREE.TubeGeometry(new Helix(), compact ? 130 : 200, 0.12, 14, false),
      chrome,
      [-2.35, 1.0, -0.2],
    );
    coil.rotation.set(0.2, 0, -0.6);
    const crystal = add(
      new THREE.OctahedronGeometry(0.62, 0),
      glass,
      [2.1, -1.35, 0.65],
    );
    crystal.rotation.set(0.3, 0.5, -0.2);
    add(sphere(0.22), warm, [-0.9, 1.8, 0]);
    add(sphere(0.13), chrome, [0.9, -1.7, 0.7]);
    const satellite = add(torus(0.32, 0.07), rose, [2.95, 1.75, -0.6]);
    satellite.rotation.set(0.7, 0.1, 0);
    const orbit = add(torus(2.2, 0.007), glow, [0, 0, -0.8]);
    orbit.rotation.set(1.02, 0.25, -0.4);
    add(
      new RoundedBoxGeometry(0.5, 0.5, 0.5, 3, 0.1),
      chrome,
      [-3.2, -0.1, -1],
    );
  } else if (variant === "interface") {
    for (let index = 0; index < 3; index++) {
      const pane = add(
        new RoundedBoxGeometry(2.25, 1.5, 0.19, 3, 0.12),
        index === 1 ? rose : glass,
        [(index - 1) * 0.36, (index - 1) * 0.34, (index - 1) * -0.4],
      );
      pane.rotation.set(0.16, -0.48, -0.1);
    }
    add(sphere(0.26), warm, [1.2, -0.8, 0.6]);
    root.rotation.set(-0.15, 0.1, 0.05);
  } else if (variant === "systems") {
    const cube = new RoundedBoxGeometry(0.48, 0.48, 0.48, 2, 0.07);
    for (let x = -1; x <= 1; x++)
      for (let y = -1; y <= 1; y++)
        for (let z = -1; z <= 1; z++) {
          add(cube, (x + y + z) % 3 === 0 ? chrome : glass, [
            x * 0.63,
            y * 0.63,
            z * 0.63,
          ]);
        }
    root.rotation.set(0.4, 0.65, 0.1);
  } else if (variant === "connections") {
    for (let index = 0; index < 3; index++) {
      const link = add(
        torus(0.69, 0.18),
        index === 1 ? chrome : index === 0 ? glass : rose,
        [(index - 1) * 0.92, 0, 0],
      );
      link.rotation.set(index % 2 ? 1.35 : 0.3, 0.15, 0.25);
    }
    root.rotation.set(0.35, -0.2, -0.35);
  } else {
    for (let index = 0; index < 18; index++) {
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.75 + index * 0.009, 0.6, 0.65),
        emissive: new THREE.Color().setHSL(0.75 + index * 0.009, 0.7, 0.35),
        emissiveIntensity: 0.65,
        metalness: 0.7,
        roughness: 0.2,
      });
      materials.push(material);
      const ring = add(torus(1.15 + index * 0.052, 0.025), material, [
        0,
        0,
        -index * 0.18,
      ]);
      ring.rotation.set(0.02 * index, 0.01 * index, 0);
    }
    root.rotation.set(0.25, -0.45, 0.2);
    add(sphere(0.42), glass, [0, 0, -0.7]);
  }

  const starsGeometry = new THREE.BufferGeometry();
  const starCount = variant === "hero" ? 100 : variant === "portal" ? 70 : 20;
  const positions = new Float32Array(starCount * 3);
  for (let index = 0; index < starCount; index++) {
    positions[index * 3] = Math.sin(index * 127.1) * 4.5;
    positions[index * 3 + 1] = Math.cos(index * 311.7) * 2.8;
    positions[index * 3 + 2] = -2 - (index % 7) * 0.35;
  }
  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3),
  );
  const starMaterial = new THREE.PointsMaterial({
    color: 0xd0bdff,
    size: 0.013,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
  });
  materials.push(starMaterial);
  const stars = new THREE.Points(starsGeometry, starMaterial);
  return { root, floating, stars, materials };
}
