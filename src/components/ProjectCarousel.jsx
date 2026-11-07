import { useCallback, useEffect, useRef, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useMediaQuery } from "../hooks/useMediaQuery";
import ProjectCard from "./ProjectCard";

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 50;

export default function ProjectCarousel({ items, animateIn = false }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const isTablet = useMediaQuery("(min-width: 680px)");
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const perView = isDesktop ? 3 : isTablet ? 2 : 1;

  const maxIndex = Math.max(0, items.length - perView);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStart = useRef(null);

  // Jaga index tetap valid saat ukuran layar / jumlah item berubah.
  const current = Math.min(index, maxIndex);

  const goTo = useCallback(
    (i) => setIndex(i < 0 ? maxIndex : i > maxIndex ? 0 : i),
    [maxIndex],
  );
  const next = useCallback(() => goTo(current + 1), [goTo, current]);
  const prev = useCallback(() => goTo(current - 1), [goTo, current]);

  // Saat bergeser, kartu sedikit mengecil lalu kembali, memberi kesan kedalaman.
  const [moving, setMoving] = useState(false);
  const prevIndex = useRef(current);
  useEffect(() => {
    if (prevIndex.current === current) return;
    prevIndex.current = current;
    setMoving(true);
    const t = setTimeout(() => setMoving(false), 550);
    return () => clearTimeout(t);
  }, [current]);

  useEffect(() => {
    if (paused || reducedMotion || maxIndex === 0) return;
    const id = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reducedMotion, maxIndex, next]);

  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const dx = e.clientX - dragStart.current;
    dragStart.current = null;
    if (dx > SWIPE_THRESHOLD) prev();
    else if (dx < -SWIPE_THRESHOLD) next();
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  const pad = (n) => String(n).padStart(2, "0");
  // Kalau posisi terlalu banyak, tampilkan penghitung "01 / 15" alih-alih titik.
  const manyDots = maxIndex + 1 > 8;

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Daftar project"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="carousel-viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}
      >
        <ul
          className={[
            "carousel-track",
            maxIndex === 0 && "is-centered",
            moving && "is-moving",
            animateIn && "is-entering",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateX(-${(current * 100) / perView}%)` }}
        >
          {items.map((project, i) => {
            const hidden = i < current || i >= current + perView;
            return (
              <li
                key={project.title}
                className="carousel-slide"
                style={{ flexBasis: `${100 / perView}%`, "--i": Math.max(0, i - current) }}
                aria-hidden={hidden}
              >
                <ProjectCard project={project} visible={!hidden} />
              </li>
            );
          })}
        </ul>
      </div>

      {maxIndex > 0 && (
        <div className="carousel-controls">
          <button className="carousel-btn" onClick={prev} aria-label="Project sebelumnya">
            <HiChevronLeft />
          </button>

          {!manyDots && (
            <div className="carousel-dots">
              {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                  key={i}
                  className={`dot ${i === current ? "is-active" : ""}`}
                  onClick={() => goTo(i)}
                  aria-label={`Ke slide ${i + 1}`}
                  aria-current={i === current}
                />
              ))}
            </div>
          )}

          <span className={`carousel-count ${manyDots ? "is-shown" : ""}`}>
            {pad(current + 1)} / {pad(maxIndex + 1)}
          </span>

          <button className="carousel-btn" onClick={next} aria-label="Project berikutnya">
            <HiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
