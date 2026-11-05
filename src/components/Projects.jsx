import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import ProjectCarousel from "./ProjectCarousel";
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

export default function Projects() {
  const [filter, setFilter] = useState(ALL);

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
          subtitle="Dari riset, tugas kuliah, dan magang hingga project pribadi. Geser atau gunakan tombol untuk melihat semuanya."
        />

        <Reveal className="filters" delay={100}>
          {categories.map(([name, count]) => (
            <button
              key={name}
              className={`filter ${filter === name ? "is-active" : ""}`}
              onClick={() => setFilter(name)}
            >
              {name} <span>{count}</span>
            </button>
          ))}
        </Reveal>

        <Reveal delay={200}>
          {/* key = filter supaya posisi carousel kembali ke awal saat filter berubah */}
          <ProjectCarousel key={filter} items={filtered} />
        </Reveal>
      </div>
    </section>
  );
}
