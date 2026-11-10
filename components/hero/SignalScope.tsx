"use client";

import { useEffect, useRef, useState } from "react";
import { signalCommands } from "@/lib/data/hero";
import { prefersReducedMotion } from "@/lib/scramble";
import { useVisible } from "../effects/useVisible";
import heroStyles from "./Hero.module.css";
import styles from "./Columns.module.css";

const COMMAND_MS = 4200;
const EQ_BARS = 18;
const SIGNAL = "#ff5b14";
const DIM = "#57554f";

export default function SignalScope() {
  const [ref, visible] = useVisible<HTMLDivElement>("60px");
  const [command, setCommand] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const eqRef = useRef<HTMLDivElement>(null);
  const dbRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setCommand((value) => (value + 1) % signalCommands.length), COMMAND_MS);
    return () => window.clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const eq = eqRef.current;
    const db = dbRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !eq || !db || !context) return;

    const bars = Array.from(eq.children) as HTMLElement[];
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let energy = 0.25;
    let targetEnergy = 0.25;
    let lastPointer = { x: 0, y: 0, time: performance.now() };
    let frameId = 0;
    let lastDb = 0;

    let running = false;

    const resize = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (!running) paint(performance.now());
    };

    const onMove = (event: PointerEvent) => {
      const now = performance.now();
      const distance = Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y);
      const speed = distance / Math.max(now - lastPointer.time, 1);
      targetEnergy = Math.min(0.25 + speed * 0.35, 1.4);
      lastPointer = { x: event.clientX, y: event.clientY, time: now };
    };

    const sample = (x: number, time: number) => {
      const phase = x / width;
      const envelope = 0.55 + 0.45 * Math.sin(phase * Math.PI * 2 + time * 0.7);
      return (
        (Math.sin(phase * 38 + time * 6) * 0.5 +
          Math.sin(phase * 91 - time * 9) * 0.28 +
          Math.sin(phase * 13 + time * 2.3) * 0.22) *
        envelope
      );
    };

    const paint = (now: number) => {
      const time = now / 1000;
      energy += (targetEnergy - energy) * 0.08;
      targetEnergy += (0.25 - targetEnergy) * 0.03;
      const mid = height / 2;
      const amplitude = mid * 0.85 * energy;

      context.clearRect(0, 0, width, height);
      context.setLineDash([2, 4]);
      context.strokeStyle = DIM;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, mid);
      context.lineTo(width, mid);
      context.stroke();
      context.setLineDash([]);

      const scan = ((time * 0.45) % 1) * width;
      const path = new Path2D();
      for (let x = 0; x <= width; x += 2) {
        const y = mid + sample(x, time) * amplitude;
        if (x === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      }
      context.strokeStyle = "rgba(255, 91, 20, 0.22)";
      context.lineWidth = 5;
      context.stroke(path);
      context.strokeStyle = SIGNAL;
      context.lineWidth = 1.5;
      context.stroke(path);

      const gradient = context.createLinearGradient(scan - 40, 0, scan, 0);
      gradient.addColorStop(0, "rgba(255, 91, 20, 0)");
      gradient.addColorStop(1, "rgba(255, 91, 20, 0.18)");
      context.fillStyle = gradient;
      context.fillRect(scan - 40, 0, 40, height);
      context.fillStyle = SIGNAL;
      context.fillRect(scan, 0, 1, height);

      bars.forEach((bar, index) => {
        const level = Math.abs(sample((index / EQ_BARS) * width, time * 1.3)) * energy;
        bar.style.transform = `scaleY(${Math.min(0.08 + level * 1.1, 1)})`;
      });

      if (now - lastDb > 120) {
        lastDb = now;
        db.textContent = `${(-42 + energy * 34 + Math.random() * 2).toFixed(1)} dB`;
      }
    };

    const draw = (now: number) => {
      paint(now);
      frameId = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    window.addEventListener("pointermove", onMove, { passive: true });

    running = visible && !prefersReducedMotion();
    if (running) frameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [visible]);

  const text = signalCommands[command];

  return (
    <div ref={ref} className={heroStyles.column}>
      <div className={styles.head}>
        <span className="mono">03 / сигнал</span>
        <span className={`mono signal ${styles.rec}`}>
          <i aria-hidden="true" /> voice in
        </span>
      </div>
      <div className={styles.scope}>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <div className={styles.meter}>
        <div ref={eqRef} className={styles.eq} aria-hidden="true">
          {Array.from({ length: EQ_BARS }, (_, index) => (
            <i key={index} />
          ))}
        </div>
        <span ref={dbRef} className={`mono ${styles.db}`}>
          -30.0 dB
        </span>
      </div>
      <code className={styles.command}>
        <span key={command} style={{ "--chars": text.length } as React.CSSProperties}>
          {text}
        </span>
      </code>
    </div>
  );
}
