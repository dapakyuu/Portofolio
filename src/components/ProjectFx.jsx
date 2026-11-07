import { useEffect, useState } from "react";
import { HiCheckCircle, HiOutlineBell } from "react-icons/hi";
import "../styles/project-fx.css";

/**
 * Animasi khusus per project yang muncul di atas gambar saat kartu di-hover
 * (atau saat slide terlihat di perangkat layar sentuh).
 * Pilih efek lewat field `fx` di src/data/projects.js. `color` dipakai juga
 * untuk warna glow kartu.
 */
const range = (n) => Array.from({ length: n }, (_, i) => i);
const caesar = (ch) => String.fromCharCode(((ch.charCodeAt(0) - 65 + 3) % 26) + 65);

const FACE_POINTS = [
  [32, 40], [68, 40], [50, 56], [36, 72], [50, 77], [64, 72], [20, 50], [80, 50], [50, 22],
];
const RAIN = [
  "01001011", "KHOOR01", "10110100", "ZRUOG10", "01110011", "LSB0110",
  "11001010", "FDHVDU1", "00101101", "10011100", "SHVDQ01", "01101001",
];
const NEWS =
  "Berita terkini dari NewsAPI  •  Cuaca BMKG hari ini 24°C cerah berawan  •  Livescore: 2 – 1 babak kedua  •  Klasemen liga diperbarui  •  ";
const SCHEDULE = [
  ["19:00", "Karaoke stream", true],
  ["21:00", "Gaming collab", false],
  ["23:30", "Zatsudan", false],
];

