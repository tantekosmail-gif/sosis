import { api } from "@/lib/api";

export interface FacebookMetadataMetrics {
  likes: number;
  comments: number;
  shares: number;
}

export interface FacebookMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface FacebookMetadataItem {
  id: string;
  title: string;
  content: string;
  author: string;
  url: string;
  thumbnail: string;
  metrics: FacebookMetadataMetrics;
  scores: FacebookMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface FacebookMetadataStats {
  total_posts: number;
  distinct_topics: number;
  total_likes: number;
  avg_trend_score: number;
}

export interface FacebookMetadataResponse {
  items: FacebookMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: FacebookMetadataStats;
}

export interface FacebookMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "likes" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getFacebookMetadata(params: FacebookMetadataParams): Promise<FacebookMetadataResponse> {
  const { data } = await api.get("/api/v1/facebook/metadata", {
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

export interface FacebookMetadataComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

export interface FacebookMetadataDetail extends FacebookMetadataItem {
  comments: FacebookMetadataComment[];
}

export async function getFacebookMetadataDetail(postId: string): Promise<FacebookMetadataDetail> {
  const { data } = await api.get(`/api/v1/facebook/metadata/${postId}`);
  return data.data;
}
