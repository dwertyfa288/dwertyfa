"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type DeveloperSceneProps = {
  variant?: "hero" | "systems";
  className?: string;
};

type SatelliteData = {
  radius: number;
  speed: number;
  phase: number;
  lift: number;
};

const ACID = 0xc8ff37;
const CORAL = 0xff6847;
const PAPER = 0xf1f0e9;

function createParticleField(count: number, spread: number) {
  const positions = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    positions[index * 3] = (Math.random() - 0.5) * spread;
    positions[index * 3 + 1] = (Math.random() - 0.5) * spread * 0.72;
    positions[index * 3 + 2] = (Math.random() - 0.5) * spread * 0.62;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: PAPER,
      size: 0.014,
      transparent: true,
      opacity: 0.34,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function createSpherePoints(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const radial = Math.sqrt(1 - y * y);
    const theta = goldenAngle * index;

    positions[index * 3] = Math.cos(theta) * radial * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = Math.sin(theta) * radial * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  return new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      color: ACID,
      size: 0.022,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
}

function createHeroObject(root: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  const satellites: THREE.Mesh[] = [];

  const coreGeometry = new THREE.IcosahedronGeometry(1.08, 3);
  const core = new THREE.Mesh(
    coreGeometry,
    new THREE.MeshPhysicalMaterial({
      color: 0x101713,
      emissive: 0x16200e,
      emissiveIntensity: 0.5,
      metalness: 0.48,
      roughness: 0.22,
      transparent: true,
      opacity: 0.88,
      transmission: 0.08,
    }),
  );
  root.add(core);

  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.16, 2)),
    new THREE.LineBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.66,
      blending: THREE.AdditiveBlending,
    }),
  );
  root.add(wire);
  animated.push(wire);

  const innerCore = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.48, 2),
    new THREE.MeshBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    }),
  );
  root.add(innerCore);
  animated.push(innerCore);

  const spherePoints = createSpherePoints(470, 1.42);
  root.add(spherePoints);
  animated.push(spherePoints);

  [
    { radius: 1.72, tube: 0.012, color: ACID, x: 1.18, y: 0.16 },
    { radius: 1.96, tube: 0.008, color: CORAL, x: 0.4, y: 1.18 },
    { radius: 2.22, tube: 0.006, color: PAPER, x: 1.62, y: 0.72 },
  ].forEach((ring, index) => {
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(ring.radius, ring.tube, 6, 180),
      new THREE.MeshBasicMaterial({
        color: ring.color,
        transparent: true,
        opacity: index === 2 ? 0.2 : 0.48,
        blending: THREE.AdditiveBlending,
      }),
    );
    torus.rotation.set(ring.x, ring.y, index * 0.45);
    root.add(torus);
    animated.push(torus);
  });

  for (let index = 0; index < 8; index += 1) {
    const satellite = new THREE.Mesh(
      index % 2 === 0
        ? new THREE.OctahedronGeometry(0.07, 0)
        : new THREE.BoxGeometry(0.09, 0.09, 0.09),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 0 ? CORAL : ACID,
        transparent: true,
        opacity: 0.9,
      }),
    );

    satellite.userData = {
      radius: 1.65 + (index % 4) * 0.2,
      speed: 0.2 + index * 0.035,
      phase: (index / 8) * Math.PI * 2,
      lift: (index % 3 - 1) * 0.42,
    };
    root.add(satellite);
    satellites.push(satellite);
  }

  const particleField = createParticleField(420, 7);
  root.add(particleField);

  return { core, animated, satellites, particleField };
}

