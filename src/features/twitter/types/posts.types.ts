export interface TwitterSentimentEntry {
  count: number;
  percentage: number;
}

export interface TwitterSentimentBreakdown {
  positif: TwitterSentimentEntry;
  negatif: TwitterSentimentEntry;
  netral: TwitterSentimentEntry;
}

export interface TwitterSentimentOverview extends TwitterSentimentBreakdown {
  dominant: string;
  total_analyzed: number;
}

export interface TwitterComment {
  id?: string;
  comment_id?: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface TwitterPostItem {
  rank?: number;
  post_id: string;
  url: string;
  caption: string;
  author?: string;
  likes: number;
  comment_count: number;
  retweet_count?: number;
  quote_count?: number;
  view_count?: number;
  thumbnail?: string;
  published_at: string;
  collected_at?: string;
  sentiment_summary: TwitterSentimentBreakdown;
  comments: TwitterComment[];
}

export interface TwitterPageInfo {
  username?: string;
  name?: string;
  followers?: number;
  profile_image_url?: string;
  is_verified?: boolean;
}

export interface TwitterScrapeStatus {
  executed: boolean;
  skipped_reason: string | null;
  posts_scraped: number;
  posts_new: number;
  daily_limit: number;
  errors: string[];
}

export interface TwitterPostsStats {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
}

export interface TwitterPostsData {
  platform: string;
  username: string;
  scrape: TwitterScrapeStatus | null;
  page_info: TwitterPageInfo;
  stats: TwitterPostsStats;
  sentiment: TwitterSentimentOverview;
  items: TwitterPostItem[];
}

export interface TwitterProfileData {
  username: string;
  name?: string;
  followers_count?: number;
  description?: string;
  profile_image_url?: string;
  [key: string]: unknown;
}

export interface TwitterPostsSearchData {
  platform: string;
  query: string | null;
  total: number;
  limit: number;
  offset: number;
  sentiment: TwitterSentimentOverview;
  items: TwitterPostItem[];
}
