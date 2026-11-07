import { useEffect, useRef, useState } from "react";
import { HiChevronDown, HiOutlineDocumentText, HiOutlineDownload } from "react-icons/hi";
import { profile } from "../data/profile";

/** Tombol CV dengan menu pilihan versi CV: tiap versi bisa dibuka di tab baru atau diunduh. */
export default function CvButton({ className = "btn btn-ghost" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Tutup menu saat klik di luar atau menekan Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e) => {
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="cv-menu">
      <button
        type="button"
        className={className}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
      >
        <HiOutlineDocumentText /> Lihat CV
        <HiChevronDown className={`cv-caret ${open ? "is-open" : ""}`} />
      </button>

      <div className={`cv-dropdown ${open ? "is-open" : ""}`}>
        {profile.cv.map(({ label, note, href }) => (
          <div key={href} className="cv-item">
            <a href={href} target="_blank" rel="noreferrer" className="cv-open" onClick={() => setOpen(false)}>
              <span className="cv-icon">
                <HiOutlineDocumentText />
              </span>
              <span>
                <strong>{label}</strong>
                {note && <small>{note}</small>}
              </span>
            </a>
            <a href={href} download className="cv-download" aria-label={`Unduh ${label}`} title="Unduh PDF">
              <HiOutlineDownload />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
