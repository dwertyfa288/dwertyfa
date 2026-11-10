import Frame from "./Frame";
import styles from "./SectionDivider.module.css";

type Props = {
  number: string;
  title: string;
  text: string;
  count: string;
};

export default function SectionDivider({ number, title, text, count }: Props) {
  return (
    <Frame label={`раздел ${number}`} meta={<span className={styles.count}>{count}</span>} className={styles.divider}>
      <div className={styles.body} data-reveal>
        <span className={styles.number}>{number}</span>
        <div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.text}>{text}</p>
        </div>
        <span className={`mono ${styles.hint}`}>
          листай <span aria-hidden="true">↓</span>
        </span>
      </div>
    </Frame>
  );
}
