import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <Reveal className="section-heading">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>
        <ScrambleText text={title} delay={150} />
      </h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}
