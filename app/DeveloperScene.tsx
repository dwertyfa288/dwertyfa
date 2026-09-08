"use client";

import { useEffect, useRef } from "react";
import type { SceneVariant } from "./scene-objects";

export default function DeveloperScene({
  variant = "hero",
}: {
  variant?: SceneVariant;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;
    let disposed = false;
    let visible = false;
    let initialized = false;
    let cleanup = () => {};
    let changeVisibility: (visible: boolean) => void = () => {};

    const initialize = async () => {
      const [THREE, { RoomEnvironment }, { createObjects }] = await Promise.all(
        [
          import("three"),
          import("three/examples/jsm/environments/RoomEnvironment.js"),
          import("./scene-objects"),
        ],
      );
      if (disposed) return;
      const disposers: Array<() => void> = [];
      cleanup = () => {
        while (disposers.length) disposers.pop()?.();
        host.classList.remove("scene-ready");
        changeVisibility = () => {};
      };
      const compact = window.matchMedia("(pointer: coarse)").matches;
      const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: !compact,
        powerPreference: "low-power",
      });
      disposers.push(() => renderer.dispose());
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, compact ? 1.15 : 1.65),
      );
      renderer.setClearColor(0x0a0714, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        variant === "hero" ? 39 : 38,
        1,
        0.1,
        50,
      );
      const cameraZ =
        variant === "hero" ? 6.3 : variant === "portal" ? 6.8 : 6.5;
      camera.position.set(0, 0, cameraZ);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      let environment: import("three").WebGLRenderTarget;
      try {
        environment = pmrem.fromScene(room, 0.03);
      } finally {
        room.dispose();
        pmrem.dispose();
      }
      disposers.push(() => environment.dispose());
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.3;
      const objects = createObjects(variant, compact);
      scene.add(objects.root, objects.stars);
      const baseRotation = objects.root.rotation.clone();
      disposers.push(() => {
        const geometries = new Set<import("three").BufferGeometry>();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Points)
            geometries.add(object.geometry);
        });
        geometries.forEach((geometry) => geometry.dispose());
        new Set(objects.materials).forEach((material) => material.dispose());
      });
      const violetLight = new THREE.PointLight(0x9a6cff, 35, 12, 2);
      violetLight.position.set(2.5, 2, 3);
      const peachLight = new THREE.PointLight(0xffb196, 28, 10, 2);
      peachLight.position.set(-2.5, -1.5, 2.5);
      const whiteLight = new THREE.DirectionalLight(0xe8dfff, 4);
      whiteLight.position.set(-3, 4, 4);
      scene.add(violetLight, peachLight, whiteLight);
      let frame = 0;
      let elapsed = 0;
      let lastTime = 0;
      let lost = false;
      let inView = visible;
      let heroProgress = 0;
      const pointer = new THREE.Vector2();
      const target = new THREE.Vector2();
      const draw = (time: number) => {
        frame = 0;
        if (disposed || lost || !inView || document.hidden) return;
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        if (!preference.matches) {
          elapsed += delta;
          pointer.lerp(target, 1 - Math.exp(-3.5 * delta));
          objects.root.rotation.x =
            baseRotation.x + pointer.y * 0.1 + Math.sin(elapsed * 0.15) * 0.04;
          objects.root.rotation.y =
            baseRotation.y +
            pointer.x * 0.16 +
            (variant === "systems"
              ? elapsed * 0.1
              : Math.sin(elapsed * 0.2) * 0.08);
          const scatter = variant === "hero" ? heroProgress * 0.65 : 0;
          objects.floating.forEach(({ mesh, origin, phase, speed }, index) => {
            if (variant === "systems") {
              const breathe = 1 + Math.sin(elapsed * 0.65) * 0.075;
              mesh.position.copy(origin).multiplyScalar(breathe);
            } else if (variant === "portal") {
              mesh.rotation.z = elapsed * 0.05 + index * 0.08;
              mesh.rotation.y =
                index * 0.012 + Math.sin(elapsed * 0.35 + index * 0.15) * 0.13;
            } else {
              mesh.position.x = origin.x * (1 + scatter);
              mesh.position.y =
                origin.y * (1 + scatter) +
                Math.sin(elapsed * 0.65 + phase) * 0.075;
              if (variant === "hero") {
                mesh.rotation.y += delta * speed;
                mesh.rotation.z += delta * speed * 0.3;
              }
            }
          });
          objects.stars.rotation.z = elapsed * 0.009;
          camera.position.z =
            cameraZ - (variant === "hero" ? heroProgress * 0.9 : 0);
        }
        renderer.render(scene, camera);
        host.classList.add("scene-ready");
        if (!preference.matches) frame = requestAnimationFrame(draw);
      };
      const pause = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      };
      const schedule = () => {
        if (!frame && inView && !document.hidden && !lost) {
          lastTime = 0;
          frame = requestAnimationFrame(draw);
        }
      };
      changeVisibility = (value) => {
        inView = value;
        if (value) schedule();
        else pause();
      };
      const resize = () => {
        const { width, height } = host.getBoundingClientRect();
        renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
        // Keep the full constellation in view on tall phone screens.
        if (variant === "hero")
          objects.root.scale.setScalar(
            camera.aspect < 1 ? camera.aspect * 1.5 : 1,
          );
        schedule();
      };
      const move = (event: PointerEvent) => {
        if (!inView || compact || preference.matches) return;
        target.set(
          (event.clientX / window.innerWidth - 0.5) * 2,
          (event.clientY / window.innerHeight - 0.5) * -2,
        );
      };
      const scroll = () => {
        if (variant === "hero" && inView)
          heroProgress = Math.max(
            0,
            Math.min(1, window.scrollY / host.clientHeight),
          );
      };
      const onVisibility = () => {
        if (document.hidden) pause();
        else schedule();
      };
      const onPreference = () => {
        pause();
        schedule();
      };
      const onLost = (event: Event) => {
        event.preventDefault();
        lost = true;
        pause();
        host.classList.remove("scene-ready");
      };
      const onRestore = () => {
        cleanup();
        initialize().catch(() => cleanup());
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(host);
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("scroll", scroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      preference.addEventListener("change", onPreference);
      canvas.addEventListener("webglcontextlost", onLost);
      canvas.addEventListener("webglcontextrestored", onRestore);
      disposers.push(() => {
        pause();
        resizeObserver.disconnect();
        window.removeEventListener("pointermove", move);
        window.removeEventListener("scroll", scroll);
        document.removeEventListener("visibilitychange", onVisibility);
        preference.removeEventListener("change", onPreference);
        canvas.removeEventListener("webglcontextlost", onLost);
        canvas.removeEventListener("webglcontextrestored", onRestore);
      });
      scroll();
      resize();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !initialized) {
          initialized = true;
          initialize().catch(() => cleanup());
        }
        changeVisibility(visible);
      },
      { rootMargin: "150px" },
    );
    observer.observe(host);
    return () => {
      disposed = true;
      observer.disconnect();
      cleanup();
    };
  }, [variant]);
  return (
    <div
      className={`spatial-scene spatial-scene--${variant}`}
      ref={hostRef}
      aria-hidden="true"
    >
      <span className="scene-fallback">✧</span>
      <canvas ref={canvasRef} />
    </div>
  );
}
