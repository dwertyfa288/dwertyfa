import Arrow from "./Arrow";
import Frame, { CropMarks } from "./Frame";
import TerminalMock from "./TerminalMock";
import { products } from "@/lib/data/products";
import styles from "./Products.module.css";

export default function Products() {
  return (
    <Frame
      id="products"
      label="02 — продукты / sphereprime · voice · mcp"
      meta={`${String(products.length).padStart(2, "0")} репозиториев`}
      grid={false}
      className={styles.products}
    >
      <ul className={styles.grid}>
        {products.map((product, index) => (
          <li
            key={product.name}
            className={product.size ? styles[product.size] : undefined}
            data-reveal
            style={{ "--delay": `${(index % 3) * 0.08}s` } as React.CSSProperties}
          >
            <a className={styles.card} href={product.href} target="_blank" rel="noreferrer">
              <CropMarks />
              <div className={styles.cardHead}>
                <span className="mono">
                  <span className="signal">{String(index + 1).padStart(2, "0")}</span> — {product.group}
                </span>
                <span className={`mono ${styles.lang}`}>{product.stack[0]}</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.copy}>
                  <h3 className={styles.name}>{product.name}</h3>
                  <p className={styles.description}>{product.description}</p>
                  <ul className={styles.stack}>
                    {product.stack.map((item) => (
                      <li key={item} className="mono">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {product.size === "feature" && <TerminalMock />}
              </div>
              <div className={styles.cardFoot}>
                <span className="mono">fig. {String(index + 3).padStart(2, "0")}</span>
                <Arrow className={styles.arrow} />
              </div>
            </a>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