const EFFECTS = {
  // Forensa: pemindaian dokumen oleh AI
  scan: {
    color: "#3ddc97",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-grid" />
        <span className="fx-scan" />
        {["tl", "tr", "bl", "br"].map((c) => (
          <span key={c} className={`fx-corner fx-corner-${c}`} />
        ))}
        <span className="fx-stamp">✓ AUTHENTIC</span>
      </>
    ),
  },

  // Portal berita: breaking news ticker
  ticker: {
    color: "#ff4d5e",
    render: () => (
      <>
        <span className="fx-dim fx-dim-soft" />
        <span className="fx-live">
          <i /> LIVE
        </span>
        <span className="fx-ticker">
          <b>BREAKING</b>
          <span className="fx-ticker-track">
            <span>
              {NEWS}
              {NEWS}
            </span>
          </span>
        </span>
      </>
    ),
  },

  // AI interview: rekaman, face tracking, gelombang suara
  interview: {
    color: "#ffb547",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-rec">
          <i /> REC
        </span>
        <span className="fx-face">
          {FACE_POINTS.map(([x, y], i) => (
            <i key={i} style={{ left: `${x}%`, top: `${y}%`, "--i": i }} />
          ))}
        </span>
        <span className="fx-wave">
          {range(28).map((i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </span>
      </>
    ),
  },

  // Dokumentasi: halaman docs yang "ditulis"
  docs: {
    color: "#4f8cff",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-doc">
          <span className="fx-doc-bar">
            <i />
            <i />
            <i />
            <em>docs / instalasi</em>
          </span>
          <b># Instalasi</b>
          {[92, 74, 86, 58].map((w, i) => (
            <span key={i} className="fx-doc-line" style={{ "--w": `${w}%`, "--i": i }} />
          ))}
          <code>$ pip install -r requirements.txt</code>
        </span>
      </>
    ),
  },

  // Bot musik: equalizer dan not balok melayang
  equalizer: {
    color: "#a58bff",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-eq">
          {range(16).map((i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </span>
        {["♪", "♫", "♩", "♬", "♪", "♫"].map((n, i) => (
          <span key={i} className="fx-note" style={{ "--i": i, "--x": `${8 + i * 16}%` }}>
            {n}
          </span>
        ))}
        <span className="fx-now">
          <i /> Now playing
        </span>
      </>
    ),
  },

  // Lirik + romaji: mode karaoke
  romaji: {
    color: "#ff5ca8",
    render: () => (
      <>
        <span className="fx-dim fx-dim-strong" />
        {["歌", "星", "音"].map((k, i) => (
          <span key={k} className="fx-kanji" style={{ "--i": i }}>
            {k}
          </span>
        ))}
        <span className="fx-lyric">
          <span className="fx-jp" data-text="星に願いを">
            星に願いを
          </span>
          <span className="fx-romaji">hoshi ni negai wo</span>
        </span>
      </>
    ),
  },

  // Banner gacha: cahaya pull + bintang rarity
  gacha: {
    color: "#ffcf5c",
    render: () => (
      <>
        <span className="fx-dim fx-dim-strong" />
        <span className="fx-beam" />
        {range(12).map((i) => (
          <span key={i} className="fx-spark" style={{ "--i": i, "--a": `${i * 30}deg` }} />
        ))}
        <span className="fx-rarity">
          {range(6).map((i) => (
            <i key={i} style={{ "--i": i }}>
              ★
            </i>
          ))}
        </span>
      </>
    ),
  },

  // MangaDex: speed lines dan efek suara manga
  manga: {
    color: "#ff7a45",
    render: () => (
      <>
        <span className="fx-speed" />
        <span className="fx-halftone" />
        <span className="fx-pill">✓ Reading</span>
        <span className="fx-sfx">ドン!</span>
      </>
    ),
  },

  // Jadwal streaming: lonceng notifikasi + daftar jadwal
  live: {
    color: "#3fb8ff",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-bell">
          <HiOutlineBell />
        </span>
        <span className="fx-schedule">
          {SCHEDULE.map(([time, label, live], i) => (
            <span key={time} style={{ "--i": i }}>
              <b>{time}</b> {label}
              {live && <em>LIVE</em>}
            </span>
          ))}
        </span>
      </>
    ),
  },

  // Game RPG: blok pixel yang ditumpuk (stack) + level up
  pixel: {
    color: "#6ee7b7",
    render: () => (
      <>
        <span className="fx-crt" />
        <span className="fx-hearts">♥♥♥</span>
        <span className="fx-stack">
          {range(4).map((i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </span>
        <span className="fx-levelup">LEVEL UP!</span>
      </>
    ),
  },

  // Reservasi GOR: bola memantul di lapangan + booking berhasil
  bounce: {
    color: "#22c55e",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-court" />
        <span className="fx-ball-x">
          <span className="fx-ball" />
          <span className="fx-ball-shadow" />
        </span>
        <span className="fx-toast">
          <HiCheckCircle /> Lapangan 2 · 19:00 dibooking
        </span>
      </>
    ),
  },

  // Aplikasi desktop Java: jendela aplikasi terbuka
  window: {
    color: "#f89820",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-win">
          <span className="fx-win-bar">
            <i />
            <i />
            <i />
            <em>GORKharisma.jar</em>
          </span>
          <span className="fx-win-body">
            {range(3).map((i) => (
              <span key={i} className="fx-win-row" style={{ "--i": i }} />
            ))}
            <span className="fx-progress">
              <i />
            </span>
          </span>
        </span>
        <svg className="fx-pointer" viewBox="0 0 16 22" aria-hidden="true">
          <path d="M1 1v17l4.5-4.2L8.6 21l3-1.3-3-6.9H15L1 1z" />
        </svg>
      </>
    ),
  },

  // Kompas kiblat: jarum yang mencari arah
  compass: {
    color: "#2dd4bf",
    render: () => (
      <>
        <span className="fx-dim fx-dim-strong" />
        <span className="fx-compass">
          <span className="fx-compass-ticks" />
          {["U", "T", "S", "B"].map((d, i) => (
            <b key={d} className={`fx-dir fx-dir-${i}`}>
              {d}
            </b>
          ))}
          <span className="fx-needle" />
        </span>
        <span className="fx-qibla">Arah kiblat · 295°</span>
      </>
    ),
  },

  // Kriptografi: hujan kode + Caesar cipher
  cipher: {
    color: "#00e58f",
    render: () => (
      <>
        <span className="fx-dim fx-dim-strong" />
        <span className="fx-rain">
          {RAIN.map((s, i) => (
            <i
              key={i}
              style={{ "--x": `${4 + i * 8}%`, "--d": `${1.8 + ((i * 7) % 5) * 0.35}s`, "--i": i }}
            >
              {s}
            </i>
          ))}
        </span>
        <span className="fx-caesar">
          {[..."HELLO"].map((ch, i) => (
            <span key={i} style={{ "--i": i }}>
              <b>{ch}</b>
              <b>{caesar(ch)}</b>
            </span>
          ))}
        </span>
        <span className="fx-caesar-key">shift +3 → LSB</span>
      </>
    ),
  },

  // Rakun web: rating dari analisis sentimen + pembayaran
  rating: {
    color: "#ffcf5c",
    render: () => (
      <>
        <span className="fx-dim" />
        {["😊", "👍", "❤️", "😍", "🎮"].map((e, i) => (
          <span key={i} className="fx-emoji" style={{ "--i": i, "--x": `${10 + i * 19}%` }}>
            {e}
          </span>
        ))}
        <span className="fx-rating">
          {range(5).map((i) => (
            <i key={i} style={{ "--i": i }}>
              ★
            </i>
          ))}
          <b>4.9</b>
        </span>
        <span className="fx-toast">
          <HiCheckCircle /> Pembayaran Midtrans berhasil
        </span>
      </>
    ),
  },

  // Rakun mobile: notifikasi di layar ponsel
  notify: {
    color: "#ffb547",
    render: () => (
      <>
        <span className="fx-dim" />
        <span className="fx-phone">
          {[
            ["✓", "Rakun Games", "Pembayaran berhasil"],
            ["★", "Rekomendasi", "Agen terbaik · 4.9"],
          ].map(([icon, title, body], i) => (
            <span key={title} className="fx-notif" style={{ "--i": i }}>
              <span className="fx-notif-icon">{icon}</span>
              <span>
                <b>{title}</b>
                {body}
              </span>
            </span>
          ))}
        </span>
      </>
    ),
  },

  // Bot Discord: percakapan dengan bot
  chat: {
    color: "#5865f2",
    render: () => (
      <>
        <span className="fx-dim fx-dim-strong" />
        <span className="fx-chat">
          <span className="fx-msg" style={{ "--i": 0 }}>
            <i className="fx-avatar" />
            <span>
              <b>daffa</b>/latest
            </span>
          </span>
          <span className="fx-msg" style={{ "--i": 1 }}>
            <i className="fx-avatar fx-avatar-bot" />
            <span>
              <b>
                HoloSong <em>BOT</em>
              </b>
              ♪ Lagu terbaru sudah rilis!
            </span>
          </span>
          <span className="fx-typing" style={{ "--i": 2 }}>
            <i />
            <i />
            <i />
          </span>
        </span>
      </>
    ),
  },

  // Cadangan untuk project tanpa `fx`
  sparkle: {
    color: "#a58bff",
    render: () => (
      <>
        <span className="fx-dim fx-dim-soft" />
        {range(10).map((i) => (
          <span
            key={i}
            className="fx-twinkle"
            style={{ "--i": i, left: `${(i * 37) % 90 + 5}%`, top: `${(i * 53) % 80 + 10}%` }}
          />
        ))}
      </>
    ),
  },
};

export const fxColor = (name) => (EFFECTS[name] || EFFECTS.sparkle).color;

const EXIT_MS = 300;

export default function ProjectFx({ name, playing }) {
  const effect = EFFECTS[name] || EFFECTS.sparkle;
  // "out" = tidak dirender, "in" = berjalan, "leaving" = memudar sebelum dilepas.
  const [state, setState] = useState(playing ? "in" : "out");

  useEffect(() => {
    if (playing) {
      setState("in");
      return;
    }
    setState((s) => (s === "out" ? s : "leaving"));
    const t = setTimeout(() => setState("out"), EXIT_MS);
    return () => clearTimeout(t);
  }, [playing]);

  if (state === "out") return null;

  return (
    <div className={`fx ${state === "leaving" ? "is-leaving" : ""}`} aria-hidden="true">
      {effect.render()}
    </div>
  );
}
