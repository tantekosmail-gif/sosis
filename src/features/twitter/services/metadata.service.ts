import { api } from "@/lib/api";

export interface TwitterMetadataMetrics {
  likes: number;
  retweets: number;
  replies: number;
  quotes: number;
  views: number;
}

export interface TwitterMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface TwitterMetadataItem {
  id: string;
  post_id: string;
  text: string;
  author: string;
  username: string;
  url: string;
  thumbnail: string;
  metrics: TwitterMetadataMetrics;
  scores: TwitterMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_replies_count: number;
}

export interface TwitterMetadataStats {
  total_posts: number;
  distinct_topics: number;
  total_likes: number;
  avg_trend_score: number;
}

export interface TwitterMetadataResponse {
  items: TwitterMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: TwitterMetadataStats;
}

export interface TwitterMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "likes" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getTwitterMetadata(params: TwitterMetadataParams): Promise<TwitterMetadataResponse> {
  const { data } = await api.get("/api/v1/twitter/metadata", {
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

export interface TwitterMetadataComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
  sentiment?: string;
}

export interface TwitterMetadataDetail extends TwitterMetadataItem {
  replies: TwitterMetadataComment[];
}

export async function getTwitterMetadataDetail(postId: string): Promise<TwitterMetadataDetail> {
  const { data } = await api.get(`/api/v1/twitter/metadata/${postId}`);
  return data.data;
}
