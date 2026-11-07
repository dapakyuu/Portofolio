/**
 * DAFTAR PROJECT
 * ----------------------------------------------------------------------------
 * Untuk menambah project baru:
 *   1. Simpan gambar screenshot di folder  public/assets/
 *   2. Tambahkan satu objek baru di PALING ATAS array ini
 *      (project paling atas tampil pertama di carousel).
 *
 * Field:
 *   title       (wajib)  Judul project
 *   description (wajib)  Deskripsi singkat
 *   image       (wajib)  Path gambar, contoh: "assets/nama-gambar.png"
 *   category    (wajib)  Dipakai untuk filter, mis. "Web", "Mobile", "Game",
 *                        "Desktop", "Bot", "Extension". Kategori baru otomatis muncul.
 *   tech        (opsional) Daftar teknologi, tampil sebagai label kecil
 *   github      (opsional) Link repository GitHub
 *   demo        (opsional) Link demo / website live
 *   demoLabel   (opsional) Teks tombol demo, default "Live Demo"
 *   highlight   (opsional) Teks badge khusus, mis. "Publikasi Jurnal"
 *   fx          (opsional) Animasi khusus saat kartu di-hover. Pilihan: scan, ticker,
 *                        interview, docs, equalizer, romaji, gacha, manga, live, pixel,
 *                        bounce, window, compass, cipher, rating, notify, chat, sparkle.
 *                        Lihat src/components/ProjectFx.jsx. Default: sparkle.
 */
