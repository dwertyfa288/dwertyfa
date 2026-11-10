"use client";

import { capabilities } from "@/lib/data/capabilities";
import styles from "./Capabilities.module.css";

import { STACK_FOCUS_EVENT } from "@/lib/three/events";

function focusLayer(index: number | null) {
  window.dispatchEvent(new CustomEvent(STACK_FOCUS_EVENT, { detail: index }));
}

export default function CapabilityList() {
  return (
    <ol className={styles.list} onPointerLeave={() => focusLayer(null)}>
      {capabilities.map((item, index) => (
        <li
          key={item.title}
          className={styles.item}
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