function createSystemsObject(root: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  const satellites: THREE.Mesh[] = [];

  const core = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f1713,
      emissive: 0x15220e,
      emissiveIntensity: 0.34,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.88,
      transmission: 0.08,
    }),
  );
  root.add(core);

  const coreEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(1.28, 1.28, 1.28)),
    new THREE.LineBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    }),
  );
  root.add(coreEdges);
  animated.push(coreEdges);

  const nodes: THREE.Vector3[] = [];
  const nodeGroup = new THREE.Group();

  for (let index = 0; index < 18; index += 1) {
    const angle = (index / 18) * Math.PI * 2;
    const radius = 1.75 + (index % 3) * 0.4;
    const position = new THREE.Vector3(
      Math.cos(angle) * radius,
      Math.sin(angle * 2.1) * 0.75,
      Math.sin(angle) * radius,
    );
    nodes.push(position);

    const node = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.12, 0.12),
      new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? CORAL : ACID,
        transparent: true,
        opacity: 0.86,
      }),
    );
    node.position.copy(position);
    node.rotation.set(angle, angle * 0.5, angle * 0.25);
    nodeGroup.add(node);

    const points = new Float32Array([
      0,
      0,
      0,
      position.x,
      position.y,
      position.z,
    ]);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3),
    );
    const line = new THREE.Line(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: index % 4 === 0 ? CORAL : ACID,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      }),
    );
    root.add(line);
  }

  root.add(nodeGroup);
  animated.push(nodeGroup);

  const gridOne = new THREE.GridHelper(7, 14, ACID, 0x243027);
  gridOne.material.transparent = true;
  gridOne.material.opacity = 0.19;
  gridOne.position.y = -1.5;
  root.add(gridOne);

  const gridTwo = gridOne.clone();
  gridTwo.rotation.x = Math.PI / 2;
  gridTwo.position.set(0, 0, -2.45);
  root.add(gridTwo);

  const shell = createSpherePoints(300, 1.72);
  shell.material.opacity = 0.3;
  shell.material.size = 0.017;
  root.add(shell);
  animated.push(shell);

  const particleField = createParticleField(360, 7);
  root.add(particleField);

  return { core, animated, satellites, particleField };
}

function createRoxyObject(root: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  const satellites: THREE.Mesh[] = [];

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(0.86, 32, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x10221a,
      emissive: 0x18320d,
      emissiveIntensity: 0.72,
      metalness: 0.36,
      roughness: 0.2,
      transparent: true,
      opacity: 0.84,
      transmission: 0.14,
    }),
  );
  root.add(core);

  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 18, 12),
    new THREE.MeshBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.48,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    }),
  );
  root.add(globe);
  animated.push(globe);

  const network = new THREE.Group();
  for (let index = 0; index < 11; index += 1) {
    const phi = Math.acos(-1 + (2 * index) / 11);
    const theta = Math.sqrt(11 * Math.PI) * phi;
    const position = new THREE.Vector3(
      Math.cos(theta) * Math.sin(phi) * 1.55,
      Math.sin(theta) * Math.sin(phi) * 1.55,
      Math.cos(phi) * 1.55,
    );
    const node = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.09, 0.09),
      new THREE.MeshBasicMaterial({
        color: index % 4 === 0 ? CORAL : ACID,
        transparent: true,
        opacity: 0.9,
      }),
    );
    node.position.copy(position);
    network.add(node);

    const beamGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      position,
    ]);
    const beam = new THREE.Line(
      beamGeometry,
      new THREE.LineBasicMaterial({
        color: index % 4 === 0 ? CORAL : ACID,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      }),
    );
    network.add(beam);
  }
  root.add(network);
  animated.push(network);

  [
    [1.65, 0.018, 1.1, 0.18],
    [2.0, 0.01, 0.28, 1.12],
    [2.32, 0.006, 1.55, 0.7],
  ].forEach(([radius, tube, x, y], index) => {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(radius, tube, 6, 150),
      new THREE.MeshBasicMaterial({
        color: index === 1 ? CORAL : ACID,
        transparent: true,
        opacity: index === 2 ? 0.18 : 0.46,
        blending: THREE.AdditiveBlending,
      }),
    );
    ring.rotation.set(x, y, index * 0.38);
    root.add(ring);
    animated.push(ring);
  });

  const tunnel = new THREE.Mesh(
    new THREE.TorusGeometry(0.56, 0.09, 10, 70),
    new THREE.MeshBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.32,
      wireframe: true,
    }),
  );
  tunnel.rotation.x = Math.PI / 2;
  tunnel.position.z = 1.25;
  root.add(tunnel);
  animated.push(tunnel);

  const particleField = createParticleField(220, 6);
  particleField.material.color.setHex(ACID);
  particleField.material.opacity = 0.22;
  root.add(particleField);

  return { core, animated, satellites, particleField };
}

