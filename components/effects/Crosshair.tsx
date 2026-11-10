"use client";

import { useEffect, useRef } from "react";
import styles from "./Crosshair.module.css";

const SNAP_TARGETS = "a, button, [tabindex], [data-cursor]";
const SNAP_PADDING = 6;
const FREE_SIZE = 18;
const MAGNET_STRENGTH = 0.22;

type Box = { x: number; y: number; w: number; h: number };

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

export default function Crosshair() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLSpanElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const reticle = reticleRef.current;
    const readout = readoutRef.current;
    if (!root || !reticle || !readout) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = { x: -100, y: -100 };
    const lines = { x: -100, y: -100 };
    const box: Box = { x: -100, y: -100, w: FREE_SIZE, h: FREE_SIZE };
    let snapTarget: HTMLElement | null = null;
    let magnet: HTMLElement | null = null;
    let frameId = 0;

    const targetBox = (): Box => {
      if (snapTarget && snapTarget.isConnected) {
        const rect = snapTarget.getBoundingClientRect();
        return {
          x: rect.left - SNAP_PADDING,
          y: rect.top - SNAP_PADDING,
          w: rect.width + SNAP_PADDING * 2,
          h: rect.height + SNAP_PADDING * 2,
        };
      }
      return { x: cursor.x - FREE_SIZE / 2, y: cursor.y - FREE_SIZE / 2, w: FREE_SIZE, h: FREE_SIZE };
    };

    const animate = () => {
      const goal = targetBox();
      const speed = snapTarget ? 0.26 : 0.32;
      box.x = lerp(box.x, goal.x, speed);
      box.y = lerp(box.y, goal.y, speed);
      box.w = lerp(box.w, goal.w, speed);
      box.h = lerp(box.h, goal.h, speed);
      lines.x = lerp(lines.x, cursor.x, 0.3);
      lines.y = lerp(lines.y, cursor.y, 0.3);

      reticle.style.transform = `translate3d(${box.x}px, ${box.y}px, 0)`;
      reticle.style.width = `${box.w}px`;
      reticle.style.height = `${box.h}px`;
      root.style.setProperty("--x", `${lines.x}px`);
      root.style.setProperty("--y", `${lines.y}px`);
      readout.textContent = `x ${String(Math.round(cursor.x)).padStart(4, "0")} · y ${String(Math.round(cursor.y)).padStart(4, "0")}`;

      const settled =
        Math.abs(goal.x - box.x) < 0.2 &&
        Math.abs(goal.y - box.y) < 0.2 &&
        Math.abs(goal.w - box.w) < 0.2 &&
        Math.abs(goal.h - box.h) < 0.2 &&
        Math.abs(cursor.x - lines.x) < 0.2 &&
        Math.abs(cursor.y - lines.y) < 0.2;
      frameId = settled ? 0 : requestAnimationFrame(animate);
    };

    const kick = () => {
      if (!frameId) frameId = requestAnimationFrame(animate);
    };

    const releaseMagnet = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };

    const onMove = (event: PointerEvent) => {
      cursor.x = event.clientX;
      cursor.y = event.clientY;
      root.dataset.visible = "true";

      const element = event.target instanceof Element ? event.target : null;
      const snap = element?.closest<HTMLElement>(SNAP_TARGETS) ?? null;
      if (snap !== snapTarget) {
        snapTarget = snap;
        root.dataset.active = snap ? "true" : "false";
      }

      const spotlight = element?.closest<HTMLElement>("[data-spotlight]");
      if (spotlight) {
        const rect = spotlight.getBoundingClientRect();
        spotlight.style.setProperty("--mx", `${event.clientX - rect.left}px`);
        spotlight.style.setProperty("--my", `${event.clientY - rect.top}px`);
      }

      const magnetic = element?.closest<HTMLElement>("[data-magnetic]") ?? null;
      if (magnetic !== magnet) releaseMagnet();
      if (magnetic) {
        magnet = magnetic;
        magnetic.style.translate = "";
        const rect = magnetic.getBoundingClientRect();
        const dx = (event.clientX - (rect.left + rect.width / 2)) * MAGNET_STRENGTH;
        const dy = (event.clientY - (rect.top + rect.height / 2)) * MAGNET_STRENGTH;
        magnetic.style.translate = `${dx}px ${dy}px`;
      }

      kick();
    };

    const onLeave = (event: PointerEvent) => {
      if (event.relatedTarget) return;
      root.dataset.visible = "false";
      snapTarget = null;
      releaseMagnet();
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
    window.addEventListener("scroll", kick, { passive: true });
    document.addEventListener("pointerout", onLeave, { passive: true });
    return () => {
      cancelAnimationFrame(frameId);
      releaseMagnet();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", kick);
      document.removeEventListener("pointerout", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.crosshair} aria-hidden="true" data-visible="false">
      <span className={styles.lineX} />
      <span className={styles.lineY} />
      <span ref={reticleRef} className={styles.reticle}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span ref={readoutRef} className={styles.readout} />
    </div>
  );
}
