# Fase Pengembangan — SentimentAI

Dokumen ini mendefinisikan roadmap pengembangan platform SentimentAI dalam fase-fase terstruktur, dari MVP hingga production-ready.

---

## Status Saat Ini

**Fase yang sudah selesai:** Fase 1 (hampir selesai), Fase 2 (sebagian besar), Fase 3 (dimulai), Fase 5 (sebagian)

```
Fase 1 █████████░ 90%   Foundation & Core UI
Fase 2 ███████░░░ 70%   Data & Analysis Engine
Fase 3 ███░░░░░░░ 25%   AI & Intelligence Layer
Fase 4 █░░░░░░░░░  5%   Production Hardening
Fase 5 ████░░░░░░ 40%   Advanced Features
```

---

## Fase 1 — Foundation & Core UI
**Target:** Infrastruktur dasar berjalan, UI shell selesai

### ✅ Sudah Selesai
- [x] Setup Next.js 16 dengan App Router dan TypeScript
- [x] Konfigurasi Tailwind CSS 4 dan shadcn/ui
- [x] Layout dashboard (DashboardLayout, header, filter bar)
- [x] Halaman login dengan React Hook Form + Zod validation
- [x] Zustand stores (filterStore, dashboardStore, topicStore) — `startDate`/`endDate` default dihitung dinamis (awal bulan s/d hari ini), bukan hardcoded
- [x] Axios client dengan auth interceptor
- [x] Routing: `/` redirect ke `/dashboard` atau `/login`
- [x] Komponen UI base (Button, Input, Card, dll.)
- [x] Hapus hardcoded token di `auth.service.ts` — sudah pakai `auth.access_token`/`auth.refresh_token` dari response asli, tidak ada lagi token hardcode
- [x] Halaman Settings (`/settings`) dengan tab Akun/Model AI/Analisis/Notifikasi/Tentang (preferensi tersimpan di `localStorage` via `useSettings`)

> Supabase client setup **dihapus** dari roadmap — direktori `supabase/` dan `src/lib/supabaseClient.ts` sudah tidak ada di codebase; aplikasi sepenuhnya bergantung pada Backend API eksternal, tidak ada database sendiri.

### 🔧 Perlu Diperbaiki
- [ ] Konsolidasi `/src/store/` dan `/src/stores/` ke satu direktori — `src/store/filterStore.ts` sudah jadi dead code (tidak ada import lagi), tapi `src/store/dashboard.store.ts` dan `src/store/topic.store.ts` masih aktif dipakai. Rencana: hapus `src/store/filterStore.ts`, pindahkan sisanya ke `src/stores/`
- [ ] Tambah refresh token logic di Axios interceptor (masih belum ada — cek `src/lib/api.ts`)
- [ ] Hubungkan field `anthropicApiKey`, `maxPages`, `maxCommentsPerVideo` di Settings ke behavior aplikasi yang sebenarnya (saat ini hanya tersimpan di `localStorage`, tidak dibaca oleh `/api/ai/summary` atau service scraping manapun)

---

## Fase 2 — Data & Analysis Engine
**Target:** Analisis multi-platform berfungsi end-to-end

### ✅ Sudah Selesai
- [x] `useAnalyze` hook dengan pola check → collect → poll → transform (jalur date-search + jalur smart-search)
- [x] YouTube transformer (summary, sentiment, timeline, topPosts, wordCloud, comments)
- [x] API route `/api/dashboard` + `/api/dashboard/youtube` dengan normalisasi lintas platform
- [x] API route `/api/smart-search` sebagai proxy backend
- [x] ExposureSection (stats + line chart tren)
- [x] SentimentSection (pie chart sentimen + distribusi platform)
- [x] SentimentTimeline (line chart positif/netral/negatif per tanggal)
- [x] TopPostsSection (tabel 10 konten terpopuler)
- [x] CommentsTable (paginated, filter sentimen + pencarian teks)
- [x] WordCloud dengan ECharts (50 kata teratas, min 4 karakter)
- [x] Smart search + data collection service
- [x] `dateSearch.service.ts`/`dateSearch.transformer.ts` — jalur date-search jadi default (GET dulu, fallback POST `auto_crawl=true`)
- [x] ComparePanel — perbandingan dua keyword pakai `dateSearch`, render BarChart + RadarChart
- [x] File transformer TikTok/Instagram/Facebook sudah dibuat dan terpasang di dispatcher (`index.ts`) — **tapi masih stub**, lihat di bawah

