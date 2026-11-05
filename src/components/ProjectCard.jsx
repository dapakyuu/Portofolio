import { FaGithub } from "react-icons/fa";
import { HiOutlineExternalLink, HiOutlineLockClosed } from "react-icons/hi";

export default function ProjectCard({ project }) {
  const { title, description, image, category, tech = [], github, demo, demoLabel, highlight } =
    project;

  return (
    <article className="project-card glass">
      <div className="project-media">
        <img src={image} alt={title} loading="lazy" draggable="false" />
        <div className="project-badges">
          <span className="badge">{category}</span>
          {highlight && <span className="badge badge-accent">{highlight}</span>}
        </div>
      </div>

      <div className="project-body">
        <h3>{title}</h3>
        <p>{description}</p>

        {tech.length > 0 && (
          <ul className="chips">
            {tech.map((t) => (
              <li key={t} className="chip chip-sm">
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
      </div>
    </article>
  );
}
