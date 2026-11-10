import ScrambleText from "../effects/ScrambleText";
import Frame, { CropMarks } from "../Frame";
import Scene from "../Scene";
import RoleTicker from "./RoleTicker";
import SignalScope from "./SignalScope";
import StackPicker from "./StackPicker";
import Tape from "./Tape";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <Frame
      id="top"
      label="dwertyfa288 / portfolio"
      meta={
        <>
          full-stack · voice · integrations — <span className="signal">rev. 11.2026</span>
        </>
      }
      className={styles.hero}
    >
      <div className={styles.top}>
        <div className={styles.intro}>
          <h1 className={styles.name}>
            <span className={styles.nameLine}>
              <ScrambleText text="dwertyfa" delay={1750} />
              <span className="signal">.</span>
            </span>
          </h1>
          <p className={styles.lead}>Сайты, голосовые интерфейсы и интеграции — от идеи до продукта.</p>
          <div className={styles.actions}>
            <a className={styles.primary} href="#work" data-magnetic>
              Смотреть работы <span aria-hidden="true">↓</span>
            </a>
            <a className={`mono ${styles.secondary}`} href="#contact">
              написать →
            </a>
          </div>
        </div>
        <figure className={styles.figure}>
          <CropMarks />
          <Scene name="globe" className={styles.globe} />
          <figcaption className={`mono ${styles.caption}`}>
            <span>fig. 01 — сеть</span>
            <span className="signal">● 14 узлов online</span>
          </figcaption>
        </figure>
      </div>

      <div className={styles.rule} aria-hidden="true" />

      <div className={styles.columns}>
        <RoleTicker />
        <StackPicker />
        <SignalScope />
      </div>

      <Tape />
    </Frame>
  );
}
