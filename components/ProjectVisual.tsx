import type { WebProject } from "@/lib/data/projects";
import styles from "./ProjectVisual.module.css";

type Props = {
  project: WebProject;
  basePath: string;
  className?: string;
};

export default function ProjectVisual({ project, basePath, className = "" }: Props) {
  if (project.image) {
    return (
      <img
        className={`${styles.visual} ${className}`}
        src={`${basePath}/projects/${project.image}`}
        alt=""
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <div className={`${styles.visual} ${styles.poster} ${className}`}>
      <span className={styles.domain}>{project.domain}</span>
      <strong>
        {project.name}
        <span className="signal">.</span>
      </strong>
      <span className={styles.type}>{project.type}</span>
    </div>
  );
}
