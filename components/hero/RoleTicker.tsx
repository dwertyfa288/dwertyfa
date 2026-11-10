import { roles } from "@/lib/data/hero";
import styles from "./Hero.module.css";

export default function RoleTicker() {
  const items = [...roles, roles[0]];
  return (
    <div className={styles.column}>
      <span className="mono">01 / делаю</span>
      <p className={styles.muted}>Проектирую и собираю</p>
      <div className={styles.ticker}>
        <ul className={styles.tickerTrack} aria-label={roles.join(", ")}>
          {items.map((role, index) => (
            <li key={`${role}-${index}`} aria-hidden={index === items.length - 1 || undefined}>
              {role}
            </li>
          ))}
        </ul>
      </div>
      <p className={styles.muted}>
        Интерфейс, бэкенд, деплой — одними руками и без потерь между этапами.
      </p>
    </div>
  );
}
