import { api } from "@/lib/api";

export interface InstagramMetadataMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface InstagramMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface InstagramMetadataItem {
  id: string;
  title: string | null;
  content: string;
  author: string;
  author_followers: number | null;
  audience_size: number | null;
  url: string;
  thumbnail: string;
  metrics: InstagramMetadataMetrics;
  scores: InstagramMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface InstagramMetadataStats {
  total_posts: number;
  distinct_topics: number;
  total_likes: number;
  avg_trend_score: number | null;
}

export interface InstagramMetadataResponse {
  items: InstagramMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: InstagramMetadataStats;
}

export interface InstagramMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "likes" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getInstagramMetadata(params: InstagramMetadataParams): Promise<InstagramMetadataResponse> {
  const { data } = await api.get("/api/v1/instagram/metadata", {
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

export interface InstagramMetadataComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

export interface InstagramMetadataDetail extends InstagramMetadataItem {
  comments: InstagramMetadataComment[];
}

export async function getInstagramMetadataDetail(postId: string): Promise<InstagramMetadataDetail> {
  const { data } = await api.get(`/api/v1/instagram/metadata/${postId}`);
  return data.data;
}
