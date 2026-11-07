import { useEffect, useRef } from "react";
import { useMediaQuery } from "../hooks/useMediaQuery";

const HOVER = "a, button, label, [data-cursor]";
const TEXT = "input, textarea";
// Elemen yang "tertarik" ke kursor seperti magnet.
const MAGNETIC = ".btn:not(.btn-block), .hero-socials a, .footer-socials a, .carousel-btn, .brand-mark";
const MAGNET_STRENGTH = 0.35;
const MAGNET_MAX = 14;

const clamp = (v, max) => Math.max(-max, Math.min(max, v));

/** Kursor kustom: titik + cincin yang membesar di atas elemen interaktif. Hanya untuk mouse. */
export default function Cursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reducedMotion;

  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    const html = document.documentElement;
    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    html.classList.add("has-cursor");

    let x = -100;
    let y = -100;
    let rx = x;
    let ry = y;
    let shown = false;
    let raf = 0;
    let magnet = null;
    const offsets = new WeakMap();

    const releaseMagnet = () => {
      if (!magnet) return;
      magnet.style.translate = "";
      offsets.delete(magnet);
      magnet = null;
    };

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        root.classList.add("is-visible");
      }

      const target = e.target instanceof Element ? e.target : null;
      const text = target?.closest(TEXT);
      const hover = !text && target?.closest(HOVER);
      const labelText = hover?.getAttribute("data-cursor") || "";
      ring.classList.toggle("is-hover", Boolean(hover));
      ring.classList.toggle("is-text", Boolean(text));
      ring.classList.toggle("has-label", Boolean(labelText));
      if (label.textContent !== labelText) label.textContent = labelText;

      const m = target?.closest(MAGNETIC) || null;
      if (m !== magnet) releaseMagnet();
      if (m) {
        magnet = m;
        // Kurangi offset yang sedang dipakai supaya titik tengah tidak ikut bergeser.
        const prev = offsets.get(m) || { x: 0, y: 0 };
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2 - prev.x;
        const cy = r.top + r.height / 2 - prev.y;
        const off = {
          x: clamp((x - cx) * MAGNET_STRENGTH, MAGNET_MAX),
          y: clamp((y - cy) * MAGNET_STRENGTH, MAGNET_MAX),
        };
        offsets.set(m, off);
        m.style.translate = `${off.x.toFixed(1)}px ${off.y.toFixed(1)}px`;
      }
    };

    const tick = () => {
      rx += (x - rx) * 0.2;
      ry += (y - ry) * 0.2;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    const onLeave = () => {
      shown = false;
      root.classList.remove("is-visible");
      releaseMagnet();
    };

    raf = requestAnimationFrame(tick);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    html.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      releaseMagnet();
      html.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={ringRef} className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
