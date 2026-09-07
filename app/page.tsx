import Image from "next/image";
import DeveloperScene from "./DeveloperScene";
import PortfolioMotion from "./PortfolioMotion";

const basePath = process.env.BASE_PATH ?? "";
const telegram = "https://t.me/dwertyfa";
const github = "https://github.com/RoxyBoost";
const projects = [
  {
    id: "nova",
    number: "01",
    name: "Nova Prestige",
    category: "НЕДВИЖИМОСТЬ · ПРОМО-САЙТ",
    href: "https://novaprestige.ru/",
    description:
      "Цифровое пространство для приватного жилого дома в центре Бишкека. Архитектура, атмосфера и внимание к каждой детали.",
    tags: ["Веб-разработка", "Адаптивный интерфейс", "Анимации"],
  },
  {
    id: "roxy",
    number: "02",
    name: "Roxy Boost",
    category: "VPN-СЕРВИС · FULL-STACK",
    href: "https://roxyvpn.ru/",
    description:
      "От серверной инфраструктуры до последнего экрана. VPN-продукт, который я разрабатывал как единую систему.",
    tags: ["Инфраструктура", "Backend", "Web app"],
  },
  {
    id: "montage",
    number: "03",
    name: "danek montage",
    category: "КРЕАТИВНОЕ ПОРТФОЛИО",
    href: "https://fazedanek-hub.github.io/danekmontage/",
    description:
      "Работы, которые говорят движением. Динамичное портфолио видеомонтажёра для блогеров и брендов.",
    tags: ["React", "Motion UI", "Веб-разработка"],
  },
  {
    id: "ksusha",
    number: "04",
    name: "Hey Ksusha",
    category: "ОБРАЗОВАНИЕ · ЛЕНДИНГ",
    href: "https://heyksusha.ru/intensive",
    description:
      "Выразительный сайт интенсива с продуманным сценарием: от первого впечатления до записи и оплаты.",
    tags: ["Арт-дирекшн", "Лендинг", "Платежи"],
  },
];
const services = [
  {
    number: "01",
    title: "Интерфейс, который",
    accent: "чувствуется.",
    description:
      "Разрабатываю сайты и приложения с характером. Продумываю логику, адаптив и движение — чтобы каждая деталь работала на впечатление.",
    tags: "REACT / NEXT.JS / TYPESCRIPT",
    icon: "↗",
  },
  {
    number: "02",
    title: "Система, на которую",
    accent: "можно положиться.",
    description:
      "За красивым интерфейсом — надёжная основа. Серверная логика, данные, инфраструктура и понятный процесс обновления продукта.",
    tags: "NODE.JS / POSTGRESQL / DOCKER",
    icon: "⌘",
  },
  {
    number: "03",
    title: "Сервисы, которые",
    accent: "работают вместе.",
    description:
      "Соединяю API, авторизацию, платежи и ботов в цельный пользовательский путь. Сложность остаётся внутри, удобство — снаружи.",
    tags: "API / PAYMENTS / AUTOMATION",
    icon: "↔",
  },
];
function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={diagonal ? "arrow-icon" : "arrow-icon arrow-icon--down"}
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
function ProjectVisual({ id }: { id: string }) {
  if (id === "nova")
    return (
      <>
        <Image
          className="nova-image"
          src={`${basePath}/projects/nova.webp`}
          alt="Вечерний фасад жилого дома Nova Prestige"
          fill
          sizes="(max-width: 760px) 100vw, 90vw"
          unoptimized
        />
        <div className="nova-shade" />
        <div className="visual-top">
          <span className="nova-logo">
            NOVA<span>PRESTIGE</span>
          </span>
          <span className="visual-pill">БИШКЕК, КЫРГЫЗСТАН</span>
        </div>
        <div className="nova-title">
          Искусство
          <br />
          <em>жить красиво.</em>
          <span>ПРИВАТНЫЙ ДОМ. ВСЕГО 56 КВАРТИР.</span>
        </div>
        <div className="nova-bottom">
          <span>АРХИТЕКТУРА ВАШЕЙ ЖИЗНИ</span>
          <span>novaprestige.ru ↗</span>
        </div>
      </>
    );
  if (id === "roxy")
    return (
      <>
        <div className="visual-top">
          <span className="roxy-logo">
            roxy<span>boost</span>
            <i>®</i>
          </span>
          <span className="visual-pill">СВОБОДА БЕЗ ГРАНИЦ</span>
        </div>
        <div className="roxy-orbit" aria-hidden="true" />
        <div className="roxy-title" aria-hidden="true">
          BEYOND
          <br />
          <span>LIMITS.</span>
        </div>
        <Image
          className="roxy-image"
          src={`${basePath}/projects/roxy.webp`}
          alt="Космонавт — визуальный образ Roxy Boost"
          width={700}
          height={700}
          sizes="(max-width: 760px) 80vw, 45vw"
          unoptimized
        />
        <div className="connection-badge">
          <span className="status-dot" /> СОЕДИНЕНИЕ ЗАЩИЩЕНО <span>↗</span>
        </div>
      </>
    );
  if (id === "montage")
    return (
      <>
        <div className="visual-top">
          <span className="montage-logo">
            danek<span>montage®</span>
          </span>
          <span className="visual-pill">CUT. CREATE. REPEAT.</span>
        </div>
        <div className="montage-type" aria-hidden="true">
          <span>MAKE IT</span>
          <span>
            <i>MOVE</i>
            <b>↗</b>
          </span>
        </div>
        <div className="montage-bottom">
          <span>
            <i /> REC
          </span>
          <span>КАЖДЫЙ КАДР ИМЕЕТ ЗНАЧЕНИЕ</span>
          <span>00:00:24</span>
        </div>
      </>
    );
  return (
    <>
      <Image
        className="ksusha-image"
        src={`${basePath}/projects/ksusha.webp`}
        alt="Фотография из проекта Hey Ksusha"
        fill
        sizes="(max-width: 760px) 100vw, 45vw"
        unoptimized
      />
      <div className="ksusha-shade" />
      <div className="visual-top">
        <span className="ksusha-logo">hey, ksusha</span>
        <span className="visual-pill">ОНЛАЙН-ИНТЕНСИВ</span>
      </div>
      <div className="ksusha-title">
        Начинается
        <br />
        <em>с тебя.</em>
      </div>
      <div className="ksusha-bottom">
        <span>ЗНАКОМСТВА. ОБЩЕНИЕ. ТЫ.</span>
        <span>✳</span>
      </div>
    </>
  );
}
export default function Home() {
  return (
    <>
      <PortfolioMotion />
      <a className="skip-link" href="#work">
        Перейти к проектам
      </a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-aura" aria-hidden="true" />
      <div className="project-cursor" aria-hidden="true">
        СМОТРЕТЬ
        <Arrow />
      </div>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="dwertyfa — наверх">
          dwertyfa
          <span className="brand-star" aria-hidden="true">
            ✳
          </span>
        </a>
        <nav className="site-nav" aria-label="Основная навигация">
          <a href="#work">
            Проекты <span>04</span>
          </a>
          <a href="#about">Подход</a>
          <a href="#contact">Контакт</a>
        </nav>
        <a
          className="header-contact"
          href={telegram}
          target="_blank"
          rel="noreferrer"
        >
          <span className="status-dot" /> ОБСУДИМ ПРОЕКТ <Arrow />
        </a>
      </header>
      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-topline">
            <span>
              <span className="status-dot" /> FULL-STACK DEVELOPER
            </span>
            <span>
              КРАСНОЯРСК <i>↔</i> ВЕСЬ МИР
            </span>
          </div>
          <div className="hero-scene">
            <DeveloperScene />
            <span className="scene-label">FORM FOLLOWS CURIOSITY — 001</span>
          </div>
          <div className="hero-content">
            <h1 id="hero-title">
              <span className="hero-line">
                <span>Код. Форма.</span>
              </span>
              <span className="hero-line">
                <span className="hero-accent">
                  Впечатление<span className="hero-period">.</span>
                </span>
              </span>
            </h1>
            <div className="hero-description">
              <span className="small-cross" aria-hidden="true">
                +
              </span>
              <p>
                Превращаю идеи в цифровой опыт.
                <br />
                От первой концепции до работающего продукта —
                <br className="desktop-break" /> с вниманием к тому, что вы
                видите и чувствуете.
              </p>
            </div>
            <div className="hero-actions">
              <a href="#work" className="button button--lime" data-magnetic>
                Смотреть проекты <Arrow diagonal={false} />
              </a>
              <a
                href={telegram}
                target="_blank"
                rel="noreferrer"
                className="hero-text-link"
              >
                Есть идея?{" "}
                <span>
                  Напишите мне <Arrow />
                </span>
              </a>
            </div>
          </div>
          <div className="hero-bottom">
            <a href="#work" className="scroll-cue">
              <span className="scroll-cue-line" /> ЛИСТАЙТЕ, ДАЛЬШЕ ИНТЕРЕСНЕЕ
            </a>
            <span className="hero-coordinate">
              DESIGN × CODE × A LITTLE MAGIC
            </span>
            <span className="hero-index">© 2026</span>
          </div>
        </section>
        <div
          className="marquee"
          aria-label="Дизайн, разработка, анимация, инфраструктура"
        >
          <div className="marquee-track" aria-hidden="true">
            {[0, 1, 2, 3].map((index) => (
              <span className="marquee-group" key={index}>
                CREATIVE DEVELOPMENT <i>✳</i> THOUGHTFUL DESIGN <i>✳</i>{" "}
                DIGITAL EXPERIENCES <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
        <section
          className="work section-wrap"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-eyebrow" data-reveal>
            <span>[ 01 — ИЗБРАННЫЕ ПРОЕКТЫ ]</span>
            <span>НЕ ВСЁ. ТОЛЬКО САМОЕ ИНТЕРЕСНОЕ.</span>
          </div>
          <div className="section-intro" data-reveal>
            <h2 id="work-title">
              Меньше слов.
              <br />
              <span className="muted">Больше дела.</span>
              <sup>(04)</sup>
            </h2>
            <p>
              Разные задачи. Разный характер.
              <br />
              Один подход — доводить до результата.
            </p>
          </div>
          <div className="projects-grid">
            {projects.map((project) => (
              <article
                className={`project project--${project.id}`}
                key={project.id}
                data-reveal
              >
                <a
                  className={`project-visual project-visual--${project.id}`}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Открыть проект ${project.name} в новой вкладке`}
                  data-project
                >
                  <div className="project-visual-inner">
                    <ProjectVisual id={project.id} />
                  </div>
                  <span className="project-open">
                    <Arrow />
                  </span>
                </a>
                <div className="project-details">
                  <div>
                    <span className="project-category">
                      {project.number} / {project.category}
                    </span>
                    <h3>
                      <a href={project.href} target="_blank" rel="noreferrer">
                        {project.name}
                        <Arrow />
                      </a>
                    </h3>
                  </div>
                  <p>{project.description}</p>
                </div>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <div className="work-outro" data-reveal>
            <span>Люблю задачи, которых ещё не было.</span>
            <a href={telegram} target="_blank" rel="noreferrer">
              Ваш проект может быть следующим <Arrow />
            </a>
          </div>
        </section>
        <section
          className="about section-wrap"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="section-eyebrow" data-reveal>
            <span>[ 02 — ЗА ИНТЕРФЕЙСОМ ]</span>
            <span>ЧУТЬ БОЛЬШЕ ОБО МНЕ</span>
          </div>
          <div className="about-grid">
            <div className="about-side" data-reveal>
              <span className="about-asterisk" aria-hidden="true">
                ✳
              </span>
              <span>
                Думаю как дизайнер.
                <br />
                Собираю как инженер.
              </span>
            </div>
            <div className="about-copy">
              <h2 id="about-title" data-reveal>
                Хороший продукт
                <br />
                не заканчивается
                <br />
                на <em>красивом экране.</em>
              </h2>
              <div className="about-body" data-reveal>
                <p>
                  Я dwertyfa, full-stack разработчик. Мне интересно всё, что
                  превращает идею в живой продукт: как он выглядит, как работает
                  и что ощущает человек по ту сторону экрана.
                </p>
                <p>
                  Поэтому я погружаюсь целиком — от архитектуры и серверов до
                  типографики, плавности анимаций и той самой кнопки.
                </p>
              </div>
            </div>
          </div>
          <div className="services">
            {services.map((service) => (
              <article className="service" key={service.number} data-reveal>
                <span className="service-number">/ {service.number}</span>
                <span className="service-icon" aria-hidden="true">
                  {service.icon}
                </span>
                <h3>
                  {service.title}
                  <br />
                  <span>{service.accent}</span>
                </h3>
                <p>{service.description}</p>
                <span className="service-stack">{service.tags}</span>
              </article>
            ))}
          </div>
          <div className="tech-line" data-reveal>
            <span>ИНСТРУМЕНТЫ МЕНЯЮТСЯ. ПОДХОД ОСТАЁТСЯ.</span>
            <div>
              {[
                "React",
                "TypeScript",
                "Next.js",
                "Node.js",
                "PostgreSQL",
                "Docker",
                "Linux",
                "Nginx",
              ].map((tech) => (
                <span key={tech}>{tech}</span>
              ))}
            </div>
          </div>
        </section>
        <section
          className="process section-wrap"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="process-heading" data-reveal>
            <div className="section-eyebrow">
              <span>[ 03 — ОТ ИДЕИ ДО ЗАПУСКА ]</span>
            </div>
            <h2 id="process-title">
              Сложные задачи.
              <br />
              <em>Понятный процесс.</em>
            </h2>
            <p>
              На каждом этапе вы понимаете,
              <br />
              где мы находимся и что будет дальше.
            </p>
            <span className="process-arrow" aria-hidden="true">
              ↘
            </span>
          </div>
          <ol className="process-steps">
            {[
              [
                "Сначала — суть",
                "Обсуждаем задачу, аудиторию и ограничения. Задаю вопросы, чтобы найти решение, которое нужно именно вам.",
              ],
              [
                "Затем — система",
                "Собираю структуру, пользовательские сценарии и визуальное направление. У каждой детали появляется своё место.",
              ],
              [
                "Дальше — в дело",
                "Разрабатываю итерациями и показываю рабочий результат. Проверяю адаптив, взаимодействия и интеграции.",
              ],
              [
                "И наконец — запуск",
                "Настраиваю публикацию, проверяю продукт в реальных условиях и помогаю двигаться дальше.",
              ],
            ].map(([title, description], index) => (
              <li key={title} data-reveal>
                <span className="step-number">0{index + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
                <span className="step-mark" aria-hidden="true">
                  +
                </span>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <footer className="contact section-wrap" id="contact">
        <div className="contact-top" data-reveal>
          <span className="section-eyebrow">[ 04 — ВАША СЛЕДУЮЩАЯ ИДЕЯ ]</span>
          <span className="contact-status">
            <span className="status-dot" /> ОТКРЫТ К НОВЫМ ПРОЕКТАМ
          </span>
        </div>
        <a
          className="contact-title"
          href={telegram}
          target="_blank"
          rel="noreferrer"
          data-reveal
        >
          <span>
            Сделаем
            <br />
            <em>что-то сильное.</em>
          </span>
          <span className="contact-arrow" data-magnetic>
            <Arrow />
          </span>
        </a>
        <div className="contact-bottom" data-reveal>
          <p>
            Расскажите, что у вас на уме.
            <br />
            Начнём с простого «привет».
          </p>
          <a
            className="contact-telegram"
            href={telegram}
            target="_blank"
            rel="noreferrer"
          >
            @dwertyfa <Arrow />
          </a>
        </div>
        <div className="footer-line">
          <a className="wordmark" href="#top">
            dwertyfa
            <span className="brand-star" aria-hidden="true">
              ✳
            </span>
          </a>
          <span>СДЕЛАНО С ВНИМАНИЕМ К ДЕТАЛЯМ © 2026</span>
          <div>
            <a href={github} target="_blank" rel="noreferrer">
              GitHub <Arrow />
            </a>
            <a href="#top">Наверх ↑</a>
          </div>
        </div>
      </footer>
    </>
  );
}
