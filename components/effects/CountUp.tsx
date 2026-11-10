"use client";

import { useEffect, useRef } from "react";

const DURATION_MS = 1400;

export default function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const match = value.match(/^(\d+)(.*)$/);
    if (!element || !match) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = Number(match[1]);
    const width = match[1].length;
    const suffix = match[2];
    let frameId = 0;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / DURATION_MS, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        element.textContent = `${String(Math.round(target * eased)).padStart(width, "0")}${suffix}`;
        if (progress < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      run();
    });
    observer.observe(element);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frameId);
      element.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}
