import Arrow from "./Arrow";
import { CropMarks } from "./Frame";
import { links } from "@/lib/data/links";
import styles from "./LinkCards.module.css";

const cards = [
  { name: "Telegram", note: links.telegramHandle, href: links.telegram },
  { name: "GitHub", note: "github.com/dwertyfa288", href: links.github },
  { name: "SpherePrime", note: "github.com/SpherePrime", href: links.sphere },
];

export default function LinkCards() {
  return (
    <ul className={styles.row}>
      {cards.map((card, index) => (
        <li key={card.name} data-reveal style={{ "--delay": `${index * 0.08}s` } as React.CSSProperties}>
          <a className={styles.card} href={card.href} target="_blank" rel="noreferrer" data-spotlight>
            <CropMarks />
            <span className={`mono signal ${styles.index}`}>{String(index + 1).padStart(2, "0")}</span>
            <span className={styles.name}>{card.name}</span>
            <span className={`mono ${styles.note}`}>{card.note}</span>
            <Arrow className={styles.arrow} />
          </a>
        </li>
      ))}
    </ul>
  );
}
