import { useMemo, useState } from "react";
import { HiArrowDown, HiOutlineCollection, HiOutlineViewGrid } from "react-icons/hi";
import { projects } from "../data/projects";
import ProjectCarousel from "./ProjectCarousel";
import ProjectStack from "./ProjectStack";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ALL = "Semua";

// Kategori yang tampil duluan. Kategori lain menyusul sesuai urutan kemunculan di data.
const CATEGORY_PRIORITY = ["Web", "Mobile"];
const categoryOrder = [
  ...CATEGORY_PRIORITY,
  ...new Set(projects.map((p) => p.category).filter((c) => !CATEGORY_PRIORITY.includes(c))),
];
const rank = (category) => categoryOrder.indexOf(category);

// Sort stabil: urutan di dalam satu kategori tetap mengikuti projects.js.
const sortedProjects = [...projects].sort((a, b) => rank(a.category) - rank(b.category));

// Tampilan: "scroll" (default, satu project per layar) atau "card" (carousel kartu).
// Pilihan pengunjung diingat di browser masing-masing.
const VIEW_KEY = "projects-view";
const VIEWS = [
  { id: "scroll", label: "Scroll", icon: HiOutlineCollection },
  { id: "card", label: "Kartu", icon: HiOutlineViewGrid },
];
function readView() {
  try {
    return localStorage.getItem(VIEW_KEY) === "card" ? "card" : "scroll";
  } catch {
    return "scroll";
  }
}

export default function Projects() {
  const [filter, setFilter] = useState(ALL);
  // Animasi masuk kartu hanya diputar setelah filter diganti, bukan saat halaman dimuat.
  const [hasFiltered, setFilteredOnce] = useState(false);
  const [view, setView] = useState(readView);

  const changeView = (next) => {
    setView(next);
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {
      /* penyimpanan browser tidak tersedia: pilihan hanya berlaku sampai halaman ditutup */
    }
  };

  const categories = useMemo(() => {
    const counts = sortedProjects.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
    return [[ALL, sortedProjects.length], ...Object.entries(counts)];
  }, []);

  const filtered =
    filter === ALL ? sortedProjects : sortedProjects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Project"
          title="Karya yang pernah saya buat"
          subtitle={
            view === "scroll"
              ? "Dari riset, tugas kuliah, dan magang hingga project pribadi. Scroll untuk menjelajahi satu per satu."
              : "Dari riset, tugas kuliah, dan magang hingga project pribadi. Geser atau gunakan tombol untuk melihat semuanya."
          }
        />

        <Reveal className="project-toolbar" delay={100}>
          <div className="view-toggle" role="group" aria-label="Pilih tampilan project" data-view={view}>
            {VIEWS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={view === id}
                className={view === id ? "is-active" : ""}
                onClick={() => changeView(id)}
              >
                <Icon /> {label}
              </button>
            ))}
          </div>
          {view === "scroll" && (
            <a href="#about" className="view-skip">
              Lewati project <HiArrowDown />
            </a>
          )}
        </Reveal>

        <Reveal className="filters" delay={150}>
          {categories.map(([name, count]) => (
            <button
              key={name}
              className={`filter ${filter === name ? "is-active" : ""}`}
              onClick={() => {
                if (name === filter) return;
                setFilter(name);
                setFilteredOnce(true);
              }}
            >
              {name} <span>{count}</span>
            </button>
          ))}
        </Reveal>

        {/* key = filter supaya posisi kembali ke awal saat filter berubah */}
        {view === "scroll" ? (
          <ProjectStack key={filter} items={filtered} />
        ) : (
          <Reveal delay={200}>
            <ProjectCarousel key={filter} items={filtered} animateIn={hasFiltered} />
          </Reveal>
        )}
      </div>
    </section>
  );
}
