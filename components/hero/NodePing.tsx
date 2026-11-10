"use client";

import { useEffect, useState } from "react";
import { useVisible } from "../effects/useVisible";
import styles from "./Columns.module.css";

const NODES = 14;

export default function NodePing() {
  const [ref, visible] = useVisible<HTMLSpanElement>();
  const [ping, setPing] = useState(24);
  const [online, setOnline] = useState(NODES);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setInterval(() => {
      setPing((value) => Math.max(11, Math.min(48, value + Math.round((Math.random() - 0.5) * 10))));
      setOnline(Math.random() > 0.85 ? NODES - 1 : NODES);
    }, 1100);
    return () => window.clearInterval(timer);
  }, [visible]);

  return (
    <span ref={ref} className={`signal ${styles.ping}`}>
      <i aria-hidden="true" /> {online} узлов · {String(ping).padStart(2, "0")} ms
    </span>
  );
}
