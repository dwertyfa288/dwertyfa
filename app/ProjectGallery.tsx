"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { projects } from "../lib/projects";
import {
  chapterAt,
  chapterFrame,
  progressFromScroll,
  scrollForChapter,
} from "../lib/gallery.mjs";

export default function ProjectGallery({ basePath }: { basePath: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const jumpRef = useRef<(index: number) => void>(() => {});
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const panels = [...stage.querySelectorAll<HTMLElement>(".project-chapter")];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 900px)");
    let mode = "static";
    let top = 0;
    let range = 0;
    let frame = 0;
    let current = -1;

    const update = () => {
      frame = 0;
      let next = 0;
      if (mode === "pinned") {
        const progress = progressFromScroll(window.scrollY, top, range);
        next = chapterAt(progress, panels.length);
        const focusedChapter = panels.findIndex((panel) =>
          panel.contains(document.activeElement),
        );
        if (focusedChapter !== -1 && focusedChapter !== next) {
          track
            .querySelectorAll<HTMLAnchorElement>(".chapter-navigation a")
            [next]?.focus({ preventScroll: true });
        }
        track.style.setProperty("--gallery-progress", `${progress * 100}%`);
        panels.forEach((panel, index) => {
          const position = chapterFrame(progress, index, panels.length);
          panel.style.transform = `translate3d(${position.x}%, ${position.y}%, ${position.z}px) rotateY(${position.rotate}deg) scale(${position.scale})`;
          panel.style.opacity = String(position.opacity);
          panel.style.zIndex = String(panels.length - Math.abs(index - next));
          panel.style.visibility =
            position.opacity < 0.01 ? "hidden" : "visible";
          panel.inert = index !== next;
          panel.setAttribute("aria-hidden", String(index !== next));
        });
      } else if (mode === "swipe") {
        const center = stage.scrollLeft + stage.clientWidth / 2;
        next = panels.reduce(
          (closest, panel, index) =>
            Math.abs(panel.offsetLeft + panel.clientWidth / 2 - center) <
            Math.abs(
              panels[closest].offsetLeft +
                panels[closest].clientWidth / 2 -
                center,
            )
              ? index
              : closest,
          0,
        );
      } else {
        const center = window.innerHeight / 2;
        next = panels.reduce((closest, panel, index) => {
          const bounds = panel.getBoundingClientRect();
          const previous = panels[closest].getBoundingClientRect();
          return Math.abs(bounds.top + bounds.height / 2 - center) <
            Math.abs(previous.top + previous.height / 2 - center)
            ? index
            : closest;
        }, 0);
      }
      if (next !== current) {
        current = next;
        setActive(next);
        track.style.setProperty("--chapter-color", projects[next].color);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      top = track.getBoundingClientRect().top + window.scrollY;
      range = Math.max(0, track.offsetHeight - window.innerHeight);
      schedule();
    };
    const configure = () => {
      mode =
        preference.matches || (desktop.matches && window.innerHeight < 680)
          ? "static"
          : desktop.matches
            ? "pinned"
            : "swipe";
      track.dataset.mode = mode;
      panels.forEach((panel) => {
        panel.removeAttribute("style");
        panel.inert = false;
        panel.removeAttribute("aria-hidden");
      });
      // Preserve every link and description when viewport height or text zoom
      // leaves insufficient room for a pinned chapter.
      if (
        mode === "pinned" &&
        panels.some((panel) => {
          const info = panel.querySelector<HTMLElement>(".chapter-info");
          return info && info.scrollHeight > panel.clientHeight;
        })
      ) {
        mode = "static";
        track.dataset.mode = mode;
      }
      measure();
    };
    jumpRef.current = (index) => {
      if (mode === "pinned") {
        measure();
        window.scrollTo({
          top: scrollForChapter(index, panels.length, top, range),
          behavior: "smooth",
        });
      } else if (mode === "swipe") {
        stage.scrollTo({
          left:
            panels[index].offsetLeft -
            (stage.clientWidth - panels[index].clientWidth) / 2,
          behavior: "smooth",
        });
      } else {
        panels[index].scrollIntoView({ behavior: "instant", block: "start" });
      }
    };
    const onHashChange = () => {
      const index = projects.findIndex(
        (project) => window.location.hash === `#project-${project.id}`,
      );
      if (index !== -1) jumpRef.current(index);
    };
    configure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(track);
    window.addEventListener("scroll", schedule, { passive: true });
    stage.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", configure, { passive: true });
    window.addEventListener("hashchange", onHashChange);
    preference.addEventListener("change", configure);
    desktop.addEventListener("change", configure);
    let disposed = false;
    document.fonts.ready.then(() => {
      if (!disposed) configure();
    });
    onHashChange();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      stage.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", configure);
      window.removeEventListener("hashchange", onHashChange);
      preference.removeEventListener("change", configure);
      desktop.removeEventListener("change", configure);
      delete track.dataset.mode;
      panels.forEach((panel) => {
        panel.removeAttribute("style");
        panel.removeAttribute("aria-hidden");
        panel.inert = false;
      });
      jumpRef.current = () => {};
    };
  }, []);

  const jump = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
      return;
    event.preventDefault();
    jumpRef.current(index);
    window.history.replaceState(null, "", `#project-${projects[index].id}`);
  };

  return (
    <section className="work-section" id="work" aria-labelledby="work-heading">
      <div className="work-intro page-width" data-reveal>
        <div className="section-label">
          <span className="label-dot" /> 01 / ИЗБРАННАЯ ВСЕЛЕННАЯ
        </div>
        <div>
          <h2 id="work-heading">
            Четыре проекта.
            <br />
            <em>Четыре измерения.</em>
          </h2>
          <p>
            Разные задачи, разный характер.
            <br />В каждом — часть моего подхода.
          </p>
        </div>
      </div>
      <div className="gallery-track" ref={trackRef}>
        <div className="gallery-pin">
          <div className="gallery-heading page-width">
            <span>
              SELECTED WORK —{" "}
              <span className="gallery-current">0{active + 1}</span> / 04
            </span>
            <span className="gallery-scroll-hint">
              ПРОКРУЧИВАЙТЕ, ЧТОБЫ ПУТЕШЕСТВОВАТЬ ↓
            </span>
            <span className="gallery-swipe-hint">ЛИСТАЙТЕ ПРОЕКТЫ →</span>
          </div>
          <div className="gallery-stage" ref={stageRef}>
            {projects.map((project) => (
              <article
                key={project.id}
                className={`project-chapter chapter--${project.id}`}
                id={`project-${project.id}`}
                aria-label={`${project.number}. ${project.name}`}
              >
                <div className="chapter-info">
                  <div className="chapter-category">
                    <span>{project.number}</span>
                    {project.category}
                  </div>
                  <h3>
                    {project.lineOne}
                    <br />
                    <em>{project.lineTwo}</em>
                  </h3>
                  <p>{project.description}</p>
                  <div className="chapter-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <a
                    className="pill pill--glass"
                    href={project.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Открыть проект <span>↗</span>
                  </a>
                  <span className="chapter-type">
                    {project.type} <span>© 2026</span>
                  </span>
                </div>
                <a
                  className={`chapter-cover cover--${project.id}`}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Посмотреть ${project.name} в новой вкладке`}
                  data-tilt
                >
                  {project.id === "nova" && (
                    <>
                      <Image
                        src={`${basePath}/projects/nova.webp`}
                        alt="Вечерняя архитектура Nova Prestige в Бишкеке"
                        fill
                        sizes="(min-width: 900px) 52vw, 90vw"
                        unoptimized
                      />
                      <div className="cover-shade" />
                      <span className="cover-brand nova-brand">
                        NOVA<span>PRESTIGE</span>
                      </span>
                      <div className="cover-nova-title">
                        Искусство
                        <br />
                        <em>жить красиво.</em>
                      </div>
                      <span className="cover-caption">
                        БИШКЕК · ПРИВАТНЫЙ ЖИЛОЙ ДОМ
                      </span>
                    </>
                  )}
                  {project.id === "roxy" && (
                    <>
                      <span className="cover-brand roxy-brand">
                        roxy<span>boost®</span>
                      </span>
                      <div className="roxy-orbits" aria-hidden="true" />
                      <span className="roxy-word" aria-hidden="true">
                        BEYOND
                        <br />
                        LIMITS.
                      </span>
                      <Image
                        className="roxy-astronaut"
                        src={`${basePath}/projects/roxy.webp`}
                        alt="Космонавт Roxy Boost"
                        width={310}
                        height={405}
                        unoptimized
                      />
                      <span className="cover-caption">СВОБОДА БЕЗ ГРАНИЦ</span>
                    </>
                  )}
                  {project.id === "montage" && (
                    <>
                      <span className="cover-brand montage-brand">
                        danek
                        <br />
                        montage®
                      </span>
                      <span className="montage-caption">
                        CUT. CREATE. REPEAT.
                      </span>
                      <div className="montage-letters" aria-hidden="true">
                        <span>FRAME</span>
                        <span>
                          <i>BY</i> FRAME
                        </span>
                        <span>↗</span>
                      </div>
                      <span className="cover-caption">
                        КАЖДЫЙ КАДР ИМЕЕТ ЗНАЧЕНИЕ
                      </span>
                    </>
                  )}
                  {project.id === "ksusha" && (
                    <>
                      <Image
                        src={`${basePath}/projects/ksusha.webp`}
                        alt="Фотография из проекта Hey Ksusha"
                        fill
                        sizes="(min-width: 900px) 52vw, 90vw"
                        unoptimized
                      />
                      <div className="cover-shade" />
                      <span className="cover-brand ksusha-brand">
                        hey, ksusha
                      </span>
                      <div className="cover-ksusha-title">
                        Начинается
                        <br />
                        <em>с тебя.</em>
                      </div>
                      <span className="cover-caption">ОНЛАЙН-ИНТЕНСИВ</span>
                    </>
                  )}
                  <span className="cover-link" aria-hidden="true">
                    ↗
                  </span>
                </a>
              </article>
            ))}
          </div>
          <div className="gallery-controls page-width">
            <a
              href="https://t.me/dwertyfa"
              target="_blank"
              rel="noreferrer"
              className="next-project-link"
            >
              Ваш проект может быть следующим ↗
            </a>
            <nav className="chapter-navigation" aria-label="Выбор проекта">
              {projects.map((project, index) => (
                <a
                  key={project.id}
                  href={`#project-${project.id}`}
                  onClick={(event) => jump(event, index)}
                  aria-label={`Проект ${project.name}`}
                  aria-current={active === index ? "step" : undefined}
                >
                  <span>{project.number}</span>
                  <i />
                </a>
              ))}
            </nav>
            <span className="gallery-control-note">
              {projects[active].name} <span>↗</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
