import { useEffect, useRef } from "react";

/**
 * Latar bintang animasi di seluruh halaman:
 * - 3 lapisan bintang yang bergerak dengan kecepatan berbeda (parallax)
 * - bintang berkelip
 * - bintang jatuh (shooting star) sesekali
 * - bintang ikut bergeser sedikit saat halaman di-scroll
 */
const LAYERS = [
  { density: 1 / 5200, size: [0.4, 1.0], speed: 0.04, parallax: 0.03, alpha: 0.55 },
  { density: 1 / 11000, size: [0.8, 1.5], speed: 0.09, parallax: 0.08, alpha: 0.8 },
  { density: 1 / 30000, size: [1.3, 2.2], speed: 0.16, parallax: 0.15, alpha: 1 },
];
const COLORS = ["255,255,255", "207,211,255", "191,231,255", "217,204,255"];

const rand = (min, max) => min + Math.random() * (max - min);

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let shooting = [];
    let nextShootingAt = 0;
    let frame = 0;
    let last = performance.now();

    function createStars() {
      stars = LAYERS.flatMap((layer, li) =>
        Array.from({ length: Math.round(width * height * layer.density) }, () => ({
          layer: li,
          x: Math.random() * width,
          y: Math.random() * height,
          r: rand(...layer.size),
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          twinkleSpeed: rand(0.6, 2.2),
          twinklePhase: Math.random() * Math.PI * 2,
        })),
      );
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createStars();
    }

    function spawnShootingStar() {
      const angle = rand(0.35, 0.65); // arah ke kanan-bawah
      const speed = rand(9, 15);
      shooting.push({
        x: rand(-0.1 * width, 0.8 * width),
        y: rand(-0.1 * height, 0.4 * height),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        length: rand(90, 180),
        life: 0,
        maxLife: rand(55, 85),
      });
    }

    function draw(now) {
      const dt = Math.min((now - last) / 16.67, 3); // normalisasi ke ~60fps
      last = now;
      const t = now / 1000;
      const scrollY = window.scrollY;

      ctx.clearRect(0, 0, width, height);

      for (const s of stars) {
        const layer = LAYERS[s.layer];
        if (!reducedMotion) {
          s.x += layer.speed * dt;
          s.y += layer.speed * 0.45 * dt;
          if (s.x > width + 4) s.x = -4;
          if (s.y > height + 4) s.y = -4;
        }
        // parallax scroll: lapisan depan bergeser lebih jauh
        let y = (s.y - scrollY * layer.parallax) % height;
        if (y < 0) y += height;

        const twinkle = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        ctx.globalAlpha = layer.alpha * twinkle;
        ctx.fillStyle = `rgb(${s.color})`;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // bintang besar diberi kilau
        if (s.r > 1.7) {
          ctx.globalAlpha *= 0.25;
          ctx.beginPath();
          ctx.arc(s.x, y, s.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        if (now > nextShootingAt) {
          spawnShootingStar();
          nextShootingAt = now + rand(2200, 5500);
        }
        shooting = shooting.filter((m) => m.life < m.maxLife);
        for (const m of shooting) {
          m.life += dt;
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          const fade = Math.sin((m.life / m.maxLife) * Math.PI); // muncul lalu hilang
          const mag = Math.hypot(m.vx, m.vy);
          const tailX = m.x - (m.vx / mag) * m.length;
          const tailY = m.y - (m.vy / mag) * m.length;
          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255,255,255,${0.95 * fade})`);
          grad.addColorStop(0.3, `rgba(165,139,255,${0.5 * fade})`);
          grad.addColorStop(1, "rgba(63,184,255,0)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }
        frame = requestAnimationFrame(draw);
      }
    }

    resize();
    nextShootingAt = performance.now() + 1200;
    frame = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reducedMotion) draw(performance.now());
    };
    const onScroll = () => {
      if (reducedMotion) draw(performance.now());
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
