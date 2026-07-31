"use client";

import {
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from "react";
import DeveloperScene from "./DeveloperScene";

const stack = [
  "REACT",
  "TYPESCRIPT",
  "NEXT.JS",
  "NODE.JS",
  "API",
  "LINUX",
  "NGINX",
  "POSTGRESQL",
  "DOCKER",
  "CI/CD",
];

const expertise = [
  {
    number: "01",
    title: "Продуктовая разработка",
    text: "Перевожу идею в работающий интерфейс: архитектура, UX, адаптив, интеграции и аккуратный production-код.",
    meta: "FRONTEND / BACKEND / UX",
  },
  {
    number: "02",
    title: "Инфраструктура",
    text: "Проектирую окружение, деплой и сетевой слой так, чтобы продукт оставался быстрым, наблюдаемым и управляемым.",
    meta: "LINUX / DOCKER / NGINX",
  },
  {
    number: "03",
    title: "Сложные интеграции",
    text: "Связываю авторизацию, платежи, API, ботов и внешние сервисы в один понятный пользовательский сценарий.",
    meta: "API / AUTH / PAYMENTS",
  },
];

function ProjectArrow() {
  return (
    <span className="project-arrow" aria-hidden="true">
      ↗
    </span>
  );
}

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const onPointerMove = (event: PointerEvent) => {
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const items = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return () => window.removeEventListener("pointermove", onPointerMove);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    items.forEach((item) => observer.observe(item));

    return () => {
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  const handleTilt = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const card = event.currentTarget;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    card.style.setProperty("--tilt-x", `${y * -3.5}deg`);
    card.style.setProperty("--tilt-y", `${x * 4.5}deg`);
    card.style.setProperty("--glow-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--glow-y", `${(y + 0.5) * 100}%`);
  };

  const resetTilt = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty("--tilt-x", "0deg");
    event.currentTarget.style.setProperty("--tilt-y", "0deg");
  };

  return (
    <main className="portfolio">
      <div className="ambient-grid" aria-hidden="true" />
      <div className="cursor-light" aria-hidden="true" />

      <header className="site-header">
        <a className="monogram" href="#top" aria-label="Наверх">
          D<span>/</span>W
        </a>
        <nav className="site-nav" aria-label="Основная навигация">
          <a href="#work">Работы</a>
          <a href="#expertise">Экспертиза</a>
          <a href="#contact">Контакт</a>
        </nav>
        <div className="availability">
          <span aria-hidden="true" />
          открыт к проектам
        </div>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <div className="hero-copy">
          <div className="hero-kicker">
            <span>FULL-STACK DEVELOPER</span>
            <span>КРАСНОЯРСК / REMOTE</span>
          </div>

          <h1 aria-label="Проектирую цифровые системы">
            <span className="hero-line hero-line--one">Проектирую</span>
            <span className="hero-line hero-line--two">
              цифровые <i>системы</i>
            </span>
          </h1>

          <div className="hero-bottom">
            <p>
              Разрабатываю продукты целиком — от инфраструктуры и серверной
              логики до интерфейса, который хочется исследовать.
            </p>
            <div className="hero-actions">
              <a className="button button--primary" href="#work">
                Смотреть проекты
                <span aria-hidden="true">↓</span>
              </a>
              <a
                className="text-link"
                href="https://github.com/RoxyBoost"
                target="_blank"
                rel="noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </div>

        <aside className="hero-visual" aria-label="Интерактивная 3D-система">
          <DeveloperScene variant="hero" />
          <div className="scene-chrome scene-chrome--top">
            <span>REALTIME OBJECT</span>
            <strong>
              <i aria-hidden="true" />
              ONLINE
            </strong>
          </div>
          <div className="scene-chrome scene-chrome--left" aria-hidden="true">
            <span>01</span>
            <span>02</span>
            <span>03</span>
          </div>
          <div className="scene-chrome scene-chrome--bottom">
            <div>
              <span>CORE</span>
              <strong>FULL-STACK</strong>
            </div>
            <div>
              <span>INPUT</span>
              <strong>POINTER / LIVE</strong>
            </div>
          </div>
          <div className="scene-hint">ДВИГАЙТЕ КУРСОРОМ</div>
        </aside>

        <div className="scroll-note" aria-hidden="true">
          <span />
          SCROLL TO EXPLORE
        </div>
      </section>

      <div className="stack-marquee" aria-label={`Технологии: ${stack.join(", ")}`}>
        <div className="marquee-track" aria-hidden="true">
          {[...stack, ...stack, ...stack, ...stack].map((item, index) => (
            <span key={`${item}-${index}`}>
              {item}
              <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      <section className="statement section-pad">
        <div className="section-label" data-reveal>
          <span>00</span>
          ОБО МНЕ
        </div>
        <div className="statement-grid">
          <h2 data-reveal>
            Не просто пишу код.
            <br />
            <em>Собираю продукт.</em>
          </h2>
          <div className="statement-copy" data-reveal>
            <p>
              Мне важно видеть всю систему: как пользователь встречает продукт,
              что происходит за интерфейсом и насколько спокойно он живёт после
              релиза.
            </p>
            <p className="statement-note">
              Архитектура · разработка · запуск · развитие
            </p>
          </div>
        </div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-heading" data-reveal>
          <div className="section-label">
            <span>01</span>
            ИЗБРАННЫЕ РАБОТЫ
          </div>
          <p>
            Это лишь небольшая часть моих проектов. Три разных масштаба — один
            внимательный подход.
          </p>
        </div>

        <div className="project-grid">
          <div className="project-shell project-shell--wide" data-reveal>
            <a
              className="project-card project-card--roxy"
              href="https://roxyvpn.ru/"
              target="_blank"
              rel="noreferrer"
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
            >
              <div className="card-glow" aria-hidden="true" />
              <div className="project-topline">
                <span>01 / PRODUCT & INFRASTRUCTURE</span>
                <ProjectArrow />
              </div>
              <div className="project-art roxy-art" aria-hidden="true">
                <div className="roxy-panel">
                  <div className="roxy-panel-head">
                    <span>SECURE TUNNEL</span>
                    <i />
                  </div>
                  <div className="roxy-map">
                    <span className="map-line map-line--one" />
                    <span className="map-line map-line--two" />
                    <i className="map-node map-node--one" />
                    <i className="map-node map-node--two" />
                    <i className="map-node map-node--three" />
                    <b>10 ms</b>
                  </div>
                  <div className="roxy-status">
                    <span>GERMANY / FRA</span>
                    <strong>CONNECTED</strong>
                  </div>
                </div>
              </div>
              <div className="project-copy">
                <div>
                  <p className="project-role">END-TO-END РАЗРАБОТКА</p>
                  <h3>Roxy Boost</h3>
                </div>
                <p>
                  VPN-продукт, где я отвечал за весь технологический контур:
                  инфраструктуру, приложение, backend и пользовательский сайт.
                </p>
              </div>
              <div className="tag-row">
                <span>Infrastructure</span>
                <span>Backend</span>
                <span>Web app</span>
                <span>Product</span>
              </div>
            </a>
          </div>

          <div className="project-shell" data-reveal>
            <a
              className="project-card project-card--montage"
              href="https://fazedanek-hub.github.io/danekmontage/"
              target="_blank"
              rel="noreferrer"
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
            >
              <div className="card-glow" aria-hidden="true" />
              <div className="project-topline">
                <span>02 / CREATIVE DEVELOPMENT</span>
                <ProjectArrow />
              </div>
              <div className="project-art montage-art" aria-hidden="true">
                <div className="film-word">MOTION</div>
                <div className="film-frame film-frame--one">
                  <span>PLAY</span>
                </div>
                <div className="film-frame film-frame--two" />
                <div className="film-timeline">
                  <i />
                  <span />
                  <b />
                </div>
              </div>
              <div className="project-copy">
                <div>
                  <p className="project-role">САЙТ-ПОРТФОЛИО</p>
                  <h3>danek montage</h3>
                </div>
                <p>
                  Динамичная витрина видеомонтажа для блогеров и брендов с
                  акцентом на темп, движение и сильную подачу работ.
                </p>
              </div>
              <div className="tag-row">
                <span>React</span>
                <span>Motion UI</span>
                <span>Responsive</span>
              </div>
            </a>
          </div>

          <div className="project-shell" data-reveal>
            <a
              className="project-card project-card--ksusha"
              href="https://heyksusha.ru/intensive"
              target="_blank"
              rel="noreferrer"
              onPointerMove={handleTilt}
              onPointerLeave={resetTilt}
            >
              <div className="card-glow" aria-hidden="true" />
              <div className="project-topline">
                <span>03 / LANDING & COMMERCE</span>
                <ProjectArrow />
              </div>
              <div className="project-art ksusha-art" aria-hidden="true">
                <span className="ksusha-star">✦</span>
                <div className="ksusha-arch">
                  <span>HEY</span>
                  <strong>Ksusha</strong>
                  <i>INTENSIVE</i>
                </div>
                <span className="ksusha-caption">01 — 06</span>
              </div>
              <div className="project-copy">
                <div>
                  <p className="project-role">ПРОМО-САЙТ</p>
                  <h3>Hey Ksusha</h3>
                </div>
                <p>
                  Эмоциональный лендинг интенсива: премиальная визуальная
                  система, сценарий продажи, форма и платёжная интеграция.
                </p>
              </div>
              <div className="tag-row">
                <span>Art direction</span>
                <span>Landing</span>
                <span>Payments</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="expertise section-pad" id="expertise">
        <div className="section-heading section-heading--light" data-reveal>
          <div className="section-label">
            <span>02</span>
            ЧТО Я ДЕЛАЮ
          </div>
          <p>Разбираюсь в деталях, не теряя из виду целое.</p>
        </div>

        <div className="expertise-list">
          {expertise.map((item) => (
            <article className="expertise-row" key={item.number} data-reveal>
              <span className="expertise-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <span className="expertise-meta">{item.meta}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="depth section-pad">
        <div className="depth-copy" data-reveal>
          <div className="section-label section-label--light">
            <span>03</span>
            ENGINEERING IN DEPTH
          </div>
          <h2>
            Вижу продукт
            <br />
            <em>в объёме.</em>
          </h2>
          <p>
            Интерфейс — только видимая плоскость. За ним живут сервисы, данные,
            сеть и инфраструктура. Я проектирую их как связанную систему.
          </p>
          <div className="depth-metrics">
            <div>
              <strong>01</strong>
              <span>единая архитектура</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>пространство роста</span>
            </div>
          </div>
        </div>
        <div className="depth-visual" data-reveal>
          <DeveloperScene variant="systems" />
          <div className="depth-frame" aria-hidden="true">
            <span className="frame-corner frame-corner--tl" />
            <span className="frame-corner frame-corner--tr" />
            <span className="frame-corner frame-corner--bl" />
            <span className="frame-corner frame-corner--br" />
          </div>
          <div className="depth-status">
            <span>ARCHITECTURE MAP</span>
            <span>18 NODES / ACTIVE</span>
          </div>
        </div>
      </section>

      <section className="process section-pad">
        <div className="section-label" data-reveal>
          <span>04</span>
          КАК Я РАБОТАЮ
        </div>
        <div className="process-grid">
          <div className="process-intro" data-reveal>
            <h2>
              Из хаоса
              <br />в <em>систему.</em>
            </h2>
            <p>
              Прозрачный процесс помогает двигаться быстро и не терять качество
              на поворотах.
            </p>
          </div>
          <ol className="process-steps">
            {[
              ["Погружение", "Задача, контекст, ограничения"],
              ["Архитектура", "Сценарии, данные, технологии"],
              ["Разработка", "Итерации и рабочий результат"],
              ["Запуск", "Деплой, проверка, развитие"],
            ].map(([title, text], index) => (
              <li key={title} data-reveal>
                <span>0{index + 1}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="site-footer section-pad" id="contact">
        <div className="footer-orbit" aria-hidden="true">
          <span>LET&apos;S BUILD · LET&apos;S BUILD · </span>
        </div>
        <div className="footer-kicker" data-reveal>
          ЕСТЬ ИДЕЯ ИЛИ ЗАДАЧА?
        </div>
        <h2 data-reveal>
          Давайте сделаем
          <br />
          <em>что-то сильное.</em>
        </h2>
        <a
          className="footer-link"
          href="https://github.com/RoxyBoost"
          target="_blank"
          rel="noreferrer"
          data-reveal
        >
          Открыть GitHub
          <span aria-hidden="true">↗</span>
        </a>
        <div className="footer-bottom">
          <span>© 2026 DWERTYFA</span>
          <span>DESIGN × CODE × SYSTEMS</span>
          <a href="#top">НАВЕРХ ↑</a>
        </div>
      </footer>
    </main>
  );
}
