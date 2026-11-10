"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion, scrambleTo } from "@/lib/scramble";

type Props = {
  text: string;
  className?: string;
  delay?: number;
};

export default function ScrambleText({ text, className, delay = 0 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion()) return;

    let cancel: (() => void) | undefined;
    let timeoutId = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeoutId = window.setTimeout(() => {
          cancel = scrambleTo(element, text);
        }, delay);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeoutId);
      cancel?.();
    };
  }, [text, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
