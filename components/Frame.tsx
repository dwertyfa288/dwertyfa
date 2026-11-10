import styles from "./Frame.module.css";

type Props = {
  label: string;
  meta?: React.ReactNode;
  fig?: string;
  id?: string;
  className?: string;
  grid?: boolean;
  children: React.ReactNode;
};

export function CropMarks({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.marks} ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

export default function Frame({ label, meta, fig, id, className = "", grid = true, children }: Props) {
  const [head, ...rest] = label.split(" / ");
  return (
    <section id={id} className={`${styles.frame} ${grid ? styles.grid : ""} ${className}`}>
      <CropMarks />
      <header className={styles.head}>
        <span className="mono">
          <span className={styles.labelHead}>{head}</span>
          {rest.length > 0 && <span> / {rest.join(" / ")}</span>}
        </span>
        {meta && <span className={`mono ${styles.meta}`}>{meta}</span>}
      </header>
      {children}
      {fig && <span className={`mono ${styles.fig}`}>{fig}</span>}
    </section>
  );
}
