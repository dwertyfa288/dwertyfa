"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { stackItems } from "@/lib/data/hero";
import { prefersReducedMotion, scrambleTo } from "@/lib/scramble";
import { useVisible } from "../effects/useVisible";
import heroStyles from "./Hero.module.css";
import styles from "./Columns.module.css";

const STEP_MS = 1600;

export default function StackPicker() {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const noteRef = useRef<HTMLSpanElement>(null);
  const current = pinned ?? active;

  useEffect(() => {
    if (!visible || pinned !== null || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % stackItems.length), STEP_MS);
    return () => window.clearInterval(timer);
  }, [visible, pinned]);

  useLayoutEffect(() => {
    const item = itemRefs.current[current];
    const highlight = highlightRef.current;
    if (!item || !highlight) return;
    highlight.style.transform = `translate(${item.offsetLeft}px, ${item.offsetTop}px)`;
    highlight.style.width = `${item.offsetWidth}px`;
    highlight.style.height = `${item.offsetHeight}px`;
  }, [current]);

  useEffect(() => {
    const note = noteRef.current;
    if (!note) return;
    return scrambleTo(note, stackItems[current].note, 500);
  }, [current]);

  const item = stackItems[current];

  return (
    <div ref={ref} className={heroStyles.column}>
      <div className={styles.head}>
        <span className="mono">02 / стек</span>
        <span className="mono">
          lvl <span className="signal">{item.level}</span>
        </span>
      </div>
      <div className={styles.stackWrap} onPointerLeave={() => setPinned(null)}>
        <span ref={highlightRef} className={styles.highlight} aria-hidden="true" />
        <ol className={styles.stack}>
        {stackItems.map((entry, index) => (
          <li
            key={entry.name}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            data-active={index === current || undefined}
            onPointerEnter={() => setPinned(index)}
          >
            <span className={styles.stackIndex}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.stackName}>{entry.name}</span>
            <span className={styles.level} aria-hidden="true">
              <i style={{ width: index === current ? `${entry.level}%` : "0%" }} />
            </span>
          </li>
        ))}
        </ol>
      </div>
      <p className={`mono ${styles.readout}`}>
        <span className="signal">›</span> <span ref={noteRef}>{stackItems[0].note}</span>
      </p>
    </div>
  );
}
