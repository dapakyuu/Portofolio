import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ProjectDetails, ProjectMedia } from "./ProjectCard";
import { fxColor } from "./ProjectFx";

const pad = (n) => String(n).padStart(2, "0");

/**
 * Tampilan scroll: tiap project adalah panel setinggi layar yang menempel (sticky).
 * Saat di-scroll, panel berikutnya naik menutupi panel sebelumnya, dan animasi
 * project yang sedang aktif langsung diputar.
 */
export default function ProjectStack({ items }) {
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const [onScreen, setOnScreen] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const list = listRef.current;
    let raf = 0;

    const update = () => {
      raf = 0;
      const els = list.children;
      if (!els.length) return;
      const stickyTop = parseFloat(getComputedStyle(els[0]).top) || 0;
      let current = 0;
      for (let i = 0; i < els.length; i++) {
        const r = els[i].getBoundingClientRect();
        // Panel jadi aktif setelah menutupi lebih dari separuh panel sebelumnya.
        if (r.top < stickyTop + r.height * 0.5) current = i;
        // --cover: seberapa jauh panel berikutnya sudah menutupi panel ini (0..1).
        const next = els[i + 1];
        let cover = 0;
        if (next) {
          const nr = next.getBoundingClientRect();
          cover = Math.min(Math.max((r.bottom - nr.top) / r.height, 0), 1);
        }
        els[i].style.setProperty("--cover", cover.toFixed(3));
      }
      setActive(current);
      const lr = list.getBoundingClientRect();
      setOnScreen(lr.top < window.innerHeight * 0.6 && lr.bottom > window.innerHeight * 0.4);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [items]);

  // Scroll sampai panel ke-i menempel di atas.
  const goTo = (i) => {
    const list = listRef.current;
    const el = list.children[i];
    const stickyTop = parseFloat(getComputedStyle(el).top) || 0;
    const listTop = list.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: listTop + i * el.offsetHeight - stickyTop + 2,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <div className="stack">
      <ol ref={listRef} className="stack-list">
        {items.map((project, i) => {
          const playing = !reducedMotion && onScreen && i === active;
          return (
            <li
              key={project.title}
              className="stack-item"
              style={{ "--fx": fxColor(project.fx) }}
              aria-current={i === active ? "true" : undefined}
            >
              <article className={`stack-card glass ${playing ? "is-playing" : ""}`}>
                <div className="stack-visual">
                  <img className="stack-backdrop" src={project.image} alt="" aria-hidden="true" loading="lazy" />
                  <ProjectMedia project={project} playing={playing} />
                </div>
                <div className="stack-body">
                  <span className="stack-count">
                    <b>{pad(i + 1)}</b> / {pad(items.length)}
                  </span>
                  <ProjectDetails project={project} />
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      <nav className={`stack-rail ${onScreen ? "is-shown" : ""}`} aria-label="Navigasi project">
        {items.map((project, i) => (
          <button
            key={project.title}
            type="button"
            className={i === active ? "is-active" : ""}
            onClick={() => goTo(i)}
            aria-label={`Ke project ${i + 1}: ${project.title}`}
            aria-current={i === active ? "true" : undefined}
          >
            <span>{project.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
