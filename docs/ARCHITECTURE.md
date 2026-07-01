# Arsitektur Teknis — SentimentAI

Dokumen ini menjelaskan keputusan arsitektur, pola desain, dan lapisan-lapisan sistem dalam project SentimentAI.

---

## Diagram Arsitektur Tingkat Tinggi

```
┌──────────────────────────────────────────────────────────────┐
│                        Browser / Client                       │
│                                                              │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────────┐  │
│  │  Filter Bar  │   │  Dashboard   │   │   AI Summary     │  │
│  │  (keyword,   │   │  Sections    │   │   Section        │  │
│  │   platform,  │   │  (charts,    │   │   (on-demand)    │  │
│  │   dates)     │   │   tables)    │   │                  │  │
│  └──────┬───────┘   └──────┬───────┘   └────────┬─────────┘  │
│         │                  │                    │            │
│         └────────────Zustand Stores─────────────┘            │
│                   (filterStore, dashboardStore)               │
└──────────────────────────────┬───────────────────────────────┘
                               │ HTTP
                ┌──────────────▼───────────────┐
                │       Next.js API Routes      │
                │   /api/dashboard              │
                │   /api/ai/summary             │
                │   /api/smart-search           │
                └──────┬───────────────┬────────┘
                       │               │
           ┌───────────▼──┐    ┌───────▼────────┐
           │  Backend API  │    │  Ollama (Local) │
           │  :8000        │    │  llama3 :11434  │
           │               │    │                 │
           │  - YouTube    │    │  AI Summary     │
           │  - TikTok     │    │  Generation     │
           │  - Instagram  │    └─────────────────┘
           │  - Facebook   │
           └───────────────┘
```

---

## Lapisan Aplikasi

### 1. Presentation Layer (`src/app/`, `src/components/`, `src/features/*/sections/`)

Bertanggung jawab atas rendering UI. Dibagi menjadi:

- **Pages** (`src/app/`) — Entry points Next.js App Router
- **Sections** (`src/features/dashboard/sections/`) — Bagian besar halaman dashboard
- **Components** (`src/components/`) — Komponen UI reusable (charts, tables, filters)

### 2. Feature Layer (`src/features/`)

Setiap fitur domain diorganisir sebagai modul mandiri dengan struktur:

```
features/
  <nama-fitur>/
    components/   # Komponen spesifik fitur
    hooks/        # Custom React hooks
    services/     # Fungsi API calls
    types/        # Type definitions
    transformers/ # Data transformation
```

### 3. State Layer (`src/store/`, `src/stores/`)

Dua kategori state:

| Tipe | Library | Lokasi | Digunakan untuk |
|---|---|---|---|
| Client state | Zustand | `src/store/`, `src/stores/` | Filter, dashboard data |
| Server state | TanStack Query | hooks | Data fetching & caching |

### 4. API Layer (`src/app/api/`, `src/lib/api.ts`)

- **Next.js API Routes** — Berfungsi sebagai BFF (Backend for Frontend), menangani normalisasi data dan penyembunyian credential
- **Axios client** (`src/lib/api.ts`) — Semua panggilan ke backend eksternal melalui satu instance dengan interceptor auth

### 5. Service Layer (`src/features/*/services/`)

Abstraksi atas HTTP calls. Setiap service hanya tahu tentang satu endpoint.

---

## Pola Transformasi Data

Platform yang berbeda mengembalikan format data yang berbeda. Solusinya adalah **transformer pattern**:

```
Backend Response (YouTube)
        ↓
youtube.transformer.ts → DashboardData (format standard)
        ↓
useDashboardStore (Zustand)
        ↓
Dashboard Sections (render)
```

**Format standard `DashboardData`:**
```ts
interface DashboardData {
  summary: {
    totalPosts: number
    totalComments: number
    engagement: number
    reach: number
  }
  sentiment: {
    positive: number
    negative: number
    neutral: number
  }
  timeline: Array<{ date: string; count: number }>
  topPosts: Array<{ id: string; title: string; views: number; likes: number }>
  wordCloud: Array<{ text: string; value: number }>
}
```

Setiap platform baru hanya perlu menambah transformer-nya sendiri tanpa mengubah komponen UI.

---

## Pola Analisis (useAnalyze)

Hook `useAnalyze` punya dua jalur tergantung apakah filter tanggal (`startDate`/`endDate` di `filterStore`) aktif:

