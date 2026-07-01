# Fase Pengembangan — SentimentAI

Dokumen ini mendefinisikan roadmap pengembangan platform SentimentAI dalam fase-fase terstruktur, dari MVP hingga production-ready.

---

## Status Saat Ini

**Fase yang sudah selesai:** Fase 1 (sebagian) dan Fase 2 (sebagian)

```
Fase 1 ████████░░ 80%   Foundation & Core UI
Fase 2 ██████░░░░ 60%   Data & Analysis Engine
Fase 3 ░░░░░░░░░░  0%   AI & Intelligence Layer
Fase 4 ░░░░░░░░░░  0%   Production Hardening
Fase 5 ░░░░░░░░░░  0%   Advanced Features
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
- [x] Supabase client setup
- [x] Komponen UI base (Button, Input, Card, dll.)

### 🔧 Perlu Diperbaiki
- [ ] Hapus hardcoded token di `LoginForm.tsx` (security risk)
- [ ] Konsolidasi `/src/store/` dan `/src/stores/` ke satu direktori
- [ ] Tambah refresh token logic di Axios interceptor

---

## Fase 2 — Data & Analysis Engine
**Target:** Analisis multi-platform berfungsi end-to-end

### ✅ Sudah Selesai
- [x] `useAnalyze` hook dengan pola check → collect → poll → transform
- [x] YouTube transformer (summary, sentiment, timeline, topPosts, wordCloud)
- [x] API route `/api/dashboard` dengan normalisasi lintas platform
- [x] API route `/api/smart-search` sebagai proxy backend
- [x] ExposureSection (stats + line chart tren)
- [x] SentimentSection (pie chart sentimen + distribusi platform)
- [x] TopPostsSection (tabel 10 konten terpopuler)
- [x] WordCloud dengan ECharts (50 kata teratas, min 4 karakter)
- [x] Smart search + data collection service

### 🔧 Perlu Diselesaikan
- [ ] Transformer TikTok — belum ada, data TikTok tidak diproses
- [ ] Transformer Instagram — belum ada
- [ ] Transformer Facebook — belum ada
- [ ] Error handling jika polling timeout (20x retry habis)
- [ ] Loading skeleton yang konsisten di semua section
- [ ] Empty state yang informatif ketika tidak ada data
- [ ] Verifikasi apakah backend `/videos/date-search` benar-benar mengirim field `comments` (top-level atau nested per item) — `dateSearch.transformer.ts` sudah coba ekstrak dari keduanya, tapi section Komentar bisa tetap kosong kalau backend tidak menyertakan data komentar sama sekali di endpoint ini

---

## Fase 3 — AI & Intelligence Layer
**Target:** AI features production-ready dan akurat

### 🔲 Belum Dimulai

#### 3.1 AI Summary (Priority: HIGH)
- [ ] Migrasi dari Ollama ke Claude API untuk production
  - Client sudah tersedia di `src/lib/anthropicClient.ts`
  - Ganti endpoint di `/api/ai/summary/route.ts`
- [ ] Streaming response AI Summary (bukan wait sampai selesai)
- [ ] Tambah konteks keyword dan platform ke prompt AI
- [ ] Cache AI summary agar tidak generate ulang untuk data yang sama
- [ ] Rate limiting di endpoint `/api/ai/summary`

#### 3.2 Sentiment Analysis Enhancement (Priority: MEDIUM)
- [ ] Integrasi model sentimen Indonesia yang lebih akurat
- [ ] Confidence score per klasifikasi sentimen
- [ ] Breakdown sentimen per tanggal (timeline sentimen)
- [ ] Deteksi bahasa otomatis untuk komentar non-Indonesia

#### 3.3 Trend Intelligence (Priority: LOW)
- [ ] Deteksi kata kunci yang sedang naik/turun
- [ ] Alerting jika sentimen negatif spike
- [ ] Perbandingan antar periode

---

## Fase 4 — Production Hardening
**Target:** Aplikasi aman, stabil, dan dapat dimonitor

### 🔲 Belum Dimulai

#### 4.1 Keamanan (Priority: HIGH)
- [ ] Ganti localStorage token ke HttpOnly cookies
- [ ] Implementasi CSRF protection
- [ ] Rate limiting semua API routes
- [ ] Input sanitization untuk keyword (prevent injection)
- [ ] Environment variable audit (tidak ada secret di client-side)
- [ ] Hapus semua hardcoded credentials

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

### 🔲 Belum Dimulai

#### 5.1 Topic Management
- [ ] CRUD topic untuk mengelompokkan keyword
- [ ] Analisis komparatif antar topic
- [ ] Auto-tagging konten berdasarkan topic

#### 5.2 Export & Reporting
- [ ] Export data ke CSV/Excel
- [x] Generate laporan PDF dengan semua visualisasi (`useExportPDF` — `html-to-image` + `jsPDF`, multi-page A4)
- [ ] Jadwal laporan otomatis (weekly/monthly)

#### 5.3 Realtime Features
- [ ] WebSocket untuk live update data baru
- [ ] Notifikasi push ketika analisis selesai
- [ ] Live sentiment meter

#### 5.4 Multi-user & Collaboration
- [ ] Role-based access control (admin, analyst, viewer)
- [ ] Shared dashboard antar tim
- [ ] Comment & annotation di chart

#### 5.5 Competitive Analysis
- [ ] Bandingkan sentimen antar brand/keyword
- [ ] Share of voice antar platform
- [ ] Benchmark vs kompetitor

---

## Prioritas Segera (Quick Wins)

Hal-hal yang bisa dilakukan sekarang dengan effort rendah dan impact tinggi:

| Item | Effort | Impact | File |
|---|---|---|---|
| Hapus hardcoded token | Rendah | Tinggi | `src/features/auth/components/LoginForm.tsx` |
| Error state saat polling timeout | Rendah | Tinggi | `src/features/analysis/hooks/useAnalyze.ts` |
| Loading skeleton section | Rendah | Medium | `src/features/dashboard/sections/*.tsx` |
| Konsolidasi store directory | Rendah | Medium | `/src/store/` + `/src/stores/` |
| Tambah TikTok transformer | Medium | Tinggi | `src/features/analysis/transformers/tiktok.transformer.ts` |
| Streaming AI summary | Medium | Tinggi | `src/app/api/ai/summary/route.ts` |

---

## Catatan Arsitektur per Fase

### Fase 1 → 2: Tambah transformer
Setiap platform baru membutuhkan file transformer di:
`src/features/analysis/transformers/<platform>.transformer.ts`

Transformer harus mengeksport fungsi dengan signature:
```ts
export function transformTiktokData(raw: TiktokApiResponse): DashboardData
```

### Fase 2 → 3: Ganti AI provider
Ubah `/src/app/api/ai/summary/route.ts` dari Ollama ke Anthropic:
```ts
import { anthropic } from '@/lib/anthropicClient'
// Gunakan anthropic.messages.create() instead of fetch ke Ollama
```

### Fase 3 → 4: Auth migration
Pindahkan token dari localStorage ke HttpOnly cookies dengan mengubah:
- `src/features/auth/services/auth.service.ts` — set cookies
- `src/lib/auth.ts` — baca dari cookies bukan localStorage
- `src/lib/api.ts` — hapus manual token injection (cookie otomatis terkirim)
