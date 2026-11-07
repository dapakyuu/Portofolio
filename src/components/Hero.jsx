import { useEffect, useRef, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { profile } from "../data/profile";
import { useMediaQuery } from "../hooks/useMediaQuery";
import CvButton from "./CvButton";
import Reveal from "./Reveal";
import ScrambleText from "./ScrambleText";

// Konten hero muncul setelah intro warp di latar bintang mulai mereda.
const INTRO = 750;

/** Menulis posisi mouse (-1..1) ke CSS variable --px / --py untuk efek parallax. */
function useParallax() {
  const ref = useRef(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover || reducedMotion) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", py.toFixed(3));
    };
    const onMove = (e) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [canHover, reducedMotion]);

  return ref;
}

function useTypewriter(words, typeSpeed = 85, deleteSpeed = 45, pause = 1600) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex % words.length];
    let delay = deleting ? deleteSpeed : typeSpeed;
    let next;

    if (!deleting && text === word) {
      delay = pause;
      next = () => setDeleting(true);
    } else if (deleting && text === "") {
      next = () => {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      };
    } else {
      next = () => setText(word.slice(0, text.length + (deleting ? -1 : 1)));
    }

    const timeout = setTimeout(next, delay);
    return () => clearTimeout(timeout);
  }, [text, deleting, wordIndex, words, typeSpeed, deleteSpeed, pause]);

  return text;
}

export default function Hero() {
  const typed = useTypewriter(profile.roles);
  const { github, linkedin, instagram, whatsapp } = profile.socials;
  const heroRef = useParallax();

  return (
    <section id="home" className="hero" ref={heroRef}>
      <div className="container hero-grid">
        <div className="hero-copy">
          <Reveal delay={INTRO + 100}>
            <span className="pill">
              <span className="pill-dot" /> Terbuka untuk kerja &amp; kolaborasi
            </span>
          </Reveal>
          <Reveal as="h1" delay={INTRO + 200}>
            Hi, saya{" "}
            <ScrambleText
              className="text-gradient hero-name"
              text={profile.name}
              delay={INTRO + 250}
              duration={1300}
            />
          </Reveal>
          <Reveal as="p" delay={INTRO + 300} className="hero-role">
            {profile.title} <span className="sep">/</span>{" "}
            <span className="typed">{typed}</span>
            <span className="caret" aria-hidden="true" />
          </Reveal>
          <Reveal as="p" delay={INTRO + 400} className="hero-desc">
            Lulusan Teknik Komputer UPI yang fokus pada pengembangan web dan
            Machine Learning, mulai dari ide hingga menjadi produk yang bisa
            dipakai banyak orang.
          </Reveal>
          <Reveal delay={INTRO + 500} className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Lihat Project <HiArrowRight />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi Saya
            </a>
            <CvButton />
          </Reveal>
          <Reveal delay={INTRO + 600} className="hero-socials">
            <a href={linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href={github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href={instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </Reveal>
        </div>

        <Reveal direction="left" delay={INTRO + 200} className="hero-visual">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <div className="orbit orbit-3" />
          <img src="assets/header-img.svg" alt="Ilustrasi astronot" className="float" />
        </Reveal>
      </div>

      <a href="#skills" className="scroll-hint" aria-label="Scroll ke bawah">
        <span />
      </a>
    </section>
  );
}
