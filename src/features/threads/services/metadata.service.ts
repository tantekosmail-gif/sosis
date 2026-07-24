import { api } from "@/lib/api";

export interface ThreadsMetadataMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ThreadsMetadataScores {
  trend_score: number | null;
  engagement_score: number | null;
  freshness_score: number | null;
  authority_score: number | null;
}

export interface ThreadsMetadataItem {
  id: string;
  title: string | null;
  content: string;
  author: string;
  author_followers: number | null;
  audience_size: number | null;
  url: string;
  thumbnail: string;
  metrics: ThreadsMetadataMetrics;
  quotes: number;
  scores: ThreadsMetadataScores;
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface ThreadsMetadataStats {
  total_posts: number;
  distinct_topics: number;
  total_likes: number;
  avg_trend_score: number | null;
}

export interface ThreadsMetadataResponse {
  items: ThreadsMetadataItem[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
  stats: ThreadsMetadataStats;
}

export interface ThreadsMetadataParams {
  search?: string;
  topic?: string;
  sortBy?: "trend_score" | "likes" | "published_at";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export async function getThreadsMetadata(params: ThreadsMetadataParams): Promise<ThreadsMetadataResponse> {
  const { data } = await api.get("/api/v1/threads/metadata", {
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

export interface ThreadsMetadataComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

export interface ThreadsMetadataDetail extends ThreadsMetadataItem {
  comments: ThreadsMetadataComment[];
}

export async function getThreadsMetadataDetail(postId: string): Promise<ThreadsMetadataDetail> {
  const { data } = await api.get(`/api/v1/threads/metadata/${postId}`);
  return data.data;
}
