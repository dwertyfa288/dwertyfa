import ScrambleText from "./effects/ScrambleText";
import Frame from "./Frame";
import Scene from "./Scene";
import WorkIndex from "./WorkIndex";
import { webProjects } from "@/lib/data/projects";
import styles from "./Work.module.css";

const basePath = process.env.BASE_PATH ?? "";

export default function Work() {
  return (
    <Frame
      id="work"
      label="01 — веб / сайты в проде"
      meta={`${String(webProjects.length).padStart(2, "0")} проектов`}
      fig="fig. 02 — поле"
      className={styles.work}
    >
      <div className={styles.field}>
        <Scene name="wave" className={styles.scene} />
        <div className={styles.fieldText} data-reveal>
          <h2 className={styles.title}>
            <ScrambleText text="Сайты с характером" />
            <span className="signal">.</span>
          </h2>
          <p className={styles.note}>От лендингов до целых продуктов. Наведите на строку — откроется превью.</p>
        </div>
      </div>
      <WorkIndex projects={webProjects} basePath={basePath} />
    </Frame>
  );
}
