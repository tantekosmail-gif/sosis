import type { TikTokComment, TikTokSentimentBreakdown } from "./posts.types";

export interface TikTokTrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  view_count?: number;
  comment_count: number;
  published_at: string;
  comments: TikTokComment[];
}

export interface TikTokTrendingTopic {
  topic: string;
  score: number;
  status: string;
  tiktok_identifier: string;
  sentiment: TikTokSentimentBreakdown;
  posts: TikTokTrendingPost[];
}

export interface TikTokTrendingData {
  platform: string;
  date: string;
  total_topics: number;
  daily_budget: number;
  schedule: string;
  topics: TikTokTrendingTopic[];
}
