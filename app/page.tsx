import DeveloperScene from "./DeveloperScene";
import PortfolioMotion from "./PortfolioMotion";
import ProjectGallery from "./ProjectGallery";

const telegram = "https://t.me/dwertyfa";
const github = "https://github.com/RoxyBoost";
const basePath = process.env.BASE_PATH ?? "";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg
      className={`arrow${down ? " arrow--down" : ""}`}
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 19 19 5M5 5h14v14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default function Home() {
  return (
    <>
      <PortfolioMotion />
      <a className="skip-link" href="#work">
        К проектам
      </a>
      <div className="reading-progress" aria-hidden="true" />
      <div className="cosmic-dust" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="dwertyfa — наверх">
          <span className="brand-symbol" aria-hidden="true">
            d.
          </span>
          dwertyfa<span className="wordmark-reg">®</span>
        </a>
        <nav aria-label="Основная навигация">
          <a href="#work">
            Проекты <span>04</span>
          </a>
          <a href="#about">Обо мне</a>
          <a href="#contact">
            Контакт <Arrow />
          </a>
        </nav>
        <a
          className="availability"
          href={telegram}
          target="_blank"
          rel="noreferrer"
        >
          <i /> ОТКРЫТ К ПРОЕКТАМ
        </a>
      </header>
      <main>
        <section
          className="cosmos-hero"
          id="top"
          aria-labelledby="hero-heading"
        >
          <div className="hero-nebula" aria-hidden="true" />
          <div className="hero-scene">
            <DeveloperScene variant="hero" />
          </div>
          <div className="hero-eyebrow">
            <span className="tiny-star" aria-hidden="true">
              ✦
            </span>{" "}
            FULL-STACK DEVELOPER <span className="eyebrow-divider" /> CREATIVE
            MIND
          </div>
          <div className="hero-title-wrap">
            <span className="hero-pretitle">
              Идеям нужно больше пространства.
            </span>
            <h1 id="hero-heading">
              <span>Разработка</span>
              <span>
                в другом <em>измерении.</em>
              </span>
            </h1>
          </div>
          <div className="hero-orbit-label" aria-hidden="true">
            <span>↗</span> ЗА ПРЕДЕЛАМИ
            <br />
            ОБЫЧНОГО
          </div>
          <div className="hero-bottom">
            <p>
              Я dwertyfa. Создаю сайты и цифровые продукты,
              <br className="wide-only" /> в которых инженерия встречается с
              воображением.
            </p>
            <a className="pill pill--peach" href="#work" data-magnetic>
              Войти в мою вселенную{" "}
              <span>
                <Arrow down />
              </span>
            </a>
          </div>
          <div className="hero-footnote">
            <a href="#work">
              <span className="scroll-orbit" aria-hidden="true">
                ↓
              </span>{" "}
              ПРОКРУТИТЕ И ПОЧУВСТВУЙТЕ
            </a>
            <span>КРАСНОЯРСК / РАБОТАЮ ПО ВСЕМУ МИРУ</span>
            <span>© 2026</span>
          </div>
        </section>
        <div className="manifesto" data-reveal>
          <span>ДИЗАЙН СОЗДАЁТ ЧУВСТВО.</span>
          <span className="manifesto-star" aria-hidden="true">
            ✦
          </span>
          <span>КОД ДАЁТ ЕМУ ЖИЗНЬ.</span>
          <span className="manifesto-star" aria-hidden="true">
            ✦
          </span>
        </div>
        <ProjectGallery basePath={basePath} />
        <section
          className="about-section page-width"
          id="about"
          aria-labelledby="about-heading"
        >
          <div className="section-label" data-reveal>
            <span className="label-dot" /> 02 / ЧЕЛОВЕК ЗА КОДОМ
          </div>
          <div className="about-intro">
            <h2 id="about-heading" data-reveal>
              Любопытство —<br />
              мой <em>двигатель.</em>
            </h2>
            <div data-reveal>
              <span className="about-marker" aria-hidden="true">
                ↳
              </span>
              <p>
                Мне интересно, что получится на стыке технологий и визуального
                мышления. Поэтому я собираю продукт целиком: от серверов и
                данных до движения последнего пикселя.
              </p>
              <p>
                Красивый интерфейс, надёжная основа и ощущение, что всё на своём
                месте.
              </p>
            </div>
          </div>
          <div className="capabilities">
            <article className="capability" data-reveal>
              <div className="capability-top">
                <span>01 / ВНЕШНИЙ МИР</span>
                <span>↗</span>
              </div>
              <div className="capability-scene">
                <DeveloperScene variant="interface" />
              </div>
              <h3>
                Видеть.
                <br />
                <em>Чувствовать.</em>
              </h3>
              <p>
                Сайты и приложения с характером. Продумываю сценарии, адаптив и
                анимации, которые делают интерфейс живым.
              </p>
              <div className="capability-tags">
                <span>React</span>
                <span>Next.js</span>
                <span>TypeScript</span>
              </div>
            </article>
            <article className="capability" data-reveal>
              <div className="capability-top">
                <span>02 / ВНУТРЕННИЙ МИР</span>
                <span>⌘</span>
              </div>
              <div className="capability-scene">
                <DeveloperScene variant="systems" />
              </div>
              <h3>
                Работать.
                <br />
                <em>Выдерживать.</em>
              </h3>
              <p>
                Архитектура, серверная логика и инфраструктура. Всё, на что
                опирается продукт, когда им начинают пользоваться.
              </p>
              <div className="capability-tags">
                <span>Node.js</span>
                <span>PostgreSQL</span>
                <span>Docker</span>
              </div>
            </article>
            <article className="capability" data-reveal>
              <div className="capability-top">
                <span>03 / ТОЧКИ СОПРИКОСНОВЕНИЯ</span>
                <span>↔</span>
              </div>
              <div className="capability-scene">
                <DeveloperScene variant="connections" />
              </div>
              <h3>
                Соединять.
                <br />
                <em>Упрощать.</em>
              </h3>
              <p>
                API, платежи, авторизация и боты. Связываю сервисы в понятный
                путь, в котором сложность остаётся за кадром.
              </p>
              <div className="capability-tags">
                <span>API</span>
                <span>Payments</span>
                <span>Automation</span>
              </div>
            </article>
          </div>
        </section>
        <section
          className="process-section page-width"
          aria-labelledby="process-heading"
        >
          <div className="section-label" data-reveal>
            <span className="label-dot" /> 03 / ТРАЕКТОРИЯ ПРОЕКТА
          </div>
          <div className="process-intro" data-reveal>
            <h2 id="process-heading">
              От «а что, если»
              <br />
              <em>до «уже работает».</em>
            </h2>
            <p>
              Прозрачный процесс.
              <br />
              Живой результат на каждом этапе.
            </p>
          </div>
          <ol className="process-track">
            {[
              [
                "Погружение",
                "Разбираемся в задаче, людях и контексте. Находим то, что действительно важно.",
              ],
              [
                "Концепция",
                "Собираю структуру, визуальный язык и архитектуру будущего продукта.",
              ],
              [
                "Разработка",
                "Превращаю идею в работающий продукт. Показываю, проверяю, дорабатываю.",
              ],
              [
                "Запуск",
                "Публикую, проверяю в реальных условиях и помогаю развивать дальше.",
              ],
            ].map(([title, description], index) => (
              <li key={title} data-reveal>
                <span className="process-point">
                  <span>0{index + 1}</span>
                  <i />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="contact-section" id="contact">
        <div className="contact-portal">
          <DeveloperScene variant="portal" />
        </div>
        <div className="contact-content page-width">
          <div className="section-label" data-reveal>
            <span className="label-dot" /> СЛЕДУЮЩАЯ ОРБИТА — ВАША
          </div>
          <h2 data-reveal>
            Есть идея?
            <br />
            <em>Дадим ей форму.</em>
          </h2>
          <p data-reveal>Самые интересные проекты начинаются с разговора.</p>
          <a
            className="pill pill--peach"
            href={telegram}
            target="_blank"
            rel="noreferrer"
            data-magnetic
          >
            Привет, dwertyfa{" "}
            <span>
              <Arrow />
            </span>
          </a>
          <div className="contact-direct" data-reveal>
            <a href={telegram} target="_blank" rel="noreferrer">
              Telegram <Arrow />
            </a>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub <Arrow />
            </a>
          </div>
        </div>
        <div className="footer-line page-width">
          <a className="wordmark" href="#top">
            dwertyfa<span className="wordmark-reg">®</span>
          </a>
          <span>СОБРАНО ИЗ КОДА И ЛЮБОПЫТСТВА · 2026</span>
          <a href="#top">Вернуться на Землю ↑</a>
        </div>
      </footer>
    </>
  );
}
