import styles from "./TerminalMock.module.css";

const lines = [
  { kind: "prompt", text: "собери API заказов и задеплой на сервер" },
  { kind: "step", text: "план · 4 шага" },
  { kind: "tool", text: "lsp  · go/handlers/orders.go" },
  { kind: "tool", text: "mcp  · ssh deploy@prod" },
  { kind: "done", text: "готово · 12 файлов · тесты ✓" },
];

export default function TerminalMock() {
  return (
    <div className={styles.terminal} aria-hidden="true">
      <div className={styles.bar}>
        <span>prime — ~/project</span>
        <span className="signal">claude-opus</span>
      </div>
      <ol className={styles.body}>
        {lines.map((line, index) => (
          <li key={line.text} className={styles[line.kind]} style={{ "--line": index } as React.CSSProperties}>
            {line.text}
          </li>
        ))}
      </ol>
    </div>
  );
}