function createMontageObject(root: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  const satellites: THREE.Mesh[] = [];
  const frameGroup = new THREE.Group();

  const palette = [0x202020, 0xff6847, 0xc8ff37, 0x353535, 0xf1f0e9];
  for (let index = 0; index < 7; index += 1) {
    const width = index % 3 === 0 ? 1.55 : 1.15;
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.72, 0.055),
      new THREE.MeshPhysicalMaterial({
        color: palette[index % palette.length],
        emissive: palette[index % palette.length],
        emissiveIntensity: index % 3 === 0 ? 0.16 : 0.03,
        metalness: 0.2,
        roughness: 0.55,
        transparent: true,
        opacity: index % 2 === 0 ? 0.92 : 0.72,
      }),
    );
    const row = index % 2 === 0 ? 0.62 : -0.57;
    frame.position.set((index - 3) * 0.58, row, -Math.abs(index - 3) * 0.2);
    frame.rotation.set(
      (index % 2 === 0 ? -1 : 1) * 0.08,
      (index - 3) * -0.08,
      (index - 3) * 0.028,
    );
    frameGroup.add(frame);

    const edge = new THREE.LineSegments(
      new THREE.EdgesGeometry(frame.geometry),
      new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.2,
      }),
    );
    frame.add(edge);
  }
  root.add(frameGroup);
  animated.push(frameGroup);

  const core = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.12, 3),
    new THREE.MeshBasicMaterial({
      color: ACID,
      transparent: true,
      opacity: 0.95,
    }),
  );
  core.rotation.set(Math.PI / 2, 0, -Math.PI / 2);
  core.position.z = 1.1;
  root.add(core);

  const timeline = new THREE.Group();
  [0.8, 1.35, 0.48, 1.05, 0.62, 1.5].forEach((length, index) => {
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(length, 0.075, 0.075),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 0 ? CORAL : index % 2 === 0 ? PAPER : ACID,
        transparent: true,
        opacity: 0.75,
      }),
    );
    bar.position.set(-1.9 + index * 0.72, -1.27, index * 0.04);
    timeline.add(bar);
  });
  root.add(timeline);
  animated.push(timeline);

  const guideRing = new THREE.Mesh(
    new THREE.TorusGeometry(2.35, 0.006, 5, 140),
    new THREE.MeshBasicMaterial({
      color: PAPER,
      transparent: true,
      opacity: 0.13,
    }),
  );
  guideRing.rotation.set(1.1, 0.7, 0.2);
  root.add(guideRing);
  animated.push(guideRing);

  const particleField = createParticleField(180, 6.5);
  particleField.material.opacity = 0.2;
  root.add(particleField);

  return { core, animated, satellites, particleField };
}

function createKsushaObject(root: THREE.Group) {
  const animated: THREE.Object3D[] = [];
  const satellites: THREE.Mesh[] = [];
  const gold = 0xd6bd7a;
  const rose = 0xff8aa5;
  const archGroup = new THREE.Group();

  [1.42, 1.13, 0.83].forEach((radius, index) => {
    const color = index === 1 ? rose : gold;
    const arch = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.025 - index * 0.004, 7, 100, Math.PI),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.72 - index * 0.12,
        blending: THREE.AdditiveBlending,
      }),
    );
    arch.position.y = -0.15;
    arch.position.z = index * 0.12;
    archGroup.add(arch);

    [-1, 1].forEach((side) => {
      const pillarHeight = radius * 1.18;
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.035, pillarHeight, 0.035),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.58 - index * 0.1,
        }),
      );
      pillar.position.set(
        side * radius,
        -0.15 - pillarHeight / 2,
        index * 0.12,
      );
      archGroup.add(pillar);
    });
  });
  archGroup.position.y = 0.55;
  root.add(archGroup);
  animated.push(archGroup);

  const core = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.5, 1),
    new THREE.MeshPhysicalMaterial({
      color: gold,
      emissive: 0x6d3b24,
      emissiveIntensity: 0.45,
      metalness: 0.75,
      roughness: 0.18,
      transparent: true,
      opacity: 0.86,
    }),
  );
  core.position.y = -0.1;
  root.add(core);

  const coreWire = new THREE.Mesh(
    new THREE.DodecahedronGeometry(0.74, 0),
    new THREE.MeshBasicMaterial({
      color: rose,
      transparent: true,
      opacity: 0.3,
      wireframe: true,
    }),
  );
  root.add(coreWire);
  animated.push(coreWire);

  for (let index = 0; index < 9; index += 1) {
    const gem = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.07 + (index % 3) * 0.025, 0),
      new THREE.MeshBasicMaterial({
        color: index % 3 === 0 ? rose : gold,
        transparent: true,
        opacity: 0.85,
      }),
    );
    gem.userData = {
      radius: 1.4 + (index % 4) * 0.22,
      speed: 0.16 + index * 0.025,
      phase: (index / 9) * Math.PI * 2,
      lift: (index % 3 - 1) * 0.35,
    };
    root.add(gem);
    satellites.push(gem);
  }

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(1.9, 0.009, 6, 150),
    new THREE.MeshBasicMaterial({
      color: gold,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    }),
  );
  halo.rotation.set(1.15, 0.35, 0.3);
  root.add(halo);
  animated.push(halo);

  const particleField = createParticleField(190, 6);
  particleField.material.color.setHex(gold);
  particleField.material.opacity = 0.24;
  root.add(particleField);

  return { core, animated, satellites, particleField };
}

