import { api } from "@/lib/api";

export interface TikTokVideoMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface TikTokVideoScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface TikTokVideoMetadataItem {
  id: string;
  title: string;
  content: string;
  author: string;
  author_fans: number;
  url: string;
  thumbnail: string;
  metrics: TikTokVideoMetrics;
  scores: TikTokVideoScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface TikTokVideoMetadataStats {
  total_videos: number;
  distinct_topics: number;
  total_views: number;
  avg_trend_score: number;
}

export interface TikTokVideoMetadataResponse {
  items: TikTokVideoMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: TikTokVideoMetadataStats;
}

export interface TikTokVideoMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "views" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

// GET /api/v1/tiktok/metadata — pencarian video full-text (judul+caption) lintas
// topik yang sudah dikumpulkan backend, dilengkapi skor trend/engagement/
// freshness/authority serta ringkasan & tag hasil AI. Mendukung sorting &
// pagination server-side (sama seperti /youtube/metadata).
export async function getTikTokVideoMetadata(params: TikTokVideoMetadataParams): Promise<TikTokVideoMetadataResponse> {
  const { data } = await api.get("/api/v1/tiktok/metadata", {
    params: {
      topic: params.topic || undefined,
      search: params.search || undefined,
      sort_by: params.sortBy ?? "trend_score",
      order: params.order ?? "desc",
      page: params.page ?? 1,
      page_size: params.pageSize ?? 100,
    },
  });

  return data.data;
}

export interface TikTokVideoDetailComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

// List item cuma punya saved_comment_count (angka) -- detail endpoint di
// bawah ini satu-satunya cara dapat isi komentarnya.
export interface TikTokVideoMetadataDetail extends TikTokVideoMetadataItem {
  comments: TikTokVideoDetailComment[];
}

// GET /api/v1/tiktok/metadata/{video_id} — detail lengkap 1 video + semua
// komentar tersimpan, dipanggil on-demand saat user buka panel detail video.
export async function getTikTokVideoDetail(videoId: string): Promise<TikTokVideoMetadataDetail> {
  const { data } = await api.get(`/api/v1/tiktok/metadata/${videoId}`);
  return data.data;
}
