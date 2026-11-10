import { signalCommand } from "@/lib/data/hero";
import { buildWavePath } from "@/lib/wavePath";
import styles from "./Hero.module.css";

const WAVE_WIDTH = 320;
const wave = buildWavePath(WAVE_WIDTH, 26);

export default function SignalScope() {
  return (
    <div className={styles.column}>
      <div className={styles.scopeHead}>
        <span className="mono">03 / сигнал</span>
        <span className="mono signal">voice in</span>
      </div>
      <div className={styles.scope}>
        <svg viewBox={`0 -42 ${WAVE_WIDTH} 84`} preserveAspectRatio="none" aria-hidden="true">
          <line x1="0" y1="0" x2={WAVE_WIDTH} y2="0" className={styles.scopeAxis} />
          <g className={styles.scopeWave}>
            <path d={wave} />
            <path d={wave} transform={`translate(${WAVE_WIDTH} 0)`} />
          </g>
        </svg>
      </div>
      <code className={styles.command} style={{ "--chars": signalCommand.length } as React.CSSProperties}>
        <span>{signalCommand}</span>
      </code>
    </div>
  );
}
