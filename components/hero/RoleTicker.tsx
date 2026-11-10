"use client";

import { useEffect, useRef, useState } from "react";
import { roles } from "@/lib/data/hero";
import { prefersReducedMotion, scrambleTo } from "@/lib/scramble";
import { useVisible } from "../effects/useVisible";
import heroStyles from "./Hero.module.css";
import styles from "./Columns.module.css";

const STEP_MS = 2800;

export default function RoleTicker() {
  const [ref, visible] = useVisible<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const roleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % roles.length), STEP_MS);
    return () => window.clearInterval(timer);
  }, [visible]);

  useEffect(() => {
    const element = roleRef.current;
    if (!element || index === 0) return;
    return scrambleTo(element, roles[index], 650);
  }, [index]);

  return (
    <div ref={ref} className={heroStyles.column}>
      <div className={styles.head}>
        <span className="mono">01 / делаю</span>
        <span className="mono">
          <span className="signal">{String(index + 1).padStart(2, "0")}</span> / {String(roles.length).padStart(2, "0")}
        </span>
      </div>
      <p className={heroStyles.muted}>Проектирую и собираю</p>
      <div className={styles.role}>
        <span ref={roleRef} aria-live="polite">
          {roles[0]}
        </span>
        <i className={styles.caret} aria-hidden="true" />
      </div>
      <div className={styles.timer} data-running={visible || undefined} aria-hidden="true">
        <span key={index} style={{ animationDuration: `${STEP_MS}ms` }} />
      </div>
      <ol className={styles.dots} aria-hidden="true">
        {roles.map((role, dot) => (
          <li key={role} data-active={dot === index || undefined} />
        ))}
      </ol>
      <p className={heroStyles.muted}>Интерфейс, бэкенд, деплой — одними руками и без потерь между этапами.</p>
    </div>
  );
}