### 🔧 Perlu Diselesaikan
- [ ] Isi transformer TikTok — file ada di `src/features/analysis/transformers/tiktok.transformer.ts` tapi masih mengembalikan `DashboardData` kosong/nol
- [ ] Isi transformer Instagram — sama, masih stub
- [ ] Isi transformer Facebook — sama, masih stub
- [ ] Error handling jika polling timeout (20x retry habis) di jalur smart-search
- [ ] Loading skeleton yang konsisten di semua section
- [ ] Empty state yang informatif ketika tidak ada data
- [ ] Verifikasi apakah backend `/videos/date-search` benar-benar mengirim field `comments` (top-level atau nested per item) — `dateSearch.transformer.ts` sudah coba ekstrak dari keduanya, tapi section Komentar bisa tetap kosong kalau backend tidak menyertakan data komentar sama sekali di endpoint ini

---

## Fase 3 — AI & Intelligence Layer
**Target:** AI features production-ready dan akurat

### ✅ Sudah Selesai

#### 3.1 AI Summary (Priority: HIGH)
- [x] Migrasi dari Ollama ke Claude API untuk production — `/api/ai/summary/route.ts` sekarang memanggil `anthropic.messages.create()` (model `claude-haiku-4-5-20251001`) lewat `src/lib/anthropicClient.ts`. Dependency `ollama` di `package.json` sudah tidak dipakai, kandidat dihapus.

### 🔲 Belum Dimulai

#### 3.1 AI Summary (lanjutan)
- [ ] Streaming response AI Summary (bukan wait sampai selesai)
- [ ] Tambah konteks keyword dan platform ke prompt AI
- [ ] Cache AI summary agar tidak generate ulang untuk data yang sama
- [ ] Rate limiting di endpoint `/api/ai/summary`
- [ ] Hubungkan field `anthropicApiKey` di Settings ke route (saat ini route selalu pakai `process.env.ANTHROPIC_API_KEY`, mengabaikan input user)

#### 3.2 Sentiment Analysis Enhancement (Priority: MEDIUM)
- [ ] Integrasi model sentimen Indonesia yang lebih akurat
- [ ] Confidence score per klasifikasi sentimen
- [ ] Deteksi bahasa otomatis untuk komentar non-Indonesia

> Breakdown sentimen per tanggal sudah selesai — lihat `SentimentTimeline` di Fase 2.

#### 3.3 Trend Intelligence (Priority: LOW)
- [ ] Deteksi kata kunci yang sedang naik/turun
- [ ] Alerting jika sentimen negatif spike
- [ ] Perbandingan antar periode

---

## Fase 4 — Production Hardening
**Target:** Aplikasi aman, stabil, dan dapat dimonitor

### 🔲 Belum Dimulai

#### 4.1 Keamanan (Priority: HIGH)
- [x] Hapus hardcoded credentials — token hardcode di `LoginForm`/`auth.service.ts` sudah dibersihkan
- [ ] Ganti localStorage token ke HttpOnly cookies
- [ ] Implementasi CSRF protection
- [ ] Rate limiting semua API routes
- [ ] Input sanitization untuk keyword (prevent injection)
- [ ] Environment variable audit (tidak ada secret di client-side)

#### 4.2 Error Handling (Priority: HIGH)
- [ ] Global error boundary di React
- [ ] Toast notification untuk error yang user-facing
- [ ] Retry logic yang lebih baik (exponential backoff)
- [ ] Logging error ke external service (Sentry)
- [ ] Graceful degradation ketika backend tidak tersedia

#### 4.3 Performance (Priority: MEDIUM)
- [ ] React Query caching untuk data dashboard
- [ ] Lazy loading section yang berat (WordCloud, Charts)
- [ ] Image optimization
- [ ] Bundle analysis dan code splitting
- [ ] Memoization komponen chart yang mahal

#### 4.4 Testing (Priority: MEDIUM)
- [ ] Unit test untuk semua transformer (youtube, tiktok, dll.)
- [ ] Unit test untuk Zustand stores
- [ ] Integration test untuk API routes
- [ ] E2E test alur utama (login → analyze → lihat hasil)

#### 4.5 Monitoring (Priority: LOW)
- [ ] Analytics penggunaan fitur
- [ ] Performance monitoring (Core Web Vitals)
- [ ] Uptime monitoring backend API

---

## Fase 5 — Advanced Features
**Target:** Fitur lanjutan untuk power users

### ✅ Sudah Selesai

#### 5.2 Export & Reporting
- [x] Generate laporan PDF dengan semua visualisasi (`useExportPDF` — `html-to-image` + `jsPDF`, multi-page A4)

#### 5.5 Competitive Analysis
- [x] Bandingkan sentimen antar keyword — `ComparePanel` (BarChart sentimen + RadarChart skor keseluruhan, pakai `dateSearch`)

