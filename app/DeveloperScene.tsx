"use client";

import { useEffect, useRef } from "react";

export default function DeveloperScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    async function initialize() {
      const [THREE, { RoomEnvironment }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/environments/RoomEnvironment.js"),
      ]);
      if (disposed || !canvas || !container) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      const coarse = window.matchMedia("(pointer: coarse)");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
      renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, coarse.matches ? 1.25 : 1.75),
      );
      renderer.setClearColor(0x111310, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.3;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
      camera.position.set(0, 0, 6.7);
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const environment = pmrem.fromScene(room, 0.04);
      scene.environment = environment.texture;
      scene.environmentIntensity = 1.1;
      room.dispose();
      pmrem.dispose();

      const sculpture = new THREE.Group();
      sculpture.rotation.set(-0.3, 0.2, -0.55);
      scene.add(sculpture);
      const geometry = new THREE.TorusKnotGeometry(
        1.03,
        0.37,
        coarse.matches ? 128 : 220,
        36,
        2,
        3,
      );
      const material = new THREE.MeshPhysicalMaterial({
        color: 0xa8b59a,
        metalness: 1,
        roughness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.16,
        envMapIntensity: 1.7,
      });
      const knot = new THREE.Mesh(geometry, material);
      sculpture.add(knot);
      const orbitGeometry = new THREE.TorusGeometry(2.08, 0.008, 8, 160);
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0xd1ff62,
        transparent: true,
        opacity: 0.38,
      });
      const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbit.rotation.set(1.1, -0.4, 0.35);
      scene.add(orbit);
      const coreGeometry = new THREE.IcosahedronGeometry(0.36, 3);
      const coreMaterial = new THREE.MeshStandardMaterial({
        color: 0xd1ff62,
        emissive: 0xa5ff38,
        emissiveIntensity: 1,
        roughness: 0.35,
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      sculpture.add(core);
      const limeLight = new THREE.PointLight(0xcfff65, 25, 10, 2);
      limeLight.position.set(-2.5, -1.8, 2);
      scene.add(limeLight);
      const whiteLight = new THREE.DirectionalLight(0xffffff, 3);
      whiteLight.position.set(2, 4, 5);
      scene.add(whiteLight);
      const rimLight = new THREE.DirectionalLight(0xe3ffd4, 3);
      rimLight.position.set(-3, 1, -2);
      scene.add(rimLight);

      let frame = 0;
      let inView = true;
      let lost = false;
      let elapsed = 0;
      let lastTime = 0;
      const pointer = new THREE.Vector2();
      const target = new THREE.Vector2();
      const render = (time: number) => {
        frame = 0;
        if (disposed || lost || !inView || document.hidden) return;
        const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
        lastTime = time;
        if (!reduceMotion.matches) {
          elapsed += delta;
          pointer.lerp(target, 1 - Math.exp(-3 * delta));
          sculpture.rotation.y = 0.2 + elapsed * 0.13 + pointer.x * 0.3;
          sculpture.rotation.x =
            -0.3 + Math.sin(elapsed * 0.27) * 0.13 + pointer.y * 0.18;
          sculpture.rotation.z = -0.55 + Math.sin(elapsed * 0.19) * 0.09;
          sculpture.position.y = Math.sin(elapsed * 0.7) * 0.075;
          orbit.rotation.z = 0.35 + elapsed * 0.035;
        }
        renderer.render(scene, camera);
        container.classList.add("is-ready");
        if (!reduceMotion.matches) frame = requestAnimationFrame(render);
      };
      const schedule = () => {
        if (!frame && inView && !document.hidden && !lost) {
          lastTime = 0;
          frame = requestAnimationFrame(render);
        }
      };
      const pause = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = 0;
      };
      const resize = () => {
        const { width, height } = container.getBoundingClientRect();
        renderer.setSize(Math.max(1, width), Math.max(1, height), false);
        camera.aspect = width / Math.max(1, height);
        camera.updateProjectionMatrix();
        schedule();
      };
      const pointerMove = (event: PointerEvent) => {
        if (reduceMotion.matches || coarse.matches) return;
        target.set(
          (event.clientX / window.innerWidth - 0.5) * 2,
          (event.clientY / window.innerHeight - 0.5) * -2,
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
      const onContextLost = (event: Event) => {
        event.preventDefault();
        lost = true;
        pause();
        container.classList.remove("is-ready");
      };
      const onContextRestored = () => {
        // Render-target textures lose their contents with the WebGL context.
        // Rebuild the reflection environment along with the renderer.
        cleanup();
        cleanup = () => {};
        initialize().catch(() => cleanup());
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) schedule();
        else pause();
      });
      visibilityObserver.observe(container);
      window.addEventListener("pointermove", pointerMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      reduceMotion.addEventListener("change", onPreference);
      canvas.addEventListener("webglcontextlost", onContextLost);
      canvas.addEventListener("webglcontextrestored", onContextRestored);
      resize();
      cleanup = () => {
        pause();
        resizeObserver.disconnect();
        visibilityObserver.disconnect();
        window.removeEventListener("pointermove", pointerMove);
        document.removeEventListener("visibilitychange", onVisibility);
        reduceMotion.removeEventListener("change", onPreference);
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
        geometry.dispose();
        material.dispose();
        orbitGeometry.dispose();
        orbitMaterial.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        environment.dispose();
        renderer.dispose();
        container.classList.remove("is-ready");
      };
    }
    // The typographic fallback stays visible on devices without WebGL.
    initialize().catch(() => {
      cleanup();
    });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div className="developer-scene" ref={containerRef} aria-hidden="true">
      <span className="scene-fallback">✳</span>
      <canvas className="scene-canvas" ref={canvasRef} />
    </div>
  );
}
