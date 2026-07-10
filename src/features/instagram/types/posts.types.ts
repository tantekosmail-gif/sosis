import type { TrendingComment } from "./trending.types";

export interface PostSentimentEntry {
  count: number;
  percentage: number;
}

export interface PostSentimentBreakdown {
  positif: PostSentimentEntry;
  negatif: PostSentimentEntry;
  netral: PostSentimentEntry;
}

export interface PostSentimentOverview extends PostSentimentBreakdown {
  dominant: string;
  total_analyzed: number;
}

export interface InstagramPostItem {
  rank?: number;
  post_id: string;
  shortcode?: string;
  url: string;
  caption: string;
  author?: string;
  likes: number;
  comment_count: number;
  media_type?: "IMAGE" | "VIDEO" | "CAROUSEL" | string;
  is_video?: boolean;
  thumbnail: string;
  views?: number;
  published_at: string;
  collected_at?: string;
  sentiment_summary: PostSentimentBreakdown;
  comments: TrendingComment[];
}

export interface InstagramUserInfo {
  username?: string;
  full_name?: string;
  biography?: string;
  followers_count?: number;
  following_count?: number;
  media_count?: number;
  profile_pic_url?: string;
  is_verified?: boolean;
  is_private?: boolean;
}

export interface InstagramScrapeStatus {
  executed: boolean;
  skipped_reason: string | null;
  posts_scraped: number;
  posts_new: number;
  daily_limit: number;
  errors: string[];
}

export interface InstagramPostsStats {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
}

export interface InstagramPostsData {
  platform: string;
  username: string;
  scrape: InstagramScrapeStatus | null;
  user_info: InstagramUserInfo;
  stats: InstagramPostsStats;
  sentiment: PostSentimentOverview;
  items: InstagramPostItem[];
}

export interface InstagramPostsSearchData {
  platform: string;
  query: string | null;
  total: number;
  limit: number;
  offset: number;
  sentiment: PostSentimentOverview;
  items: InstagramPostItem[];
}
