import type { FacebookComment } from "./trending.types";

export interface FacebookPostSentimentEntry {
  count: number;
  percentage: number;
}

export interface FacebookPostSentimentBreakdown {
  positif: FacebookPostSentimentEntry;
  negatif: FacebookPostSentimentEntry;
  netral: FacebookPostSentimentEntry;
}

export interface FacebookPostSentimentOverview extends FacebookPostSentimentBreakdown {
  dominant: string;
  total_analyzed: number;
}

export interface FacebookPostItem {
  rank?: number;
  post_id: string;
  url: string;
  caption: string;
  author?: string;
  likes: number;
  comment_count: number;
  thumbnail: string;
  published_at: string;
  collected_at?: string;
  sentiment_summary: FacebookPostSentimentBreakdown;
  comments: FacebookComment[];
}

export interface FacebookPageInfo {
  username?: string;
  name?: string;
  followers?: number;
  category?: string;
  profile_pic_url?: string;
  is_verified?: boolean;
}

export interface FacebookScrapeStatus {
  executed: boolean;
  skipped_reason: string | null;
  posts_scraped: number;
  posts_new: number;
  daily_limit: number;
  errors: string[];
}

export interface FacebookPostsStats {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
}

export interface FacebookPostsData {
  platform: string;
  username: string;
  scrape: FacebookScrapeStatus | null;
  page_info: FacebookPageInfo;
  stats: FacebookPostsStats;
  sentiment: FacebookPostSentimentOverview;
  items: FacebookPostItem[];
}

export interface FacebookProfileData {
  username: string;
  name?: string;
  followers?: number;
  description?: string;
  profile_pic_url?: string;
  [key: string]: unknown;
}

export interface FacebookPostsSearchData {
  platform: string;
  query: string | null;
  total: number;
  limit: number;
  offset: number;
  sentiment: FacebookPostSentimentOverview;
  items: FacebookPostItem[];
}
