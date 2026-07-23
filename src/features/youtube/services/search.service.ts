import { api } from "@/lib/api";

export interface VideoMetadataMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface VideoMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface VideoMetadataItem {
  id: string;
  title: string;
  content: string;
  author: string;
  channel_id: string | null;
  url: string;
  thumbnail: string;
  metrics: VideoMetadataMetrics;
  scores: VideoMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface VideoMetadataStats {
  total_videos: number;
  distinct_topics: number;
  total_views: number;
  avg_trend_score: number;
}

export interface VideoMetadataResponse {
  items: VideoMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: VideoMetadataStats;
}

export interface VideoMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "views" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

// GET /api/v1/youtube/metadata — pencarian video full-text (title+content) lintas
// topik yang sudah dikumpulkan backend, dilengkapi skor trend/engagement/
// freshness/authority serta ringkasan & tag hasil AI. Beda dari search-recent
// lama: tidak dibatasi jendela waktu (hours_back) dan tidak mengembalikan
// sentimen komentar, tapi mendukung sorting & pagination server-side.
export async function getVideoMetadata(params: VideoMetadataParams): Promise<VideoMetadataResponse> {
  const { data } = await api.get("/api/v1/youtube/metadata", {
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

export interface VideoDetailComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

// List item cuma punya saved_comment_count (angka) -- detail endpoint di
// bawah ini satu-satunya cara dapat isi komentarnya.
export interface VideoMetadataDetail extends VideoMetadataItem {
  comments: VideoDetailComment[];
}

// GET /api/v1/youtube/metadata/{video_id} — detail lengkap 1 video + semua
// komentar tersimpan, dipanggil on-demand saat user buka modal detail video.
export async function getVideoDetail(videoId: string): Promise<VideoMetadataDetail> {
  const { data } = await api.get(`/api/v1/youtube/metadata/${videoId}`);
  return data.data;
}
