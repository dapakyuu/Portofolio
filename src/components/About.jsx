import { useEffect } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { HiOutlineAcademicCap, HiOutlineGlobeAlt } from "react-icons/hi";
import { profile } from "../data/profile";
import { projects } from "../data/projects";
import { useInView } from "../hooks/useInView";
import CvButton from "./CvButton";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const stats = [
  { value: profile.gpa, label: "IPK" },
  { value: `${projects.length}+`, label: "Project" },
];

export default function About() {
  // Model 3D baru dimuat saat section hampir terlihat agar halaman awal tetap ringan.
  const [modelRef, modelInView] = useInView({ rootMargin: "300px" });
  useEffect(() => {
    if (modelInView) import("@google/model-viewer");
  }, [modelInView]);

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading eyebrow="Tentang" title="Kenalan lebih dekat" />

        <div className="about-grid">
          <Reveal direction="right" className="about-photo">
            <div className="photo-frame">
              <img src="assets/daffa.jpg" alt={profile.name} loading="lazy" />
            </div>
          </Reveal>

          <div className="about-copy">
            <Reveal as="h3">{profile.name}</Reveal>
            <Reveal as="ul" delay={100} className="about-meta">
              <li>
                <HiOutlineAcademicCap /> {profile.degree}, {profile.university}
              </li>
              <li>
                <HiOutlineGlobeAlt /> {profile.languages.join(" · ")}
              </li>
            </Reveal>
            {profile.summary.map((p, i) => (
              <Reveal as="p" key={i} delay={150 + i * 50}>
                {p}
              </Reveal>
            ))}

            <Reveal delay={250} className="stats">
              {stats.map((s) => (
                <div key={s.label} className="stat glass">
                  <strong className="text-gradient">{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={300} className="about-actions">
              <CvButton className="btn btn-primary" />
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <FaLinkedin /> LinkedIn
              </a>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <FaGithub /> GitHub
              </a>
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <FaInstagram /> Instagram
              </a>
            </Reveal>
          </div>

          <div ref={modelRef} className="about-model">
            {modelInView && (
              <div className="rocket-float">
                {/* auto-rotate-delay="0": langsung berputar lagi setelah di-drag */}
                <model-viewer
                  src="assets/toy_rocket.glb"
                  alt="Model 3D roket mainan"
                  autoplay
                  camera-controls
                  disable-zoom
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="45deg"
                  interaction-prompt="none"
                  shadow-intensity="1"
                />
              </div>
            )}
            <span className="model-hint">Drag untuk memutar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
