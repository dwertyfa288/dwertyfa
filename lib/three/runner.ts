import * as THREE from "three";

export type SceneContext = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  pointer: THREE.Vector2;
  compact: boolean;
};

export type SceneModule = {
  update: (time: number, delta: number) => void;
  resize?: (width: number, height: number) => void;
  dispose: () => void;
};

export type SceneFactory = (context: SceneContext) => SceneModule;

export function mountScene(host: HTMLElement, factory: SceneFactory) {
  const compact = window.matchMedia("(max-width: 760px)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pixelRatio = Math.min(window.devicePixelRatio || 1, compact ? 1.25 : 1.6);

  const renderer = new THREE.WebGLRenderer({
    antialias: pixelRatio < 1.5,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const pointer = new THREE.Vector2();
  const sceneModule = factory({ scene, camera, pointer, compact });

  let elapsed = 0;
  let lastTime = 0;
  let frameId = 0;
  let onScreen = false;

  const render = () => renderer.render(scene, camera);

  const frame = (now: number) => {
    frameId = requestAnimationFrame(frame);
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    elapsed += delta;
    sceneModule.update(elapsed, delta);
    render();
  };

  const syncLoop = () => {
    const shouldRun = onScreen && !document.hidden && !reducedMotion;
    if (shouldRun && !frameId) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    } else if (!shouldRun && frameId) {
      cancelAnimationFrame(frameId);
      frameId = 0;
    }
  };

  const resize = () => {
    const width = Math.max(1, host.clientWidth);
    const height = Math.max(1, host.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    sceneModule.resize?.(width, height);
    if (!frameId) {
      sceneModule.update(elapsed + 2, 0);
      render();
    }
  };

  const onPointerMove = (event: PointerEvent) => {
    pointer.set(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1,
    );
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting;
      syncLoop();
    },
    { rootMargin: "80px" },
  );
  visibilityObserver.observe(host);

  document.addEventListener("visibilitychange", syncLoop);
  if (!compact) window.addEventListener("pointermove", onPointerMove, { passive: true });
  resize();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    document.removeEventListener("visibilitychange", syncLoop);
    window.removeEventListener("pointermove", onPointerMove);
    sceneModule.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
