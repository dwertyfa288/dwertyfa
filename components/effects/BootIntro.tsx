import styles from "./BootIntro.module.css";

const lines = [
  ["init", "dwertyfa.portfolio"],
  ["load", "3d · globe · field · stack · plane"],
  ["link", "telegram · github · sphereprime"],
  ["ready", "rev. 11.2026"],
];

export default function BootIntro() {
  return (
    <div className={styles.boot} aria-hidden="true">
      <div className={styles.panel}>
        <span className={styles.logo}>
          dwertyfa<span className="signal">.</span>
        </span>
        <ol className={styles.lines}>
          {lines.map(([key, value], index) => (
            <li key={key} style={{ "--i": index } as React.CSSProperties}>
              <span className="signal">{key}</span> {value}
              <span className={styles.ok}>ok</span>
            </li>
          ))}
        </ol>
        <span className={styles.progress}>
          <i />
        </span>
      </div>
    </div>
  );
}