#### 5.6 Viral Content Discovery (baru, di luar 5 kategori awal)
- [x] Halaman `/viral` — video YouTube paling viral, filter keyword + limit (10/20/50/100), lengkap dengan komentar per video (`ViralVideoGrid`, `ViralCommentsList`, `useViralVideos`, `viral.service.ts` → `GET /api/v1/youtube/videos/viral`)

#### 5.7 Search History & Settings (baru, di luar 5 kategori awal)
- [x] `SearchHistoryPanel` — riwayat pencarian tersimpan di `localStorage` (max 20, dedupe per keyword+platform)
- [x] Halaman `/settings` dengan 5 tab (Akun, Model AI, Analisis/Scraping, Notifikasi, Tentang) — lihat catatan di Fase 1 & 3, sebagian besar field belum terhubung ke behavior nyata

### 🔲 Belum Dimulai

#### 5.1 Topic Management
- [ ] CRUD topic untuk mengelompokkan keyword (store `topicStore` sudah ada tapi belum ada UI CRUD)
- [ ] Analisis komparatif antar topic
- [ ] Auto-tagging konten berdasarkan topic

#### 5.2 Export & Reporting (lanjutan)
- [ ] Export data ke CSV/Excel
- [ ] Jadwal laporan otomatis (weekly/monthly)

#### 5.3 Realtime Features
- [ ] WebSocket untuk live update data baru
- [ ] Notifikasi push ketika analisis selesai
- [ ] Live sentiment meter

#### 5.4 Multi-user & Collaboration
- [ ] Role-based access control (admin, analyst, viewer)
- [ ] Shared dashboard antar tim
- [ ] Comment & annotation di chart

#### 5.5 Competitive Analysis (lanjutan)
- [ ] Share of voice antar platform
- [ ] Benchmark vs kompetitor

#### 5.6 Viral Content Discovery (lanjutan)
- [ ] Perluas ke TikTok/Instagram/Facebook (saat ini YouTube-only, tergantung juga pada transformer platform lain di Fase 2)

---

## Prioritas Segera (Quick Wins)

Hal-hal yang bisa dilakukan sekarang dengan effort rendah dan impact tinggi:

| Item | Effort | Impact | File |
|---|---|---|---|
| Hapus `src/store/filterStore.ts` (dead code) | Rendah | Medium | `src/store/filterStore.ts` |
| Hapus dependency `ollama` & `html2canvas` yang sudah tidak dipakai | Rendah | Rendah | `package.json` |
| Error state saat polling timeout | Rendah | Tinggi | `src/features/analysis/hooks/useAnalyze.ts` |
| Loading skeleton section | Rendah | Medium | `src/features/dashboard/sections/*.tsx` |
| Konsolidasi store directory (`dashboard.store.ts`, `topic.store.ts` → `src/stores/`) | Rendah | Medium | `/src/store/` + `/src/stores/` |
| Isi TikTok transformer (masih stub) | Medium | Tinggi | `src/features/analysis/transformers/tiktok.transformer.ts` |
| Streaming AI summary | Medium | Tinggi | `src/app/api/ai/summary/route.ts` |
| Hubungkan `anthropicApiKey`/`maxPages` Settings ke behavior nyata | Medium | Medium | `src/features/settings/hooks/useSettings.ts` |

---

## Catatan Arsitektur per Fase

### Fase 1 → 2: Tambah transformer
Setiap platform baru membutuhkan file transformer di:
`src/features/analysis/transformers/<platform>.transformer.ts`

File untuk TikTok/Instagram/Facebook **sudah dibuat dan terpasang** di dispatcher (`index.ts`), tapi isinya masih stub (return data kosong). Yang perlu dikerjakan sekarang adalah mengisi logikanya, bukan membuat filenya:
```ts
export function transformTiktokData(raw: TiktokApiResponse): DashboardData
```

### Fase 2 → 3: Ganti AI provider — ✅ selesai
`/src/app/api/ai/summary/route.ts` sudah memakai Anthropic, bukan Ollama lagi:
```ts
import { anthropic } from '@/lib/anthropicClient'
// anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', ... })
```
Sisa pekerjaan di area ini: streaming response, caching, rate limiting (lihat Fase 3.1).

### Fase 3 → 4: Auth migration
Pindahkan token dari localStorage ke HttpOnly cookies dengan mengubah:
- `src/features/auth/services/auth.service.ts` — set cookies
- `src/lib/auth.ts` — baca dari cookies bukan localStorage
- `src/lib/api.ts` — hapus manual token injection (cookie otomatis terkirim)
