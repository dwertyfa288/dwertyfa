"use client";

import { useEffect, useRef } from "react";
import styles from "./Crosshair.module.css";

const INTERACTIVE = "a, button, [tabindex]";

export default function Crosshair() {
  const rootRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const readout = readoutRef.current;
    if (!root || !readout) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const target = { x: -100, y: -100 };
    const current = { x: -100, y: -100 };
    let frameId = 0;

    const animate = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      root.style.setProperty("--x", `${current.x}px`);
      root.style.setProperty("--y", `${current.y}px`);
      readout.textContent = `x ${String(Math.round(target.x)).padStart(4, "0")} · y ${String(Math.round(target.y)).padStart(4, "0")}`;
      const settled = Math.abs(target.x - current.x) < 0.3 && Math.abs(target.y - current.y) < 0.3;
      frameId = settled ? 0 : requestAnimationFrame(animate);
    };

    const onMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      root.dataset.visible = "true";
      const element = event.target instanceof Element ? event.target.closest(INTERACTIVE) : null;
      root.dataset.active = element ? "true" : "false";
      if (!frameId) frameId = requestAnimationFrame(animate);
    };

    const onLeave = (event: PointerEvent) => {
      if (!event.relatedTarget) root.dataset.visible = "false";
    };

    const onDown = () => {
      root.dataset.pressed = "true";
    };

    const onUp = () => {
      root.dataset.pressed = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.crosshair} aria-hidden="true" data-visible="false">
      <span className={styles.lineX} />
      <span className={styles.lineY} />
      <span className={styles.reticle}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span ref={readoutRef} className={styles.readout} />
    </div>
  );
}
