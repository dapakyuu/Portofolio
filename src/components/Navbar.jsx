import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { useActiveSection } from "../hooks/useActiveSection";

const LINKS = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Keahlian" },
  { id: "projects", label: "Project" },
  { id: "about", label: "Tentang" },
  { id: "contact", label: "Kontak" },
];
const IDS = LINKS.map((l) => l.id);

export default function Navbar() {
  const active = useActiveSection(IDS);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  // Pill penanda menu aktif yang bergeser ke link yang sedang aktif.
  const listRef = useRef(null);
  const [pill, setPill] = useState(null);
  useLayoutEffect(() => {
    const update = () => {
      const link = listRef.current?.querySelector(`a[href="#${active}"]`);
      if (!link) return;
      setPill({ x: link.offsetLeft, y: link.offsetTop, w: link.offsetWidth, h: link.offsetHeight });
    };
    update();
    document.fonts?.ready.then(update);
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [active, open]);

  const close = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled || open ? "is-scrolled" : ""}`}>
      <nav className="container navbar-inner">
        <a href="#home" className="brand" onClick={close}>
          <span className="brand-mark">
            <FaUserAstronaut />
          </span>
          <span className="brand-text">
            My Portofolio <span className="brand-sep">-</span> Daffa
            <span className="text-gradient">.dev</span>
          </span>
        </a>

        <ul ref={listRef} className={`nav-links ${open ? "is-open" : ""}`}>
          {pill && (
            <li
              className="nav-pill"
              role="presentation"
              style={{
                width: pill.w,
                height: pill.h,
                transform: `translate(${pill.x}px, ${pill.y}px)`,
              }}
            />
          )}
          {LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                className={active === link.id ? "is-active" : ""}
                onClick={close}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="nav-toggle"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </nav>
    </header>
  );
}
