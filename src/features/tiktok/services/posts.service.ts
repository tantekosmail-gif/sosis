import { api } from "@/lib/api";
import type { TikTokPostItem, TikTokPostsData, TikTokComment, TikTokSentimentBreakdown } from "../types/posts.types";

const EMPTY_SENTIMENT: TikTokSentimentBreakdown = {
  positif: { count: 0, percentage: 0 },
  netral: { count: 0, percentage: 0 },
  negatif: { count: 0, percentage: 0 },
};

interface RawTikTokPost {
  rank?: number;
  post_id: string;
  url: string;
  caption: string;
  author?: string;
  likes: number;
  shares?: number;
  views?: number;
  comment_count: number;
  published_at: string;
  collected_at?: string;
  sentiment_summary?: TikTokSentimentBreakdown;
  comments: TikTokComment[];
}

interface RawTikTokPostsData extends Omit<TikTokPostsData, "items"> {
  items: RawTikTokPost[];
}

function normalizePost(raw: RawTikTokPost): TikTokPostItem {
  return {
    rank: raw.rank,
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.caption,
    author: raw.author,
    likes: raw.likes,
    comment_count: raw.comment_count,
    share_count: raw.shares,
    view_count: raw.views,
    published_at: raw.published_at,
    collected_at: raw.collected_at,
    sentiment_summary: raw.sentiment_summary ?? EMPTY_SENTIMENT,
    comments: raw.comments ?? [],
  };
}

export async function getTikTokPosts(params: {
  username: string;
  maxPosts?: number;
  maxComments?: number;
  forceRefresh?: boolean;
}): Promise<TikTokPostsData> {
  const { data } = await api.get<{ data: RawTikTokPostsData }>("/api/v1/tiktok/posts", {
    params: {
      username: params.username,
      max_posts: params.maxPosts,
      max_comments: params.maxComments,
      force_refresh: params.forceRefresh,
    },
  });

  const raw = data.data;
  return { ...raw, items: raw.items.map(normalizePost) };
}