export const projects = [
  {
    title: "Forensa — Verifikasi Dokumen Berbasis AI",
    fx: "scan",
    description:
      "Aplikasi web untuk memeriksa keaslian dokumen pendidikan PDF melalui AI. Project ini merupakan hasil dari penelitian afirmasi salah satu dosen teknik komputer UPI.",
    image: "assets/forensa.png",
    category: "Web",
    tech: ["Python", "TensorFlow", "FastAPI", "Supabase", "Docker"],
    github: "https://github.com/dapakyuu/DigitalForensik",
    demo: "https://forensa.tech/",
    highlight: "Publikasi Jurnal",
  },
  {
    title: "Web Portal Berita Winnicode",
    fx: "ticker",
    description:
      "Hasil magang di PT. Winnicode Garuda Teknologi. Portal berita berbasis Laravel yang mengintegrasikan NewsAPI, API cuaca BMKG, dan API livescore untuk klasemen sepak bola.",
    image: "assets/winnicode_portalberita.png",
    category: "Web",
    tech: ["Laravel", "NewsAPI", "AdminLTE"],
    github: "https://github.com/dapakyuu/WinnicodePortalBerita",
    demo: "https://winnicode.forensa.tech/",
    highlight: "Magang",
  },
  {
    title: "AI-Powered Interview Assessment System",
    fx: "interview",
    description:
      "Aplikasi web yang menilai kemampuan kandidat melalui wawancara berbasis AI serta analisis multimodal. Project ini terpilih sebagai Best Capstone Project di program Studi Independen ASAH by Dicoding.",
    image: "assets/analisis_interview.png",
    category: "Web",
    tech: ["FastAPI", "Whisper", "LLM", "MediaPipe", "DeepL"],
    github: "https://github.com/dapakyuu/Interview_Assesment_System",
    demo: "https://interview-assesment-system.vercel.app/",
    highlight: "Best Capstone",
  },
  {
    title: "Dokumentasi AI Interview Assessment System",
    fx: "docs",
    description:
      "Website dokumentasi untuk AI-Powered Interview Assessment System yang dibangun dengan MkDocs Material, berisi panduan instalasi, cara penggunaan, dan referensi API.",
    image: "assets/mkdocs_interview.png",
    category: "Web",
    tech: ["MkDocs", "Material Theme", "Vercel"],
    github: "https://github.com/dapakyuu/Interview_Assesment_System",
    demo: "https://interview-assesment-system-docs.vercel.app/",
  },
  {
    title: "Bot Discord Stellar",
    fx: "equalizer",
    description:
      "Bot Discord musik dan karaoke yang memutar audio dari YouTube di voice channel serta menampilkan lirik dan romaji Jepang. Mendukung prefix st. dan slash command.",
    image: "assets/bot_stellar.png",
    category: "Bot",
    tech: ["Python", "discord.py", "yt-dlp", "Gemini", "Docker"],
  },
  {
    title: "Extension Stellar — YouTube Lyrics Finder & Romaji",
    fx: "romaji",
    description:
      "Ekstensi browser untuk menampilkan lirik lagu di YouTube dari LRCLIB dan SimpMusic, mengubah kanji Jepang menjadi romaji, dilengkapi mode karaoke dan pengaturan timing offset.",
    image: "assets/extension_stellar.png",
    category: "Extension",
    tech: ["Chrome Extension", "JavaScript", "Kuroshiro", "LRCLIB"],
  },
  {
    title: "Bot Discord Arknights Banner",
    fx: "gacha",
    description:
      "Bot Discord yang menampilkan informasi banner headhunting dan event Arknights yang akan datang, mengambil data langsung dari Arknights Wiki melalui slash command.",
    image: "assets/bot_arknights.png",
    category: "Bot",
    tech: ["Node.js", "discord.js", "MediaWiki API"],
  },
  {
    title: "MangaDex Read Status Filter",
    fx: "manga",
    description:
      "Userscript Tampermonkey yang menambahkan filter berdasarkan status baca (Reading, Completed, Dropped, dll.) di halaman Advanced Search MangaDex, dengan filter yang tetap aktif saat berpindah halaman.",
    image: "assets/mangadex.jpg",
    category: "Extension",
    tech: ["Tampermonkey", "JavaScript", "MangaDex API"],
    github: "https://github.com/dapakyuu/mangadex_readstatus_filter",
    demo: "https://greasyfork.org/en/scripts/559036-mangadex-read-status-filter-for-advanced-search",
    demoLabel: "Install Script",
  },
  {
    title: "Website HoloBell",
    fx: "live",
    description:
      'Project "Website Hololive Streaming Schedule Berbasis PHP menggunakan Holodex API" dari mata kuliah Rekayasa Perangkat Lunak. Project ini menghasilkan artikel ilmiah yang diterbitkan di Jurnal Tekno Kompak Vol. 19, No. 1, Tahun 2025.',
    image: "assets/webhololive.png",
    category: "Web",
    tech: ["PHP", "Holodex API"],
    github: "https://github.com/dapakyuu/HoloBell",
    highlight: "Publikasi Jurnal",
  },
  {
    title: "Game RPG Berbasis Godot",
    fx: "pixel",
    description:
      "Game RPG dengan Godot Engine yang memiliki mini games bertema struktur data seperti stack, queue, dan sort, dibuat untuk tugas besar mata kuliah Struktur Data.",
    image: "assets/rpg-godot.png",
    category: "Game",
    tech: ["Godot"],
    github: "https://github.com/dapakyuu/RPG-Game_Godot",
  },
  {
    title: "Website GOR Kharisma",
    fx: "bounce",
    description:
      "Website berbasis PHP untuk mitra GOR Kharisma dengan fitur utama reservasi online agar memudahkan pelanggan. Dibuat untuk mata kuliah Proyek Konsultasi.",
    image: "assets/gor-web.png",
    category: "Web",
    tech: ["PHP"],
    github: "https://github.com/dapakyuu/GOR_Kharisma",
  },
  {
    title: "Aplikasi Desktop GOR Kharisma",
    fx: "window",
    description:
      "Aplikasi desktop berbasis Java untuk mitra GOR Kharisma dengan fitur utama yang sama seperti versi website dan database yang terkoneksi. Dibuat untuk mata kuliah Pemrograman Berbasis Objek.",
    image: "assets/gor-mobile.jpg",
    category: "Desktop",
    tech: ["Java"],
    github: "https://github.com/dapakyuu/GOR-Kharisma_Desktop",
  },
  {
    title: "Aplikasi Mobile Graha Bhakti Nusa",
    fx: "compass",
    description:
      "Luaran dari program pengabdian masyarakat bersama Yayasan Graha Bhakti Nusa untuk memudahkan pengguna dalam mengakses layanan yayasan.",
    image: "assets/gbn.png",
    category: "Mobile",
    tech: [],
    github: "https://github.com/dapakyuu/Kompas-Kiblat_GBN",
    highlight: "Pengabdian Kepada Masyarakat",
  },
  {
    title: "Website Kriptografi dan Steganografi",
    fx: "cipher",
    description:
      "Mengenkripsi pesan dengan Caesar Cipher yang dimodifikasi lalu menyisipkannya ke gambar dengan steganografi metode LSB. Web ini juga dapat mendekripsi pesan tersebut.",
    image: "assets/web_enkripsi.png",
    category: "Web",
    tech: ["Caesar Cipher", "Steganografi LSB"],
    github: "https://github.com/dapakyuu/Kriptografi-Steganografi_Kejarkom",
  },
  {
    title: "Website Rakun Games",
    fx: "rating",
    description:
      "Website PHP untuk usaha jasa rawat akun dan partner game online, dilengkapi sistem cerdas yang merekomendasikan agen berdasarkan analisis sentimen ulasan pelanggan, serta pembayaran via Midtrans.",
    image: "assets/web_rakun.png",
    category: "Web",
    tech: ["PHP", "Sentiment Analysis", "Midtrans"],
    github: "https://github.com/dapakyuu/RakunGames_Web",
  },
  {
    title: "Aplikasi Mobile Rakun Games",
    fx: "notify",
    description:
      "Versi mobile Rakun Games berbasis Flutter dengan sistem rekomendasi agen dari analisis sentimen ulasan pelanggan dan pembayaran melalui Midtrans.",
    image: "assets/mobile_rakun.png",
    category: "Mobile",
    tech: ["Flutter", "Sentiment Analysis", "Midtrans"],
    github: "https://github.com/dapakyuu/RakunGames_Mobile",
  },
  {
    title: "Bot Discord HoloSong",
    fx: "chat",
    description:
      "Bot Discord berbasis Node.js yang memanfaatkan Holodex API untuk menampilkan lagu terbaru member Hololive, detail lagu, dan link streaming secara otomatis.",
    image: "assets/bot_discord_holosong.png",
    category: "Bot",
    tech: ["Node.js", "Discord", "Holodex API"],
    github: "https://github.com/dapakyuu/Bot_HoloSong",
  },
];
