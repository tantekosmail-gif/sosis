# Panduan Penggunaan — MediaWatch

Dokumen ini menjelaskan cara menggunakan MediaWatch, platform monitoring media sosial & berita
berbasis AI. Versi ringkas dari panduan ini juga tersedia langsung di dalam aplikasi pada halaman
**Dokumentasi** (`/docs`, bisa diakses dari Settings → Tentang).

---

## Daftar Isi

1. [Apa itu MediaWatch?](#1-apa-itu-mediawatch)
2. [Mulai Menggunakan](#2-mulai-menggunakan)
3. [Dashboard Overview](#3-dashboard-overview)
4. [Monitoring Media Sosial](#4-monitoring-media-sosial)
5. [Berita](#5-berita)
6. [Bandingkan Platform](#6-bandingkan-platform)
7. [Cari Topik AI](#7-cari-topik-ai)
8. [Pengaturan (Settings)](#8-pengaturan-settings)
9. [Tips & Catatan Penting](#9-tips--catatan-penting)
10. [Untuk Developer](#10-untuk-developer)

---

## 1. Apa itu MediaWatch?

MediaWatch mengumpulkan, memantau, dan menganalisis percakapan publik dari berbagai platform, lalu
menyajikannya sebagai dashboard: statistik, sentimen publik (positif/netral/negatif), topik trending,
hingga ringkasan yang dihasilkan AI.

Platform yang dipantau:

- YouTube
- Instagram
- Facebook
- Twitter/X
- TikTok
- Berita (agregasi dari berbagai media daring)

Cocok dipakai oleh tim komunikasi, humas, riset pasar, atau siapa pun yang perlu memahami bagaimana
sebuah topik, brand, atau tokoh dibicarakan lintas platform.

## 2. Mulai Menggunakan

**Login** — masukkan Email dan Password di halaman login, lalu klik **Sign In**. Setelah berhasil,
kamu diarahkan ke halaman **Overview**.

> Tidak ada form pendaftaran (sign up) di aplikasi ini — akun disediakan oleh admin/backend, bukan
> secara mandiri lewat UI.

**Navigasi utama** (sidebar kiri, tampil di semua halaman):

| Menu | Fungsi |
|---|---|
| Overview | Ringkasan lintas semua platform |
| YouTube / Instagram / Facebook / Twitter/X / TikTok | Monitoring per platform |
| Berita | Trending & pencarian berita |
| Bandingkan Platform | Bandingkan satu topik di banyak platform |
| Cari Topik AI | Asisten chat untuk menemukan topik trending |
| Settings | Pengaturan akun, AI, dan analisis |

**Logout** — tombol Logout di header, atau **Logout Semua Sesi** di Settings → Akun untuk menghapus
semua data sesi di browser ini.

## 3. Dashboard Overview

Halaman pertama setelah login, berisi dua ringkasan:

- **Sentimen Publik Gabungan** — satu sentiment bar yang menggabungkan sentimen dari semua platform
  yang sudah dipantau (Instagram, Facebook, Twitter/X, TikTok, YouTube), dengan persentase dan jumlah
  untuk Positif/Netral/Negatif.
- **Ringkasan Lintas Platform** — kartu kecil per platform: jumlah post dipantau, jumlah komentar,
  mini sentiment bar, dan jumlah akun dipantau (jika ada). Klik kartu untuk membuka halaman platform
  tersebut.

Warna sentiment bar: hijau = Positif, kuning = Netral, merah = Negatif — panjang tiap warna
proporsional terhadap persentasenya.

## 4. Monitoring Media Sosial

### Pola umum (Instagram, Facebook, Twitter/X, TikTok)

Keempat halaman ini memakai pola yang sama, masing-masing dengan dua tab:

- **Trending** — topik yang sedang trending di platform tersebut, dihitung otomatis setiap hari.
  Setiap topik bisa dibuka untuk melihat post-post terkait; klik post untuk membuka komentarnya.
- **Analisis Sentimen** — masukkan **username** akun di platform tersebut, pilih jumlah post/video
  yang ingin dianalisis, klik **Analisis**. Aplikasi menampilkan profil akun, daftar post, dan
  sentimen komentar/balasan pada post-post tersebut.

Di atas kolom pencarian ada widget ringkasan (akun yang baru dianalisis / populer) dan panel
"Discover" berisi rekomendasi akun — klik salah satu untuk otomatis mengisi & menjalankan pencarian.

> Jika pengambilan data terbaru gagal, aplikasi menampilkan peringatan dan menampilkan data hasil
> scraping sebelumnya (jika ada) sebagai gantinya.

### YouTube (sedikit berbeda)

- **Video Viral (Trending)** — video dengan tayangan tertinggi di seluruh data tersimpan. Bisa dicari
  berdasarkan judul/channel/kata kunci; jumlah video yang ditampilkan bisa diatur (10/20/50/100).
- **Analisis Sentimen** — pencarian berbasis **kata kunci** (bukan username). Hasilnya adalah dashboard
  lengkap: statistik exposure, breakdown sentimen, grafik sentimen dari waktu ke waktu, top post, tabel
  komentar, word cloud, dan ringkasan AI.

Fitur tambahan pada tab ini: **Riwayat** pencarian sebelumnya, tombol **Export** untuk mengunduh hasil
dashboard, dan panel **Perbandingan Keyword** untuk membandingkan kata kunci saat ini dengan kata
kunci lain di platform yang sama.

## 5. Berita

Dua tab: **Trending** dan **Cari**. Di atas keduanya selalu tampil widget **Ringkasan Analisis Berita**:
total artikel terkumpul, jumlah yang sudah dianalisis, sentimen berita (dengan catatan bahwa sentimen
ini mencerminkan valensi peristiwa yang diliput, bukan sikap media), entitas yang paling banyak
disebut (orang/organisasi/lokasi/tanggal/event), dan daftar sumber media.

- **Trending** — artikel yang dikumpulkan otomatis hari ini, dengan sumber, tanggal, ringkasan
  singkat, dan badge sentimen jika tersedia.
- **Cari** — pencarian bebas berdasarkan kata kunci. Klik kartu hasil untuk membuka artikel aslinya.

## 6. Bandingkan Platform

Masukkan satu kata kunci/hashtag, aplikasi mengambil data untuk kata kunci yang sama di **Facebook,
Instagram, Twitter/X, dan TikTok** sekaligus. Hasil ditampilkan sebagai kartu statistik per platform,
grafik batang volume, grafik batang distribusi sentimen, dan radar chart yang merangkum semua metrik.

Jika satu platform gagal memuat data, platform lain yang berhasil tetap ditampilkan, disertai
peringatan untuk yang gagal.

Selain halaman ini, ada juga panel **Perbandingan Keyword** yang lebih kecil di bagian bawah tab
Analisis Sentimen tiap platform (mis. YouTube) — membandingkan kata kunci saat ini dengan kata kunci
kedua, tapi di **platform yang sama** (bukan lintas platform).

## 7. Cari Topik AI

Asisten chat untuk menemukan dan mengajukan rekomendasi topik trending — bukan untuk bertanya soal
data analitik. Tampilan dua panel:

- **Kiri (chat)** — ketik permintaan bebas, contoh: `"cari 10 topik trending soal starbucks hari ini"`.
  Jawaban AI streaming, termasuk status proses dan tool yang dijalankan.
- **Kanan (daftar rekomendasi)** — topik yang sudah diajukan ke sistem: platform, akun terkait, skor
  keyakinan, status (pending/approved/posted/rejected). Jumlah tampilan bisa diatur (10/20/50).

> Backend mendukung tiga provider AI (Claude, OpenAI, Ollama), tapi UI chat saat ini selalu memakai
> **Claude** — belum ada kontrol untuk berpindah provider dari UI.

## 8. Pengaturan (Settings)

| Tab | Fungsi |
|---|---|
| Akun | Ubah username/email/role yang ditampilkan, Logout Semua Sesi. Form "Ubah Password" **belum terhubung ke backend**. |
| Model AI | Provider AI aktif (Claude · claude-haiku-4-5) dan kolom Anthropic API key (tersimpan di localStorage browser saja, tidak dikirim ke server). |
| Analisis | Platform default saat membuka dashboard, dan parameter scraping (Max Pages, Max Komentar per Video, Max Halaman Komentar) dengan estimasi otomatis. |
| Notifikasi | Sakelar untuk notifikasi analisis selesai, ringkasan AI selesai, dan error. |
| Tentang | Info versi, tech stack, dan daftar platform yang didukung. |

> Kecuali API key AI, parameter analisis, dan preferensi notifikasi (tersimpan di localStorage
> browser), pengaturan lain di halaman ini bersifat tampilan saja dan belum tersimpan ke server.

## 9. Tips & Catatan Penting

- Tidak ada pendaftaran akun mandiri — akun disediakan oleh admin/backend.
- Form ganti password di Settings → Akun belum berfungsi.
- Sebagian besar isian Settings hanya tersimpan di localStorage browser — hilang jika ganti
  browser/perangkat atau membersihkan data browser.
- Tombol Terms/Privacy/Security (halaman login) dan link Repository (Settings → Tentang) masih
  placeholder.
- Cari Topik AI selalu memakai provider Claude, walau backend juga mendukung OpenAI dan Ollama.
- Jika pengambilan data langsung dari suatu platform gagal, aplikasi menampilkan data hasil scraping
  sebelumnya sebagai gantinya, disertai peringatan.

## 10. Untuk Developer

- **Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS · Zustand · TanStack
  Query · Recharts/ECharts · Anthropic Claude API (`claude-haiku-4-5`).
- **Struktur**: `src/app/**` (routes), `src/features/<domain>/{types,services,hooks,components}`
  (logika per domain), `src/components/**` (komponen UI lintas domain), `src/app/api/**` (Next.js
  API routes — dipakai untuk hal yang butuh server, seperti `trend-chat` streaming; sebagian besar
  fitur lain memanggil Backend API langsung lewat `src/lib/api.ts`).
- **Backend**: aplikasi ini tidak punya database sendiri — semua data platform diambil dari Backend
  API eksternal (`NEXT_PUBLIC_API_URL` di `.env.local`).
- **Menjalankan proyek**:
  ```bash
  npm install
  npm run dev     # dev server di http://localhost:3000
  npm run build   # production build
  npm run lint    # ESLint
  ```
- Lihat juga `docs/ARCHITECTURE.md` dan `docs/PHASES.md` untuk catatan arsitektur & roadmap historis
  — perlu diperlakukan sebagai catatan pengembangan, bukan dokumentasi pengguna, dan beberapa
  bagiannya sudah tidak up to date (nama aplikasi & daftar platform sudah berubah sejak dokumen itu
  ditulis).
