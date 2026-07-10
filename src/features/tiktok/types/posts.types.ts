export interface TikTokSentimentEntry {
  count: number;
  percentage: number;
}

export interface TikTokSentimentBreakdown {
  positif: TikTokSentimentEntry;
  negatif: TikTokSentimentEntry;
  netral: TikTokSentimentEntry;
}

export interface TikTokSentimentOverview extends TikTokSentimentBreakdown {
  dominant: string;
  total_analyzed: number;
}

export interface TikTokComment {
  id?: string;
  comment_id?: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface TikTokPostItem {
  rank?: number;
  post_id: string;
  url: string;
  caption: string;
  author?: string;
  likes: number;
  comment_count: number;
  share_count?: number;
  view_count?: number;
  thumbnail?: string;
  published_at: string;
  collected_at?: string;
  sentiment_summary: TikTokSentimentBreakdown;
  comments: TikTokComment[];
}

export interface TikTokPageInfo {
  username?: string;
  name?: string;
  followers?: number;
  profile_image_url?: string;
  is_verified?: boolean;
}

export interface TikTokScrapeStatus {
  executed: boolean;
  skipped_reason: string | null;
  posts_scraped: number;
  posts_new: number;
  daily_limit: number;
  errors: string[];
}

export interface TikTokPostsStats {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
}

export interface TikTokPostsData {
  platform: string;
  username: string;
  scrape: TikTokScrapeStatus | null;
  page_info: TikTokPageInfo;
  stats: TikTokPostsStats;
  sentiment: TikTokSentimentOverview;
  items: TikTokPostItem[];
}

export interface TikTokPostsSearchData {
  platform: string;
  query: string | null;
  total: number;
  limit: number;
  offset: number;
  sentiment: TikTokSentimentOverview;
  items: TikTokPostItem[];
}
