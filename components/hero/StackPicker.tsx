import { stackItems } from "@/lib/data/hero";
import styles from "./Hero.module.css";

const STEP_SECONDS = 1.4;

export default function StackPicker() {
  return (
    <div className={styles.column}>
      <span className="mono">02 / стек</span>
      <ol className={styles.stack}>
        {stackItems.map((item, index) => (
          <li
            key={item}
            style={
              {
                "--pick-delay": `${index * STEP_SECONDS}s`,
                "--pick-duration": `${stackItems.length * STEP_SECONDS}s`,
              } as React.CSSProperties
            }
          >
            <span className={styles.stackIndex}>{String(index + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ol>
    </div>
  );
}
