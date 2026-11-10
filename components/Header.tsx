import LocalClock from "./LocalClock";
import styles from "./Header.module.css";

const navItems = [
  ["#work", "01 веб"],
  ["#products", "02 продукты"],
  ["#skills", "03 стек"],
  ["#contact", "04 связь"],
] as const;

export default function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.logo} href="#top" aria-label="dwertyfa — наверх">
        dwertyfa<span className="signal">.</span>
      </a>
      <nav className={styles.nav} aria-label="Навигация">
        {navItems.map(([href, label]) => (
          <a key={href} href={href} className="mono">
            {label}
          </a>
        ))}
      </nav>
      <LocalClock className={`mono ${styles.clock}`} />
    </header>
  );
}
