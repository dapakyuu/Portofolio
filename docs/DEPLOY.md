# Tutorial Deploy Portofolio ke VPS Hostinger

Target akhir: portofolio bisa dibuka di **https://daffa.forensa.tech**, dan setiap
kali kamu `git push` ke branch `master`, VPS otomatis ikut ter-update.

```
 Kamu ──git push──▶ GitHub ──GitHub Actions──▶ VPS Hostinger (187.52.122.64)
                                                 │
                     Pengunjung ──HTTPS──▶ Traefik (sudah ada, dipakai Forensa)
                                                 ├──▶ forensa.tech       → container Forensa
                                                 └──▶ daffa.forensa.tech → container portofolio
```

VPS kamu sudah menjalankan **Traefik** (reverse proxy yang dipakai Forensa).
Portofolio cukup "menumpang" ke Traefik lewat label di `docker-compose.yml`, jadi:

- tidak perlu membuka port baru di firewall,
- sertifikat HTTPS (Let's Encrypt) dibuat otomatis oleh Traefik,
- Forensa tidak terganggu sama sekali.

---

## Daftar isi

1. [Buat subdomain `daffa.forensa.tech`](#1-buat-subdomain-daffaforensatech)
2. [Masuk ke VPS & cek Traefik](#2-masuk-ke-vps--cek-traefik)
3. [Deploy pertama secara manual](#3-deploy-pertama-secara-manual)
4. [Hubungkan GitHub Actions ke VPS](#4-hubungkan-github-actions-ke-vps)
5. [Uji deploy otomatis](#5-uji-deploy-otomatis)
6. [Pemakaian sehari-hari](#6-pemakaian-sehari-hari)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Buat subdomain `daffa.forensa.tech`

Domain `forensa.tech` memakai nameserver Hostinger (`dns-parking.com`), jadi
subdomain cukup dibuat dengan menambah **DNS record** di hPanel.

1. Login ke [hPanel Hostinger](https://hpanel.hostinger.com).
2. Buka **Domains** → pilih **forensa.tech** → **DNS / Nameservers**.
3. Di bagian **Manage DNS records**, tambahkan record baru:

   | Type | Name    | Points to       | TTL   |
   |------|---------|-----------------|-------|
   | `A`  | `daffa` | `187.52.122.64` | `300` |

   > Isi **Name** hanya `daffa`, bukan `daffa.forensa.tech`. Hostinger otomatis
   > menambahkan `.forensa.tech` di belakangnya.

4. Klik **Add Record**.

> ⚠️ Jangan pakai menu **Websites → Subdomains**. Menu itu untuk shared hosting,
> bukan VPS. Untuk VPS cukup A record seperti di atas.

**Cek apakah DNS sudah aktif** (biasanya 5–30 menit, paling lama beberapa jam).
Jalankan di komputer kamu:

```bash
nslookup daffa.forensa.tech 8.8.8.8
```

Sudah benar jika hasilnya menampilkan `Address: 187.52.122.64`.

---

## 2. Masuk ke VPS & cek Traefik

Masuk ke VPS lewat **hPanel → VPS → Browser terminal**, atau dari terminal komputer:

```bash
ssh root@187.52.122.64
```

Lihat container yang sedang berjalan:

```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
```

Pastikan ada container **traefik** yang memakai port `80` dan `443`, serta
container Forensa. Kalau Traefik ada, langkah berikutnya bisa dilanjutkan.

Pastikan juga Docker Compose tersedia:

```bash
docker compose version
```

---

## 3. Deploy pertama secara manual

Deploy pertama dilakukan manual agar kita yakin semuanya berjalan sebelum
diotomatiskan.

```bash
# 1. Ambil source code dari GitHub
git clone https://github.com/dapakyuu/Portofolio.git /opt/portofolio
cd /opt/portofolio

# 2. Build image & jalankan container (build pertama ±1–3 menit)
docker compose up -d --build

# 3. Cek status, tunggu sampai kolom STATUS menunjukkan "(healthy)"
docker compose ps
```

### Uji dari dalam VPS (tanpa menunggu DNS)

```bash
# Harus menjawab "301 Moved Permanently" ke https:// (redirect HTTP → HTTPS)
curl -I -H "Host: daffa.forensa.tech" http://127.0.0.1

# Harus menjawab "HTTP/2 200"
curl -kI --resolve daffa.forensa.tech:443:127.0.0.1 https://daffa.forensa.tech
```

### Uji dari browser

Setelah DNS di langkah 1 aktif, buka **https://daffa.forensa.tech**.

Saat dibuka pertama kali, Traefik butuh beberapa detik untuk meminta sertifikat
HTTPS ke Let's Encrypt. Kalau muncul peringatan sertifikat, tunggu ±1 menit lalu
refresh. Kalau belum berhasil juga, lihat [Troubleshooting](#7-troubleshooting).

---

## 4. Hubungkan GitHub Actions ke VPS

Workflow ada di `.github/workflows/deploy.yml`. Setiap push ke `master`:

1. **Build** — GitHub membangun image Docker dan menguji bahwa halaman bisa dibuka.
   Kalau gagal, deploy dibatalkan dan VPS tidak tersentuh.
2. **Deploy** — GitHub masuk ke VPS lewat SSH, menyamakan isi `/opt/portofolio`
   dengan GitHub (`git reset --hard`), lalu menjalankan `docker compose up -d --build`.

Agar GitHub bisa masuk ke VPS, kita buat **SSH key khusus** untuk GitHub Actions.

### 4.1 Buat SSH key di VPS

Jalankan di VPS:

```bash
# Buat pasangan key baru khusus untuk GitHub Actions (tanpa passphrase)
ssh-keygen -t ed25519 -C "github-actions-portofolio" -f ~/.ssh/github_actions_portofolio -N ""

# Izinkan key ini untuk login ke VPS
cat ~/.ssh/github_actions_portofolio.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Tampilkan PRIVATE key untuk disalin ke GitHub
cat ~/.ssh/github_actions_portofolio
```

Salin **seluruh** output perintah terakhir, termasuk baris
`-----BEGIN OPENSSH PRIVATE KEY-----` dan `-----END OPENSSH PRIVATE KEY-----`.

### 4.2 Simpan sebagai Secret di GitHub

1. Buka https://github.com/dapakyuu/Portofolio/settings/secrets/actions
   (**Settings → Secrets and variables → Actions**).
2. Klik **New repository secret**, lalu tambahkan satu per satu:

   | Name          | Value                                       |
   |---------------|---------------------------------------------|
   | `VPS_HOST`    | `187.52.122.64`                             |
   | `VPS_USER`    | `root`                                      |
   | `VPS_SSH_KEY` | private key yang disalin di langkah 4.1     |

   Opsional (hanya jika berbeda dari default):

   | Name          | Default           | Kapan diisi                            |
   |---------------|-------------------|----------------------------------------|
   | `VPS_PORT`    | `22`              | Jika port SSH VPS kamu diganti         |
   | `VPS_APP_DIR` | `/opt/portofolio` | Jika project disimpan di folder lain   |

### 4.3 Hapus private key dari VPS

Private key sudah tersimpan di GitHub dan tidak dibutuhkan lagi di VPS:

```bash
rm ~/.ssh/github_actions_portofolio
```

(File `.pub` boleh dibiarkan. Yang dipakai VPS adalah isi `authorized_keys`.)

> **Pakai user selain root?** Pastikan user tersebut bisa menjalankan Docker
> tanpa `sudo` dan memiliki folder project:
>
> ```bash
> sudo usermod -aG docker NAMA_USER
> sudo chown -R NAMA_USER:NAMA_USER /opt/portofolio
> ```
>
> Logout lalu login lagi agar grup `docker` aktif, dan isi `VPS_USER` dengan
> `NAMA_USER`. Langkah 4.1 juga dijalankan sebagai user tersebut.

---

## 5. Uji deploy otomatis

**Cara 1 — jalankan manual:**
buka tab **Actions** di GitHub → pilih **Build & Deploy ke VPS** → **Run workflow**.

**Cara 2 — push perubahan:**

```bash
git add .
git commit -m "Coba deploy otomatis"
git push
```

Buka tab **Actions** untuk melihat prosesnya. Kalau kedua job (**Build & uji
image Docker** dan **Deploy ke VPS Hostinger**) bercentang hijau, website
sudah ter-update. Total waktunya biasanya 2–4 menit.

---

## 6. Pemakaian sehari-hari

Alurnya cukup seperti ini:

1. Ubah project di komputer, misalnya menambah project di `src/data/projects.js`.
2. Cek di lokal dengan `npm run dev`.
3. `git add .` → `git commit -m "..."` → `git push`.
4. Tunggu centang hijau di tab Actions, lalu website otomatis ter-update.

> Jangan mengedit file langsung di VPS (`/opt/portofolio`). Setiap deploy
> menjalankan `git reset --hard`, jadi perubahan di VPS akan tertimpa isi GitHub.

### Perintah berguna di VPS

```bash
cd /opt/portofolio

docker compose ps            # status container
docker compose logs -f       # lihat log (Ctrl+C untuk keluar)
docker compose restart       # restart container
docker compose down          # matikan portofolio (Forensa tidak terpengaruh)
docker compose up -d --build # build ulang & jalankan manual
```

### Kembali ke versi sebelumnya (rollback)

Cara paling aman adalah lewat Git, agar GitHub dan VPS tetap sinkron:

```bash
git revert HEAD   # batalkan commit terakhir
git push          # VPS otomatis ikut kembali ke versi sebelumnya
```

---

## 7. Troubleshooting

### `404 page not found` (teks polos, dari Traefik)

Traefik berjalan, tetapi belum mengenali container portofolio.

- Cek container berjalan: `docker compose ps`.
- Cek label terbaca: `docker inspect daffa-portofolio --format '{{json .Config.Labels}}'`.
- Pastikan nama domain di `docker-compose.yml` tepat `daffa.forensa.tech`.

### `Bad Gateway` atau `Gateway Timeout`

Traefik mengenali container, tetapi tidak bisa menjangkaunya karena beda jaringan
Docker. Cek jaringan yang dipakai Traefik:

```bash
docker inspect -f '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' NAMA_CONTAINER_TRAEFIK
```

Jika Traefik ada di jaringan tertentu (misalnya `traefik-proxy`), sambungkan
portofolio ke jaringan itu. Ubah bagian `networks` di `docker-compose.yml`:

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

- Pastikan DNS sudah mengarah ke VPS (`nslookup daffa.forensa.tech 8.8.8.8`).
  Let's Encrypt hanya bisa menerbitkan sertifikat kalau domain sudah aktif.
- Pastikan nama certresolver sama dengan yang dipakai Traefik. Portofolio memakai
  `letsencrypt`, sama seperti Forensa. Cek log Traefik:
  `docker logs NAMA_CONTAINER_TRAEFIK 2>&1 | grep -i daffa`.

### Job "Deploy" gagal: `ssh: handshake failed` / `unable to authenticate`

- Isi `VPS_SSH_KEY` harus **private key** (bukan `.pub`), lengkap dengan baris BEGIN/END.
- Public key-nya harus ada di `~/.ssh/authorized_keys` milik user di `VPS_USER`.
- Firewall Hostinger harus mengizinkan port SSH (22) dari internet, karena IP
  server GitHub Actions selalu berubah.

### Job "Deploy" gagal: `permission denied ... docker.sock`

User di `VPS_USER` tidak punya akses Docker. Lihat catatan **Pakai user selain
root?** di langkah 4.3.

### Job "Build" gagal

Error-nya ada di log job. Biasanya kode tidak bisa di-build. Jalankan
`npm run build` di komputer untuk melihat error yang sama, perbaiki, lalu push lagi.
Selama job Build gagal, VPS tetap menjalankan versi lama yang masih berfungsi.
