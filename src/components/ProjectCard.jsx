import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink, HiOutlineLockClosed } from "react-icons/hi";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useOnScreen } from "../hooks/useOnScreen";
import { useTilt } from "../hooks/useTilt";
import ProjectFx, { fxColor } from "./ProjectFx";

/** Gambar project + animasi khusus + badge. Dipakai tampilan kartu dan tampilan scroll. */
export function ProjectMedia({ project, playing, ref }) {
  const { title, image, category, highlight, fx } = project;
  return (
    <div ref={ref} className="project-media">
      <img src={image} alt={title} loading="lazy" draggable="false" />
      <ProjectFx name={fx} playing={playing} />
      <div className="project-badges">
        <span className="badge">{category}</span>
        {highlight && <span className="badge badge-accent">{highlight}</span>}
      </div>
    </div>
  );
}

/** Judul, deskripsi, teknologi, dan link project. */
export function ProjectDetails({ project }) {
  const { title, description, tech = [], github, demo, demoLabel } = project;
  return (
    <>
      <h3>{title}</h3>
      <p>{description}</p>

      {tech.length > 0 && (
        <ul className="chips">
          {tech.map((t, i) => (
            <li key={t} className="chip chip-sm" style={{ "--i": i }}>
              {t}
            </li>
          ))}
        </ul>
      )}

      <div className="project-links">
        {github && (
          <a href={github} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost">
            <FaGithub /> GitHub
          </a>
        )}
        {demo && (
          <a href={demo} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
            <HiOutlineExternalLink /> {demoLabel || "Live Demo"}
          </a>
        )}
        {!github && !demo && (
          <span className="project-private">
            <HiOutlineLockClosed /> Source code tidak dipublikasikan
          </span>
        )}
      </div>
    </>
  );
}

export default function ProjectCard({ project, visible = true }) {
  const tiltRef = useTilt({ max: 7 });
  // Animasi berjalan otomatis saat gambar project benar-benar terlihat di layar.
  const [mediaRef, onScreen] = useOnScreen({ threshold: 0.5 });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const playing = !reducedMotion && visible && onScreen;

  return (
    <article
      ref={tiltRef}
      className={`project-card glass ${playing ? "is-playing" : ""}`}
      style={{ "--fx": fxColor(project.fx) }}
    >
      <span className="glare" aria-hidden="true" />
      <ProjectMedia ref={mediaRef} project={project} playing={playing} />
      <div className="project-body">
        <ProjectDetails project={project} />
      </div>
    </article>
  );
}