```
usingDateSearch = !!(startDate && endDate)

Jalur A — Date Search (default, filterStore selalu punya tanggal):
1. dateSearch(keyword, platform, dateFrom, dateTo)
   ├── GET /api/v1/{platform}/videos/date-search → ada data → langsung pakai
   └── Kosong → POST dengan auto_crawl=true (scraping di-trigger backend, tidak perlu polling manual)
2. transformDateSearch(response, platform, keyword)

Jalur B — Smart Search (fallback, tanpa filter tanggal):
1. smartSearch(keyword, platform)
   ├── Data ada → langsung transform
   └── Data tidak ada →
         2. collect(keyword, platform)
         3. Poll setiap 2 detik (max 20 retry)
         4. Ketika siap → transform → store
2. transformDashboard(platform, response, keyword)
```

Ini adalah pola **eventual consistency**: data mungkin belum tersedia saat request pertama, sistem akan menunggu proses scraping selesai (otomatis via `auto_crawl` di jalur date-search, atau via polling manual di jalur smart-search).

`filterStore.startDate`/`endDate` default ke **awal bulan berjalan s/d hari ini**, dihitung dinamis saat store di-init (bukan hardcoded), jadi jalur date-search aktif secara default.

### Transformer untuk date-search

`dateSearch.transformer.ts` memetakan response `/videos/date-search` (field `data.items`, `data.sentiment`, `data.daily_breakdown`) ke `DashboardData`. Komentar diekstrak dari `data.comments` (top-level) dengan fallback ke `items[].comments` (nested per video) — backend tidak selalu menyertakan keduanya, jadi section Komentar bisa kosong jika API tidak mengirim comment data sama sekali.

### ComparePanel

`ComparePanel` (perbandingan dua keyword) memakai `dateSearch` (bukan `smartSearch`) dengan `startDate`/`endDate` dari `filterStore` dan `limit: 20`, supaya konsisten dengan jalur analisis utama.

---

## Pola AI Integration

```
User klik "Generate AI Summary"
        ↓
useAISummary hook
        ↓
POST /api/ai/summary (Next.js route)
        ↓
Ollama API (local) → llama3 model
        ↓
Response: { summary, recommendation, key_insights }
        ↓
Render di AISummarySection
```

API route `/api/ai/summary` bertindak sebagai proxy agar Ollama endpoint tidak terekspos ke client.

---

## Autentikasi

Saat ini menggunakan **JWT token storage di localStorage**:

```
Login → POST /api/v1/auth/login
      → Simpan access_token + refresh_token ke localStorage
      → Axios interceptor otomatis tambah Bearer token di setiap request
```

> **Peringatan:** localStorage rentan XSS. Untuk production, pertimbangkan HttpOnly cookies.

---

## Keputusan Teknis

### Mengapa Zustand bukan Redux?
Zustand lebih ringan dan tidak memerlukan boilerplate. Untuk state skala ini (filter + dashboard data), Zustand cukup dan kodenya lebih mudah dibaca.

### Mengapa Next.js API Routes sebagai BFF?
- Menyembunyikan `ANTHROPIC_API_KEY` dari client
- Normalisasi respons backend di satu tempat
- Memudahkan penambahan caching/rate-limiting di masa depan

### Mengapa Ollama untuk AI Summary?
- Tidak ada biaya per-request selama development
- Data pengguna tidak keluar ke cloud
- Mudah diganti Claude API untuk production (client sudah tersedia di `src/lib/anthropicClient.ts`)

### Mengapa `html-to-image` bukan `html2canvas` untuk export PDF?
`html2canvas` (`useExportPDF.ts`) mem-parse CSS sendiri dan crash dengan `Error: Attempting to parse an unsupported color function "lab"` karena Tailwind v4 + shadcn memakai `oklch()`/`lab()` di CSS variable. Sempat dicoba workaround (strip stylesheet, inline computed style ke clone) tapi tetap gagal. `html-to-image` merender lewat SVG `foreignObject` (browser native), jadi tidak ada CSS parser sendiri yang bisa tersandung color function modern. `jsPDF` tetap dipakai untuk slice gambar jadi halaman A4.

---

## Struktur Komponen Dashboard

```
DashboardLayout
  └── DashboardHeader (user profile, logout)
  └── FilterBar (platform, keyword, dates)
  └── Dashboard Page
        ├── ExposureSection
        │     ├── StatsGrid (totalPosts, totalComments, engagement, reach)
        │     └── ExposureChart (line chart tren waktu)
        ├── SentimentSection
        │     ├── SentimentPie (positif/negatif/netral)
        │     └── PlatformChart (distribusi platform)
        ├── TopPostsSection
        │     └── TopPostsTable (top 10 konten)
        ├── WordCloud
        │     └── ECharts wordcloud (50 kata teratas)
        └── AISummarySection
              └── AI-generated executive summary
```
