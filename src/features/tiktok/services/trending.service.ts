import { api } from "@/lib/api";
import type { TikTokComment } from "../types/posts.types";
import type { TikTokTrendingData, TikTokTrendingPost, TikTokTrendingTopic } from "../types/trending.types";

interface RawTrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  views?: number;
  comment_count: number;
  published_at: string;
  comments: TikTokComment[];
}

interface RawTrendingTopic extends Omit<TikTokTrendingTopic, "posts"> {
  posts: RawTrendingPost[];
}

interface RawTikTokTrendingData extends Omit<TikTokTrendingData, "topics"> {
  topics: RawTrendingTopic[];
}

function normalizeTrendingPost(raw: RawTrendingPost): TikTokTrendingPost {
  return {
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.caption,
    likes: raw.likes,
    view_count: raw.views,
    comment_count: raw.comment_count,
    published_at: raw.published_at,
    comments: raw.comments ?? [],
  };
}

export async function getTikTokTrending(params: {
  dateFrom?: string;
  dateTo?: string;
} = {}): Promise<TikTokTrendingData> {
  const { data } = await api.get<{ data: RawTikTokTrendingData }>("/api/v1/tiktok/trending", {
    params: {
      date_from: params.dateFrom || undefined,
      date_to: params.dateTo || undefined,
    },
  });
  const raw = data.data;

  return {
    ...raw,
    topics: raw.topics.map((topic) => ({
      ...topic,
      posts: topic.posts.map(normalizeTrendingPost),
    })),
  };
}