export default function DeveloperScene({
  variant = "hero",
  className = "",
}: DeveloperSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, variant === "hero" ? 5.8 : 6.6);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const root = new THREE.Group();
    root.rotation.set(0.18, -0.32, -0.04);
    scene.add(root);

    const sceneObjects =
      variant === "hero"
        ? createHeroObject(root)
        : createSystemsObject(root);

    const acidLight = new THREE.PointLight(ACID, 9, 10, 2);
    acidLight.position.set(2.5, 2.1, 3.2);
    scene.add(acidLight);

    const coralLight = new THREE.PointLight(CORAL, 7, 9, 2);
    coralLight.position.set(-2.8, -1.4, 2.2);
    scene.add(coralLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const clock = new THREE.Clock();
    let frameId = 0;
    let visible = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerTarget.x =
        ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - 0.5) * 2;
      pointerTarget.y =
        ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - 0.5) *
        -2;
    };

    const onPointerLeave = () => pointerTarget.set(0, 0);

    const render = () => {
      frameId = window.requestAnimationFrame(render);
      if (!visible) return;

      const elapsed = clock.getElapsedTime();
      pointer.lerp(pointerTarget, 0.045);

      if (!reduceMotion) {
        root.rotation.y += 0.0024;
        root.rotation.x = 0.18 + pointer.y * 0.17;
        root.rotation.z = pointer.x * -0.08;
        root.position.x = pointer.x * 0.18;
        root.position.y = pointer.y * 0.12;

        sceneObjects.core.rotation.x = elapsed * 0.12;
        sceneObjects.core.rotation.y = elapsed * 0.18;
        sceneObjects.core.scale.setScalar(
          1 + Math.sin(elapsed * 1.45) * 0.025,
        );

        sceneObjects.animated.forEach((object, index) => {
          object.rotation.y += 0.0017 + index * 0.00055;
          object.rotation.z +=
            (index % 2 === 0 ? 1 : -1) * (0.0007 + index * 0.0001);
        });

        sceneObjects.satellites.forEach((satellite) => {
          const data = satellite.userData as SatelliteData;
          const angle = elapsed * data.speed + data.phase;
          satellite.position.set(
            Math.cos(angle) * data.radius,
            Math.sin(angle * 1.7) * 0.34 + data.lift,
            Math.sin(angle) * data.radius,
          );
          satellite.rotation.x = elapsed * 0.8;
          satellite.rotation.y = elapsed * 0.62;
        });

        sceneObjects.particleField.rotation.y = elapsed * -0.018;
        sceneObjects.particleField.position.y = Math.sin(elapsed * 0.33) * 0.1;
      }

      camera.position.x += (pointer.x * 0.26 - camera.position.x) * 0.025;
      camera.position.y += (pointer.y * 0.18 - camera.position.y) * 0.025;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { rootMargin: "120px" },
    );
    visibilityObserver.observe(canvas);

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave);
    resize();
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);

      scene.traverse((object) => {
        if (
          object instanceof THREE.Mesh ||
          object instanceof THREE.Line ||
          object instanceof THREE.LineSegments ||
          object instanceof THREE.Points
        ) {
          object.geometry?.dispose();
          const materials = Array.isArray(object.material)
            ? object.material
            : [object.material];
          materials.forEach((material) => material?.dispose());
        }
      });
      renderer.dispose();
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`developer-scene ${className}`}
      aria-hidden="true"
    />
  );
}
