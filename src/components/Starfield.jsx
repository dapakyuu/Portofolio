import { useEffect, useRef } from "react";

/**
 * Latar bintang animasi di seluruh halaman:
 * - intro "warp": bintang melesat dari tengah seperti keluar dari hyperspace
 * - 3 lapisan bintang yang bergerak dengan kecepatan berbeda (parallax)
 * - bintang berkelip + bintang jatuh sesekali
 * - scroll cepat membuat bintang memanjang (efek warp)
 * - kursor mendorong bintang di sekitarnya dan membentuk garis rasi bintang
 * - jejak debu bintang mengikuti kursor, klik di area kosong memicu ledakan bintang
 */
const LAYERS = [
  { density: 1 / 5200, size: [0.4, 1.0], speed: 0.04, parallax: 0.03, alpha: 0.55 },
  { density: 1 / 11000, size: [0.8, 1.5], speed: 0.09, parallax: 0.08, alpha: 0.8 },
  { density: 1 / 30000, size: [1.3, 2.2], speed: 0.16, parallax: 0.15, alpha: 1 },
];
const COLORS = ["255,255,255", "207,211,255", "191,231,255", "217,204,255"];
const BURST_COLORS = ["255,255,255", "165,139,255", "63,184,255", "255,92,168"];

const INTRO_MS = 1700;
const REPEL_RADIUS = 130;
const LINK_RADIUS = 160;
const MAX_LINKS = 7;
const MAX_PARTICLES = 400;
// Klik pada elemen ini tidak memicu ledakan bintang.
const INTERACTIVE = "a, button, input, textarea, select, label, model-viewer, .carousel, form";

const rand = (min, max) => min + Math.random() * (max - min);

