import { LuBrainCircuit } from "react-icons/lu";
import { skills } from "../data/profile";
import { useTilt } from "../hooks/useTilt";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS = {
  ml: LuBrainCircuit,
};

function SkillCard({ skill }) {
  const ref = useTilt({ max: 9 });
  const Icon = skill.icon && ICONS[skill.icon];
  return (
    <div ref={ref} className="skill-card glass">
      <div className="skill-icon">
        {Icon ? <Icon /> : <img src={skill.image} alt="" loading="lazy" />}
      </div>
      <h3>{skill.title}</h3>
      <p>{skill.description}</p>
      <ul className="chips">
        {skill.tools.map((t, i) => (
          <li key={t} className="chip" style={{ "--i": i }}>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
          {skills.map((skill, i) => (
            <Reveal key={skill.title} delay={i * 120} className="skill-reveal">
              <SkillCard skill={skill} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
