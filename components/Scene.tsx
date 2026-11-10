"use client";

import { useEffect, useRef } from "react";

export type SceneName = "globe" | "wave" | "stack" | "plane";

const loaders = {
  globe: () => import("@/lib/three/globeScene").then((mod) => mod.createGlobeScene),
  wave: () => import("@/lib/three/waveScene").then((mod) => mod.createWaveScene),
  stack: () => import("@/lib/three/stackScene").then((mod) => mod.createStackScene),
  plane: () => import("@/lib/three/planeScene").then((mod) => mod.createPlaneScene),
};

export default function Scene({ name, className }: { name: SceneName; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let unmount: (() => void) | undefined;

    Promise.all([import("@/lib/three/runner"), loaders[name]()]).then(([{ mountScene }, factory]) => {
      if (cancelled) return;
      try {
        unmount = mountScene(host, factory);
        host.dataset.ready = "true";
      } catch {
        host.dataset.ready = "fallback";
      }
    });

    return () => {
      cancelled = true;
      unmount?.();
    };
  }, [name]);

  return <div ref={hostRef} className={`scene ${className ?? ""}`} aria-hidden="true" />;
}
