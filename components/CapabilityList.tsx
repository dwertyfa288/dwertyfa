"use client";

import { useEffect, useState } from "react";
import { capabilities } from "@/lib/data/capabilities";
import { STACK_FOCUS_EVENT, STACK_HOVER_EVENT } from "@/lib/three/events";
import styles from "./Capabilities.module.css";

function focusLayer(index: number | null) {
  window.dispatchEvent(new CustomEvent(STACK_FOCUS_EVENT, { detail: index }));
}

export default function CapabilityList() {
  const [sceneHover, setSceneHover] = useState<number | null>(null);

  useEffect(() => {
    const onHover = (event: Event) => {
      const detail = (event as CustomEvent<number | null>).detail;
      setSceneHover(typeof detail === "number" ? detail : null);
    };
    window.addEventListener(STACK_HOVER_EVENT, onHover);
    return () => window.removeEventListener(STACK_HOVER_EVENT, onHover);
  }, []);

  return (
    <ol className={styles.list} onPointerLeave={() => focusLayer(null)}>
      {capabilities.map((item, index) => (
        <li
          key={item.title}
          className={`${styles.item} ${sceneHover === index ? styles.itemActive : ""}`}
          tabIndex={0}
          data-reveal
          onPointerEnter={() => focusLayer(index)}
          onFocus={() => focusLayer(index)}
          onBlur={() => focusLayer(null)}
        >
          <span className={`mono ${styles.number}`}>L{index + 1}</span>
          <div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
          <ul className={styles.stack}>
            {item.stack.map((tech) => (
              <li key={tech} className="mono">
                {tech}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}
