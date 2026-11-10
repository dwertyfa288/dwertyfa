"use client";

import { useEffect, useRef, useState } from "react";
import Arrow from "./Arrow";
import ProjectVisual from "./ProjectVisual";
import type { WebProject } from "@/lib/data/projects";
import styles from "./Work.module.css";

type Props = {
  projects: WebProject[];
  basePath: string;
};

export default function WorkIndex({ projects, basePath }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const frameRef = useRef(0);

  useEffect(() => {
    if (activeIndex === null) return;
    const animate = () => {
      const preview = previewRef.current;
      if (!preview) return;
      const dx = target.current.x - current.current.x;
      const dy = target.current.y - current.current.y;
      current.current.x += dx * 0.14;
      current.current.y += dy * 0.14;
      const tiltY = Math.max(-18, Math.min(18, dx * 0.12));
      const tiltX = Math.max(-14, Math.min(14, -dy * 0.12));
      preview.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0) translate(-50%, -50%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [activeIndex]);

  const onPointerMove = (event: React.PointerEvent) => {
    target.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerEnter = (event: React.PointerEvent, index: number) => {
    if (event.pointerType !== "mouse") return;
    if (activeIndex === null) {
      current.current = { x: event.clientX, y: event.clientY };
      target.current = { x: event.clientX, y: event.clientY };
    }
    setActiveIndex(index);
  };

  return (
    <>
      <ol className={styles.list} onPointerMove={onPointerMove} onPointerLeave={() => setActiveIndex(null)}>
        {projects.map((project, index) => (
          <li
            key={project.id}
            className={`${styles.row} ${activeIndex !== null && activeIndex !== index ? styles.dimmed : ""}`}
            data-reveal
            onPointerEnter={(event) => onPointerEnter(event, index)}
          >
            <a href={project.href} target="_blank" rel="noreferrer" className={styles.rowLink}>
              <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.name}>{project.name}</span>
              <span className={styles.category}>
                {project.category}
                <small>{project.type}</small>
              </span>
              <span className={styles.tags}>{project.tags.join(" · ")}</span>
              <Arrow className={styles.go} />
              <span className={styles.thumb}>
                <ProjectVisual project={project} basePath={basePath} />
              </span>
              <span className={styles.description}>{project.description}</span>
            </a>
          </li>
        ))}
      </ol>
      <div className={styles.previewStage} aria-hidden="true">
        <div ref={previewRef} className={`${styles.preview} ${activeIndex !== null ? styles.previewOn : ""}`}>
          {projects.map((project, index) => (
            <div key={project.id} className={`${styles.slide} ${index === activeIndex ? styles.slideOn : ""}`}>
              <ProjectVisual project={project} basePath={basePath} />
            </div>
          ))}
          <span className={styles.scan} />
          <span className={`mono ${styles.previewLabel}`}>
            <span>fig. {String((activeIndex ?? 0) + 1).padStart(2, "0")}</span>
            <span className="signal">{activeIndex !== null ? projects[activeIndex].domain : ""}</span>
          </span>
        </div>
      </div>
    </>
  );
}
