import Arrow from "./Arrow";
import ScrambleText from "./effects/ScrambleText";
import Frame, { CropMarks } from "./Frame";
import Scene from "./Scene";
import { links } from "@/lib/data/links";
import styles from "./Contact.module.css";

const basePath = process.env.BASE_PATH ?? "";

export default function Contact() {
  return (
    <footer className={styles.footer}>
      <Frame id="contact" label="04 — связь / telegram" meta="ответ в течение дня">
        <div className={styles.layout}>
          <div className={styles.copy}>
            <h2 className={styles.title} data-reveal>
              <ScrambleText text="Есть идея?" />
              <br />
              <span className={styles.titleMuted}>
                Соберём из неё живой продукт<span className="signal">.</span>
              </span>
            </h2>
            <div className={styles.actions} data-reveal>
              <a className={styles.cta} href={links.telegram} target="_blank" rel="noreferrer">
                Написать в Telegram <Arrow />
              </a>
              <span className={`mono ${styles.handle}`}>{links.telegramHandle}</span>
            </div>
            <figure className={styles.portrait} data-reveal>
              <CropMarks />
              <div className={styles.photo}>
                <img src={`${basePath}/avatar.png`} alt="dwertyfa" loading="lazy" decoding="async" />
                <span className={styles.scan} aria-hidden="true" />
              </div>
              <figcaption className="mono">fig. 00 — автор</figcaption>
            </figure>
          </div>
          <figure className={styles.figure}>
            <CropMarks />
            <Scene name="plane" className={styles.scene} />
            <figcaption className={`mono ${styles.caption}`}>
              <span>fig. 12 — отправка</span>
              <span className="signal">● сообщение в пути</span>
            </figcaption>
          </figure>
        </div>
      </Frame>
      <div className={`mono ${styles.bottom}`}>
        <span>© 2026 dwertyfa</span>
        <nav className={styles.links} aria-label="Ссылки">
          <a href={links.telegram} target="_blank" rel="noreferrer">
            telegram
          </a>
          <a href={links.github} target="_blank" rel="noreferrer">
            github
          </a>
          <a href={links.sphere} target="_blank" rel="noreferrer">
            sphereprime
          </a>
        </nav>
        <a href="#top">наверх ↑</a>
      </div>
    </footer>
  );
}
