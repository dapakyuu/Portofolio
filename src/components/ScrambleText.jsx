import { useEffect, useState } from "react";
import { useInView } from "../hooks/useInView";
import { useMediaQuery } from "../hooks/useMediaQuery";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\アカサタナハマヤラワ";
const FRAME_MS = 40;

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

/**
 * Teks yang "di-decode": huruf acak berganti-ganti lalu terkunci satu per satu
 * menjadi teks asli saat elemen masuk layar. Pembaca layar selalu mendapat teks asli.
 */
export default function ScrambleText({ text, delay = 0, duration = 1000, className = "" }) {
  const [ref, inView] = useInView({ threshold: 0.4 });
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  // Mulai dalam keadaan teracak supaya teks asli tidak sempat terlihat sebelum animasi.
  const [output, setOutput] = useState(() =>
    reducedMotion ? text : [...text].map((c) => (c === " " ? c : randomGlyph())).join(""),
  );

  useEffect(() => {
    if (!inView || reducedMotion) {
      setOutput(text);
      return;
    }
    const chars = [...text];
    // Huruf terkunci kira-kira dari kiri ke kanan, dengan sedikit acak.
    const lockAt = chars.map((_, i) => (i / chars.length) * 0.65 + Math.random() * 0.35);
    let raf = 0;
    let startAt = 0;
    let lastFrame = 0;

    const step = (now) => {
      if (!startAt) startAt = now;
      const p = (now - startAt) / duration;
      if (p >= 1) {
        setOutput(text);
        return;
      }
      if (now - lastFrame >= FRAME_MS) {
        lastFrame = now;
        setOutput(chars.map((c, i) => (c === " " || p >= lockAt[i] ? c : randomGlyph())).join(""));
      }
      raf = requestAnimationFrame(step);
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, reducedMotion, text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{output}</span>
    </span>
  );
}
