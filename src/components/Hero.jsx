import { useEffect, useState } from "react";
import { FaGithub, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import { profile } from "../data/profile";
import Reveal from "./Reveal";

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
  const { github, instagram, whatsapp } = profile.socials;

  return (
    <section id="home" className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Reveal delay={100}>
            <span className="pill">
              <span className="pill-dot" /> Terbuka untuk kerja &amp; kolaborasi
            </span>
          </Reveal>
          <Reveal as="h1" delay={200}>
            Hi, saya <span className="text-gradient">{profile.name}</span>
          </Reveal>
          <Reveal as="p" delay={300} className="hero-role">
            {profile.title} <span className="sep">/</span>{" "}
            <span className="typed">{typed}</span>
            <span className="caret" aria-hidden="true" />
          </Reveal>
          <Reveal as="p" delay={400} className="hero-desc">
            Lulusan Teknik Komputer UPI yang fokus pada pengembangan web dan
            Machine Learning, mulai dari ide hingga menjadi produk yang bisa
            dipakai banyak orang.
          </Reveal>
          <Reveal delay={500} className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              Lihat Project <HiArrowRight />
            </a>
            <a href="#contact" className="btn btn-ghost">
              Hubungi Saya
            </a>
          </Reveal>
          <Reveal delay={600} className="hero-socials">
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

        <Reveal direction="left" delay={300} className="hero-visual">
          <div className="orbit orbit-1" />
          <div className="orbit orbit-2" />
          <img src="assets/header-img.svg" alt="Ilustrasi astronot" className="float" />
        </Reveal>
      </div>

      <a href="#skills" className="scroll-hint" aria-label="Scroll ke bawah">
        <span />
      </a>
    </section>
  );
}
