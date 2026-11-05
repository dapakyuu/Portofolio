# Tutorial Deploy Portofolio ke VPS Hostinger (Docker Manager)

Target akhir: portofolio bisa dibuka di **https://daffa.forensa.tech**, dan setiap
kali kamu `git push` ke branch `master`, VPS otomatis ikut ter-update.
**Semua langkah dilakukan lewat hPanel dan GitHub, tanpa terminal VPS.**

```
 Kamu ──git push──▶ GitHub Actions ──Hostinger API──▶ Docker Manager di VPS
                                                        │  (build dari GitHub)
                     Pengunjung ──HTTPS──▶ Traefik (sudah ada, dipakai Forensa)
                                                        ├──▶ forensa.tech       → Forensa
                                                        └──▶ daffa.forensa.tech → portofolio
```

Cara kerjanya sama dengan Forensa:

- GitHub Actions mengirim `docker-compose.yml` ke **Hostinger API** memakai API key.
- Docker Manager mengambil source code langsung dari GitHub pada commit terbaru,
  lalu mem-build dan menjalankannya sebagai project **portofolio**.
- **Traefik** yang sudah berjalan di VPS meneruskan `daffa.forensa.tech` ke
  container portofolio dan membuat sertifikat HTTPS secara otomatis.
  Tidak perlu membuka port baru, dan Forensa tidak terganggu.

---

## Daftar isi

