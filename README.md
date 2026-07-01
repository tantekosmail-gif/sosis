# SentimentAI — AI Powered Social Intelligence Platform

Platform analitik media sosial berbasis AI untuk memantau sentimen publik secara real-time di YouTube, TikTok, Instagram, dan Facebook.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Konfigurasi Environment](#konfigurasi-environment)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Direktori](#struktur-direktori)
- [Alur Data](#alur-data)
- [API Routes](#api-routes)
- [State Management](#state-management)
- [Deployment](#deployment)

---

## Gambaran Umum

SentimentAI memungkinkan pengguna untuk menganalisis percakapan publik di media sosial berdasarkan keyword tertentu. Sistem akan mengumpulkan data dari platform yang dipilih, mengklasifikasikan sentimen (positif/negatif/netral), memvisualisasikan tren, dan menghasilkan ringkasan eksekutif berbasis AI.

---

## Fitur Utama

| Fitur | Deskripsi |
|---|---|
| **Multi-Platform** | Analisis YouTube, TikTok, Instagram, Facebook dalam satu dashboard |
| **Analisis Sentimen** | Klasifikasi otomatis komentar: positif, negatif, netral |
| **Word Cloud** | Visualisasi kata-kata paling sering muncul dari data komentar |
| **Grafik Exposure** | Tren engagement dan reach dari waktu ke waktu |
| **Top Posts** | 10 konten terpopuler berdasarkan metrik platform |
| **AI Summary** | Ringkasan eksekutif dan rekomendasi berbasis LLM (Ollama llama3) |
| **Smart Search** | Pencarian cerdas dengan trigger scraping otomatis jika data belum ada |
| **Filter Dinamis** | Filter keyword, platform, rentang tanggal, dan interval |

---

## Tech Stack

### Frontend
| Library | Versi | Kegunaan |
|---|---|---|
| Next.js | 16.2.9 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | — | Type safety |
| Tailwind CSS | 4 | Styling |
| shadcn/ui + Radix UI | — | Komponen UI |
| Framer Motion | 12.42.0 | Animasi |

### Visualisasi
| Library | Versi | Kegunaan |
|---|---|---|
| Recharts | 3.9.0 | Grafik exposure & sentimen |
| ECharts | 5.5.1 | Word cloud |

### State & Data Fetching
| Library | Versi | Kegunaan |
|---|---|---|
| Zustand | 5.0.14 | Global state management |
| TanStack Query | 5.101.1 | Server state & caching |
| Axios | — | HTTP client |
| React Hook Form | 7.80.0 | Form handling |
| Zod | 4.4.3 | Schema validation |

### Backend & AI
| Library | Versi | Kegunaan |
|---|---|---|
| Anthropic SDK | 0.107.0 | Integrasi Claude API |
| Ollama (llama3) | — | AI summary lokal |

---

## Prasyarat

- **Node.js** >= 18
- **npm** >= 9
- **Ollama** terinstall dan berjalan di `http://127.0.0.1:11434` dengan model `llama3`
- Akses ke backend API (default: `http://187.77.125.10:8000`)

---

## Instalasi

```bash
# Clone repository
git clone <repo-url>
cd admin-dashboard

# Install dependencies
npm install
```

---

## Konfigurasi Environment

Buat file `.env.local` di root project:

```env
# Backend API
NEXT_PUBLIC_API_URL=http://your-backend-host:8000

# Anthropic (untuk Claude API, opsional jika pakai Ollama)
ANTHROPIC_API_KEY=sk-ant-your-key
```

---

## Menjalankan Aplikasi

```bash
# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

> **Catatan:** Pastikan Ollama berjalan di background sebelum menggunakan fitur AI Summary:
> ```bash
> ollama serve
> ollama pull llama3
> ```

---

## Struktur Direktori

```
src/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes (server-side)
│   │   ├── ai/summary/         # Generate AI summary via Ollama
│   │   ├── dashboard/          # Fetch & normalize platform data
│   │   └── smart-search/       # Proxy ke backend search
│   ├── (auth)/login/           # Halaman login
│   ├── dashboard/              # Halaman utama dashboard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Entry point (redirect)
│   └── providers.tsx           # React Query provider
│
├── components/                 # Komponen UI reusable
│   ├── ui/                     # Base components (shadcn/ui)
│   ├── layout/                 # Layout wrappers
│   ├── dashboard/              # Dashboard components
│   ├── charts/                 # Chart components
│   ├── filters/                # Filter controls
│   └── tables/                 # Table components
│
├── features/                   # Domain-driven feature modules
│   ├── auth/                   # Login, token management
│   ├── dashboard/              # Sections, hooks, services
│   │   └── sections/           # ExposureSection, SentimentSection, dll.
│   ├── analysis/               # Core analysis engine
│   │   ├── hooks/              # useAnalyze
│   │   ├── services/           # analysis.service.ts
│   │   └── transformers/       # YouTube, TikTok, IG, FB transformers
│   ├── ai/                     # AI features
│   │   ├── hooks/              # useAISummary
│   │   ├── services/           # summary.service.ts
│   │   └── engine/             # aiProcessor.ts
│   ├── search/                 # Smart search & data collection
│   ├── exposure/               # Metrik exposure & chart
│   ├── sentiment/              # Analisis sentimen
│   ├── timeline/               # Data timeline
│   ├── trends/                 # Trending topics
│   └── topic/                  # Topic management
│
├── store/                      # Zustand stores
│   ├── dashboard.store.ts      # Data dashboard & loading state
│   └── topic.store.ts          # Selected topic
│
├── stores/                     # (Alias) Filter store
│   └── filterStore.ts          # Platform, keyword, dates, interval
│
├── lib/                        # Utilities & clients
│   ├── api.ts                  # Axios instance (dengan auth interceptor)
│   ├── anthropicClient.ts      # Anthropic SDK client
│   ├── auth.ts                 # Auth helper (getAccessToken, dll.)
│   └── utils.ts                # General utilities
│
└── types/                      # TypeScript type definitions
    ├── dashboard.type.ts
    └── filter.ts
```

---

## Alur Data

```
1. User input keyword + pilih platform
          ↓
2. Klik "Analyze" → useAnalyze hook
          ↓
3. smartSearch() → cek apakah data sudah ada di backend
          ↓
4. Jika belum → collect() → trigger scraping data
          ↓
5. Polling setiap 2 detik (max 20x) sampai data siap
          ↓
6. Transform data via platform transformer (YouTube/TikTok/dll.)
          ↓
7. Simpan ke useDashboardStore (Zustand)
          ↓
8. Dashboard render:
   ├── ExposureSection    (metrik + chart tren)
   ├── SentimentSection   (pie chart sentimen + platform)
   ├── TopPostsSection    (top 10 konten)
   ├── WordCloud          (keyword frekuensi)
   └── AISummarySection   (ringkasan AI on-demand)
```

---

## API Routes

### `GET /api/dashboard`
Mengambil data dashboard dari backend dan menormalisasi respons.

**Query params:**
| Param | Tipe | Deskripsi |
|---|---|---|
| `platform` | string | `youtube` \| `tiktok` \| `instagram` \| `facebook` |
| `keyword` | string | Kata kunci pencarian |
| `startDate` | string | Tanggal mulai (ISO 8601) |
| `endDate` | string | Tanggal selesai (ISO 8601) |

**Response:**
```json
{
  "summary": { "totalPosts": 0, "totalComments": 0, "engagement": 0, "reach": 0 },
  "sentiment": { "positive": 0, "negative": 0, "neutral": 0 },
  "timeline": [{ "date": "2026-01-01", "count": 0 }],
  "topPosts": [{ "id": "", "title": "", "views": 0, "likes": 0 }],
  "wordCloud": [{ "text": "", "value": 0 }]
}
```

---

### `POST /api/ai/summary`
Menghasilkan ringkasan AI menggunakan Ollama (llama3).

**Request body:**
```json
{
  "dashboardData": { ... }
}
```

**Response:**
```json
{
  "summary": "Ringkasan eksekutif...",
  "recommendation": "Rekomendasi strategis...",
  "key_insights": ["Insight 1", "Insight 2", "Insight 3"]
}
```

---

### `GET /api/smart-search`
Proxy ke backend smart-search endpoint.

---

## State Management

### Filter Store (`/src/stores/filterStore.ts`)
```ts
{
  platform: string,       // 'youtube' | 'tiktok' | 'instagram' | 'facebook'
  keyword: string,
  startDate: string,
  endDate: string,
  topic: string,
  interval: string        // 'daily' | 'weekly' | 'monthly'
}
```

### Dashboard Store (`/src/store/dashboard.store.ts`)
```ts
{
  dashboard: DashboardData | null,
  loading: boolean,
  setDashboard: (data) => void,
  setLoading: (val) => void,
  clearDashboard: () => void
}
```

---

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy via Vercel CLI atau GitHub integration
```

> Tambahkan semua environment variables ke Vercel project settings.

### Docker (Self-hosted)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci && npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Catatan Pengembangan

- Terdapat duplikasi store: `/src/store/` dan `/src/stores/` — konsolidasi ke satu direktori direkomendasikan
- Login saat ini menggunakan hardcoded token untuk testing — perlu dihapus sebelum production
- AI Summary menggunakan Ollama lokal — pertimbangkan Claude API untuk production
- Platform transformer hanya YouTube yang lengkap — TikTok, Instagram, Facebook perlu dikembangkan
- Database Supabase tidak digunakan — semua data diambil dari backend API
