"use client";

import { useEffect, useRef } from "react";
import { tapeItems } from "@/lib/data/hero";
import { prefersReducedMotion } from "@/lib/scramble";
import { useVisible } from "../effects/useVisible";
import styles from "./Columns.module.css";

const BASE_SPEED = 40;

function Group({ hidden = false }: { hidden?: boolean }) {
  return (
    <span className={styles.tapeGroup} aria-hidden={hidden || undefined}>
      {tapeItems.map((item, index) => (
        <span key={item} className={styles.tapeItem} style={{ "--i": index } as React.CSSProperties}>
          {item}
          <i aria-hidden="true">—</i>
        </span>
      ))}
    </span>
  );
}

export default function Tape() {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !visible || prefersReducedMotion()) return;

    let offset = 0;
    let velocity = 0;
    let lastScroll = window.scrollY;
    let lastTime = performance.now();
    let frameId = 0;

    const frame = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const scroll = window.scrollY;
      const scrollSpeed = (scroll - lastScroll) / Math.max(delta, 0.001);
      lastScroll = scroll;
      velocity += (scrollSpeed - velocity) * 0.12;

      const half = track.scrollWidth / 2;
      offset = (offset + (BASE_SPEED + Math.abs(velocity) * 0.6) * delta * (velocity < -5 ? -1 : 1)) % half;
      if (offset < 0) offset += half;
      const skew = Math.max(-12, Math.min(12, velocity * -0.02));
      track.style.transform = `translate3d(${-offset}px, 0, 0) skewX(${skew}deg)`;
      frameId = requestAnimationFrame(frame);
    };
    frameId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(frameId);
  }, [visible]);

  return (
    <div ref={ref} className={styles.tape} aria-hidden="true">
      <div ref={trackRef} className={styles.tapeTrack}>
        <Group />
        <Group hidden />
      </div>
    </div>
  );
}