1. [Buat subdomain `daffa.forensa.tech`](#1-buat-subdomain-daffaforensatech)
2. [Siapkan API key & VM ID Hostinger](#2-siapkan-api-key--vm-id-hostinger)
3. [Simpan ke GitHub](#3-simpan-ke-github)
4. [Jalankan deploy pertama](#4-jalankan-deploy-pertama)
5. [Cek hasilnya](#5-cek-hasilnya)
6. [Pemakaian sehari-hari](#6-pemakaian-sehari-hari)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Buat subdomain `daffa.forensa.tech`

Domain `forensa.tech` memakai nameserver Hostinger, jadi subdomain cukup dibuat
dengan menambah **DNS record**.

1. Login ke [hPanel Hostinger](https://hpanel.hostinger.com).
2. Buka **Domains** → pilih **forensa.tech** → **DNS / Nameservers**.
3. Di bagian **Manage DNS records**, tambahkan record:

   | Type | Name    | Points to       | TTL   |
   |------|---------|-----------------|-------|
   | `A`  | `daffa` | `187.52.122.64` | `300` |

   > Isi **Name** hanya `daffa`, bukan `daffa.forensa.tech`. Hostinger otomatis
   > menambahkan `.forensa.tech` di belakangnya.

4. Klik **Add Record**.

> ⚠️ Jangan pakai menu **Websites → Subdomains**. Menu itu untuk shared hosting,
> bukan VPS.

**Cek DNS sudah aktif** (biasanya 5–30 menit). Jalankan di komputer kamu:

```bash
nslookup daffa.forensa.tech 8.8.8.8
```

Sudah benar jika hasilnya menampilkan `Address: 187.52.122.64`.
Kamu juga bisa cek lewat https://dnschecker.org/#A/daffa.forensa.tech.

---

## 2. Siapkan API key & VM ID Hostinger

### API key

Kamu boleh memakai API key yang sama dengan Forensa. Tapi nilai secret yang sudah
tersimpan di GitHub tidak bisa dilihat lagi, jadi kalau kamu tidak menyimpan
salinannya, buat key baru:

1. Buka **hPanel → Profile → API** (https://hpanel.hostinger.com/profile/api).
2. Klik **Generate token** (atau **New token**), beri nama misalnya
   `github-portofolio`, lalu salin token-nya.
   Token hanya ditampilkan sekali, jadi simpan sampai langkah 3 selesai.

### VM ID

1. Buka **hPanel → VPS** → pilih VPS kamu.
2. Lihat URL di browser, contohnya `https://hpanel.hostinger.com/vps/123456/overview`.
   Angka `123456` itulah **VM ID**.
   (Jika hostname VPS masih default, misalnya `srv123456.hstgr.cloud`, VM ID-nya
   juga `123456`.)

VM ID-nya sama dengan yang dipakai Forensa, karena kedua project berada di VPS yang sama.

---

## 3. Simpan ke GitHub

Buka https://github.com/dapakyuu/Portofolio/settings/secrets/actions
(**Settings → Secrets and variables → Actions**).

**Tab "Secrets"** → **New repository secret**:

| Name                | Value                         |
|---------------------|-------------------------------|
| `HOSTINGER_API_KEY` | API key dari langkah 2        |

**Tab "Variables"** → **New repository variable**:

| Name              | Value                          |
|-------------------|--------------------------------|
| `HOSTINGER_VM_ID` | VM ID dari langkah 2, mis. `123456` |

> Secret dan variable bersifat **per repository**. Walaupun Forensa sudah punya,
> repo Portofolio tetap harus diisi sendiri.

---

## 4. Jalankan deploy pertama

1. Buka tab **Actions** di https://github.com/dapakyuu/Portofolio/actions.
2. Pilih workflow **Build & Deploy ke VPS** di sebelah kiri.
3. Klik **Run workflow** → **Run workflow**.

Workflow terdiri dari dua job:

| Job                          | Fungsi                                                              |
|------------------------------|---------------------------------------------------------------------|
| **Build & uji image Docker** | Mem-build image dan memastikan halaman bisa dibuka. Kalau gagal, deploy dibatalkan. |
| **Deploy ke VPS Hostinger**  | Mengirim perintah deploy ke Hostinger API.                          |

Tunggu sampai keduanya bercentang hijau ✅ (±2–5 menit).

> Kalau job Deploy hijau tetapi ada peringatan *"belum diisi. Deploy dilewati"*,
> berarti secret atau variable di langkah 3 belum tersimpan atau namanya salah ketik.

---

## 5. Cek hasilnya

### Di Docker Manager

1. Buka **hPanel → VPS → Docker Manager**.
2. Akan muncul project baru bernama **portofolio** di samping project Forensa.
3. Pastikan statusnya **Running**, dan container-nya **healthy** jika ditampilkan.
4. Klik project → **Logs** untuk melihat log build dan log container.

Build pertama di VPS biasanya 1–3 menit. Selama build berlangsung, statusnya
belum Running.

### Di browser

Buka **https://daffa.forensa.tech**.

Saat dibuka pertama kali, Traefik butuh beberapa detik untuk meminta sertifikat
HTTPS ke Let's Encrypt. Kalau muncul peringatan sertifikat, tunggu ±1 menit lalu
refresh.

---

## 6. Pemakaian sehari-hari

1. Ubah project di komputer, misalnya menambah project di `src/data/projects.js`.
2. Cek di lokal dengan `npm run dev`.
3. Upload ke GitHub:

   ```bash
   git add .
   git commit -m "Tambah project baru"
   git push
   ```

4. GitHub Actions otomatis build dan deploy. Setelah centang hijau dan build di
   Docker Manager selesai, website sudah ter-update.

> Jangan mengedit compose project ini langsung di Docker Manager. Setiap deploy
> dari GitHub akan menimpa perubahan tersebut. Ubah `docker-compose.yml` di repo
> lalu push.

### Kembali ke versi sebelumnya (rollback)

```bash
git revert HEAD   # batalkan commit terakhir
git push          # VPS otomatis kembali ke versi sebelumnya
```

### Mematikan / restart

Lewat **Docker Manager** → project **portofolio** → tombol **Stop**, **Restart**,
atau **Delete**. Forensa tidak terpengaruh.

---

## 7. Troubleshooting

### Job "Build & uji image Docker" gagal

Kode tidak bisa di-build. Buka log job di tab Actions untuk melihat error-nya,
atau jalankan `npm run build` di komputer. Perbaiki, lalu push lagi.
Selama build gagal, VPS tetap menjalankan versi lama.

### Job "Deploy" gagal dengan error `401` / `Unauthorized`

API key salah atau sudah dihapus. Buat token baru (langkah 2), lalu perbarui
secret `HOSTINGER_API_KEY`.

### Job "Deploy" gagal dengan error VM tidak ditemukan / `404`

`HOSTINGER_VM_ID` salah. Pastikan isinya hanya angka dari URL hPanel (langkah 2),
dan disimpan di tab **Variables**, bukan Secrets.

### Project gagal di Docker Manager (status Error / Exited)

Buka **Docker Manager → portofolio → Logs**.

- Error saat mengambil `github.com/...Portofolio.git`: pastikan repo tetap
  **public**. Jika repo dijadikan private, VPS butuh deploy key (lihat
  [panduan Hostinger](https://www.hostinger.com/support/how-to-deploy-from-private-github-repository-on-hostinger-docker-manager/)).
- Error `npm ci` / `vite build`: biasanya juga tertangkap di job Build GitHub.
  Lihat bagian di atas.

### `404 page not found` (teks polos)

Halaman ini berasal dari Traefik: Traefik berjalan, tetapi belum mengenali
container portofolio.

- Pastikan project **portofolio** berstatus Running di Docker Manager.
- Pastikan domain di `docker-compose.yml` tepat `daffa.forensa.tech`.

### `Bad Gateway` atau `Gateway Timeout`

Traefik mengenali container, tetapi tidak bisa menjangkaunya karena berada di
jaringan Docker yang berbeda. Lihat project **Traefik** di Docker Manager untuk
mengetahui nama jaringannya (misalnya `traefik-proxy`). Lalu ubah
`docker-compose.yml` di repo:

```yaml
services:
  portofolio:
    # ...
    labels:
      # ... label yang sudah ada, tambahkan:
      - "traefik.docker.network=traefik-proxy"
    networks:
      - traefik-proxy

networks:
  traefik-proxy:
    external: true
```

Commit dan push. Deploy otomatis akan menerapkan perubahannya.

### Sertifikat HTTPS tidak valid / "Not secure"

- Pastikan DNS sudah aktif (langkah 1). Let's Encrypt hanya bisa menerbitkan
  sertifikat kalau domain sudah mengarah ke VPS.
- Setelah DNS aktif, **Restart** project portofolio di Docker Manager agar
  Traefik mencoba lagi.

---

## Lampiran: menjalankan image Docker di komputer sendiri

```bash
docker build -t daffa-portofolio .
docker run --rm -p 8080:80 daffa-portofolio   # buka http://localhost:8080
```

`docker-compose.yml` memang disiapkan untuk VPS (mengambil source dari GitHub).
Untuk mencoba perubahan lokal yang belum di-push, gunakan dua perintah di atas
atau `npm run dev`.