export default function Starfield() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let shooting = [];
    let particles = [];
    let rings = [];
    let nextShootingAt = 0;
    let frame = 0;
    let last = performance.now();
    const start = last;
    let lastScrollY = window.scrollY;
    let scrollWarp = 0;
    const pointer = { x: -9999, y: -9999, active: false, trailX: 0, trailY: 0 };

    function createStars() {
      stars = LAYERS.flatMap((layer, li) =>
        Array.from({ length: Math.round(width * height * layer.density) }, () => ({
          layer: li,
          x: Math.random() * width,
          y: Math.random() * height,
          ox: 0,
          oy: 0,
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

    function spawnParticle(x, y, speed, life, size) {
      if (particles.length >= MAX_PARTICLES) particles.shift();
      const a = Math.random() * Math.PI * 2;
      particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        life: 0,
        maxLife: life,
        r: size,
        color: BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)],
      });
    }

    function burst(x, y) {
      for (let i = 0; i < 34; i++) spawnParticle(x, y, rand(1.5, 6.5), rand(50, 90), rand(0.8, 2.2));
      rings.push({ x, y, life: 0, maxLife: 45 });
    }

    function draw(now) {
      const dt = Math.min((now - last) / 16.67, 3); // normalisasi ke ~60fps
      last = now;
      const t = now / 1000;
      const scrollY = window.scrollY;
      const cx = width / 2;
      const cy = height / 2;

      // Kekuatan warp: intro saat halaman dibuka + kecepatan scroll.
      const introP = Math.min((now - start) / INTRO_MS, 1);
      const introWarp = reducedMotion ? 0 : (1 - introP) ** 2.2;
      const scrollSpeed = Math.abs(scrollY - lastScrollY);
      lastScrollY = scrollY;
      scrollWarp += (Math.min(scrollSpeed / 70, 1) - scrollWarp) * Math.min(0.12 * dt, 1);
      const warp = reducedMotion ? 0 : Math.max(introWarp, scrollWarp * 0.55);
      const zoom = 1 - introWarp * 0.55; // saat intro, bintang berkumpul di tengah lalu menyebar

      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";

      const linked = [];

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
        let x = s.x;

        // Kursor mendorong bintang menjauh (lapisan depan terdorong lebih jauh).
        let tx = 0;
        let ty = 0;
        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < REPEL_RADIUS * REPEL_RADIUS) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / REPEL_RADIUS) * 26 * ((s.layer + 1) / 3);
            tx = (dx / d) * force;
            ty = (dy / d) * force;
          }
        }
        s.ox += (tx - s.ox) * Math.min(0.08 * dt, 1);
        s.oy += (ty - s.oy) * Math.min(0.08 * dt, 1);
        x += s.ox;
        y += s.oy;

        if (zoom !== 1) {
          x = cx + (x - cx) * zoom;
          y = cy + (y - cy) * zoom;
        }

        const twinkle = reducedMotion ? 1 : 0.55 + 0.45 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
        const alpha = layer.alpha * twinkle;

        if (warp > 0.03) {
          // Garis memanjang ke arah tengah layar: kesan melaju dengan kecepatan cahaya.
          const k = warp * (0.18 + s.layer * 0.16);
          ctx.globalAlpha = Math.min(1, alpha * (0.6 + warp));
          ctx.strokeStyle = `rgb(${s.color})`;
          ctx.lineWidth = s.r * 1.1;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x - (x - cx) * k, y - (y - cy) * k);
          ctx.stroke();
        } else {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = `rgb(${s.color})`;
          ctx.beginPath();
          ctx.arc(x, y, s.r, 0, Math.PI * 2);
          ctx.fill();

          // bintang besar diberi kilau
          if (s.r > 1.7) {
            ctx.globalAlpha *= 0.25;
            ctx.beginPath();
            ctx.arc(x, y, s.r * 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (pointer.active && s.layer > 0 && linked.length < MAX_LINKS) {
          const d = Math.hypot(x - pointer.x, y - pointer.y);
          if (d < LINK_RADIUS) linked.push({ x, y, d });
        }
      }

      // Garis rasi bintang dari kursor ke bintang terdekat.
      if (linked.length) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < linked.length; i++) {
          const p = linked[i];
          ctx.globalAlpha = (1 - p.d / LINK_RADIUS) * 0.55;
          ctx.strokeStyle = "rgb(165,139,255)";
          ctx.beginPath();
          ctx.moveTo(pointer.x, pointer.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          // sambungkan juga antarbintang agar membentuk rasi
          const q = linked[i + 1];
          if (q) {
            ctx.globalAlpha *= 0.5;
            ctx.strokeStyle = "rgb(63,184,255)";
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

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
          ctx.globalAlpha = 1;
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();
        }

        // Partikel: jejak kursor dan ledakan klik.
        particles = particles.filter((p) => p.life < p.maxLife);
        for (const p of particles) {
          p.life += dt;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vx *= 0.955 ** dt;
          p.vy = p.vy * 0.955 ** dt + 0.02 * dt;
          ctx.globalAlpha = (1 - p.life / p.maxLife) ** 1.5;
          ctx.fillStyle = `rgb(${p.color})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }

        rings = rings.filter((r) => r.life < r.maxLife);
        for (const r of rings) {
          r.life += dt;
          const p = r.life / r.maxLife;
          ctx.globalAlpha = (1 - p) * 0.7;
          ctx.strokeStyle = "rgb(165,139,255)";
          ctx.lineWidth = 2 * (1 - p) + 0.5;
          ctx.beginPath();
          ctx.arc(r.x, r.y, 10 + p * 110, 0, Math.PI * 2);
          ctx.stroke();
        }

        frame = requestAnimationFrame(draw);
      }
      ctx.globalAlpha = 1;
    }

    resize();
    nextShootingAt = performance.now() + 1800;
    frame = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reducedMotion) draw(performance.now());
    };
    const onScroll = () => {
      if (reducedMotion) draw(performance.now());
    };
    const onPointerMove = (e) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      if (Math.hypot(pointer.x - pointer.trailX, pointer.y - pointer.trailY) > 16) {
        spawnParticle(pointer.x, pointer.y, rand(0.2, 0.8), rand(30, 50), rand(0.6, 1.4));
        pointer.trailX = pointer.x;
        pointer.trailY = pointer.y;
      }
    };
    const onPointerOut = (e) => {
      if (!e.relatedTarget) pointer.active = false;
    };
    const onPointerDown = (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      if (e.target instanceof Element && e.target.closest(INTERACTIVE)) return;
      burst(e.clientX, e.clientY);
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (finePointer && !reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerOut);
      window.addEventListener("pointerdown", onPointerDown);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
