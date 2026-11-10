import Frame from "./Frame";
import { stats } from "@/lib/data/hero";
import styles from "./Stats.module.css";

export default function Stats() {
  return (
    <Frame label="index / в цифрах" meta="github · ноябрь 2026">
      <ul className={styles.grid}>
        {stats.map((item, index) => (
          <li key={item.label} className={styles.cell} data-reveal style={{ "--delay": `${index * 0.08}s` } as React.CSSProperties}>
            <span className={styles.value}>{item.value}</span>
            <span className={styles.label}>{item.label}</span>
            <span className={styles.bar} aria-hidden="true">
              <i style={{ "--fill": `${[100, 45, 60, 70][index]}%` } as React.CSSProperties} />
            </span>
            <span className={`mono ${styles.note}`}>{item.note}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
