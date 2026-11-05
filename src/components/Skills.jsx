import { LuBrainCircuit } from "react-icons/lu";
import { skills } from "../data/profile";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS = {
  ml: LuBrainCircuit,
};

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="Keahlian"
          title="Apa yang saya kerjakan"
          subtitle="Bidang yang saya kuasai dari pendidikan, pelatihan, dan project yang telah saya kerjakan."
        />
        <div className="skills-grid">
          {skills.map((skill, i) => {
            const Icon = skill.icon && ICONS[skill.icon];
            return (
              <Reveal key={skill.title} delay={i * 120} className="skill-card glass">
                <div className="skill-icon">
                  {Icon ? <Icon /> : <img src={skill.image} alt="" loading="lazy" />}
                </div>
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
                <ul className="chips">
                  {skill.tools.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
