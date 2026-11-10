import CapabilityList from "./CapabilityList";
import Frame, { CropMarks } from "./Frame";
import Scene from "./Scene";
import { steps } from "@/lib/data/capabilities";
import styles from "./Capabilities.module.css";

export default function Capabilities() {
  return (
    <Frame id="skills" label="03 — стек / что делаю" meta="4 слоя · один продукт" fig="fig. 11 — процесс">
      <div className={styles.layout}>
        <figure className={styles.figure}>
          <CropMarks />
          <Scene name="stack" className={styles.scene} />
          <figcaption className={`mono ${styles.caption}`}>
            <span>fig. 10 — слои продукта</span>
            <span className="signal">web · api · voice · ai</span>
          </figcaption>
        </figure>
        <div className={styles.side}>
          <h2 className={styles.title} data-reveal>
            Собираю продукт целиком<span className="signal">.</span>
          </h2>
          <p className={styles.lead} data-reveal>
            От интерфейса до сервера — каждый слой под одной рукой. Наведите на слой.
          </p>
          <CapabilityList />
        </div>
      </div>

      <ol className={styles.process}>
        {steps.map(([title, text], index) => (
          <li key={title} data-reveal style={{ "--delay": `${index * 0.08}s` } as React.CSSProperties}>
            <span className="mono signal">{String(index + 1).padStart(2, "0")} →</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </Frame>
  );
}
