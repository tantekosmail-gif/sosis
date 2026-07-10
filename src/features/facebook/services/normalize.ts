import type { FacebookPostItem, FacebookPostSentimentBreakdown } from "../types/posts.types";

const EMPTY_SENTIMENT: FacebookPostSentimentBreakdown = {
  positif: { count: 0, percentage: 0 },
  netral: { count: 0, percentage: 0 },
  negatif: { count: 0, percentage: 0 },
};

export interface RawFacebookPost {
  rank?: number;
  post_id: string;
  url: string;
  message: string;
  author?: string;
  likes: number;
  shares?: number;
  comment_count: number;
  thumbnail?: string;
  published_at: string;
  collected_at?: string;
  sentiment_summary?: FacebookPostSentimentBreakdown;
  comments: FacebookPostItem["comments"];
}

export function normalizeFacebookPost(raw: RawFacebookPost): FacebookPostItem {
  return {
    rank: raw.rank,
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.message,
    author: raw.author,
    likes: raw.likes,
    comment_count: raw.comment_count,
    thumbnail: raw.thumbnail ?? "",
    published_at: raw.published_at,
    collected_at: raw.collected_at,
    sentiment_summary: raw.sentiment_summary ?? EMPTY_SENTIMENT,
    comments: raw.comments ?? [],
  };
}
