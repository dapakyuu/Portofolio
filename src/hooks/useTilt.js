import { useEffect, useRef } from "react";
import { useMediaQuery } from "./useMediaQuery";

/**
 * Efek kartu 3D yang miring mengikuti kursor.
 * Menulis CSS variable ke elemen: --rx, --ry (derajat kemiringan) dan
 * --mx, --my (posisi kursor dalam %, untuk efek kilau/spotlight).
 */
export function useTilt({ max = 8 } = {}) {
  const ref = useRef(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    const el = ref.current;
    if (!el || !canHover || reducedMotion) return;

    let rect = null;
    let raf = 0;
    let px = 0.5;
    let py = 0.5;

    const apply = () => {
      raf = 0;
      el.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    };
    // Ukuran diambil saat kursor masuk, supaya kemiringan kartu tidak ikut mengubah hitungan.
    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };
    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      px = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
      py = Math.min(Math.max((e.clientY - rect.top) / rect.height, 0), 1);
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      rect = null;
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [canHover, reducedMotion, max]);

  return ref;
}
