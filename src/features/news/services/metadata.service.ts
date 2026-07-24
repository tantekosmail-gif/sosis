import { api } from "@/lib/api";

export interface NewsMetadataMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface NewsMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface NewsMetadataItem {
  id: string;
  post_id: string;
  title: string;
  content: string;
  author: string | null;
  url: string;
  thumbnail: string;
  metrics: NewsMetadataMetrics;
  scores: NewsMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string | null;
  collected_at: string;
  saved_comments_count: number;
}

export interface NewsMetadataStats {
  total_articles: number;
  distinct_topics: number;
  total_views: number;
  avg_trend_score: number;
}

export interface NewsMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "published_at" | "views";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface NewsMetadataResponse {
  items: NewsMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: NewsMetadataStats;
}

export interface NewsMetadataComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

export interface NewsMetadataDetail extends NewsMetadataItem {
  comments: NewsMetadataComment[];
}

export async function getNewsMetadata(params: {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "published_at" | "views";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}): Promise<NewsMetadataResponse> {
  const { data } = await api.get("/api/v1/news/metadata", {
    params: {
      topic: params.topic || undefined,
      search: params.search || undefined,
      sort_by: params.sortBy ?? "published_at",
      order: params.order ?? "desc",
      page: params.page ?? 1,
      page_size: params.pageSize ?? 100,
    },
  });
  return data.data;
}

export async function getNewsMetadataDetail(postId: string): Promise<NewsMetadataDetail> {
  const { data } = await api.get(`/api/v1/news/metadata/${postId}`);
  return data.data;
}
