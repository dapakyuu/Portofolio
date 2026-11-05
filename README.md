# Portofolio — Daffa Al-Fathir Ismail

Website portofolio pribadi yang dibangun dengan **React + Vite**.

## Menjalankan

```bash
npm install      # sekali saja
npm run dev      # mode pengembangan → http://localhost:5173
npm run build    # build produksi ke folder dist/
npm run preview  # cek hasil build secara lokal
```

## Menambah project baru ke carousel

1. Simpan screenshot project di `public/assets/`.
2. Buka `src/data/projects.js`, lalu tambahkan objek baru di **paling atas** array:

```js
{
  title: "Nama Project",
  description: "Deskripsi singkat project.",
  image: "assets/nama-gambar.png",
  category: "Web",               // Web / Mobile / Game / Desktop / Bot / Extension / kategori baru
  tech: ["React", "Node.js"],    // opsional
  github: "https://github.com/dapakyuu/...", // opsional
  demo: "https://...",           // opsional, memunculkan tombol Live Demo
  demoLabel: "Install Script",   // opsional, ganti teks tombol demo
  highlight: "Terbaru",          // opsional, badge berwarna
},
```

Carousel, filter kategori, dan jumlah project di bagian "Tentang" ikut berubah otomatis.

## Struktur

```
public/assets/        gambar & model 3D
src/data/             isi konten (projects.js, profile.js)
src/components/       komponen tiap section
src/hooks/            hook kecil (animasi scroll, navbar aktif, media query)
src/index.css         seluruh styling
```

## Deploy

Live di **https://daffa.forensa.tech** (VPS Hostinger, Docker + Traefik).

Setiap push ke `master` otomatis di-build, diuji, dan di-deploy ke VPS oleh
GitHub Actions lewat Hostinger API / Docker Manager
(`.github/workflows/deploy.yml`), sama seperti Forensa.

Tutorial lengkap (membuat subdomain, setup VPS, dan GitHub Actions):
**[docs/DEPLOY.md](docs/DEPLOY.md)**

Menjalankan versi Docker di komputer sendiri:

```bash
docker build -t daffa-portofolio .
docker run --rm -p 8080:80 daffa-portofolio   # buka http://localhost:8080
```
