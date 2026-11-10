import { tapeItems } from "@/lib/data/hero";
import styles from "./Hero.module.css";

export default function Tape() {
  const line = `${tapeItems.join("   —   ")}   —   `;
  return (
    <div className={styles.tape} aria-hidden="true">
      <div className={styles.tapeTrack}>
        <span className="mono">{line}</span>
        <span className="mono">{line}</span>
      </div>
    </div>
  );
}
