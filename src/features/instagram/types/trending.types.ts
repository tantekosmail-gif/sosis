export interface TrendingSentimentEntry {
  count: number;
  percentage: number;
}

export interface TrendingSentimentBreakdown {
  positif: TrendingSentimentEntry;
  negatif: TrendingSentimentEntry;
  netral: TrendingSentimentEntry;
}

export interface TrendingComment {
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface TrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  comment_count: number;
  thumbnail: string;
  published_at: string;
  comments: TrendingComment[];
}

export interface TrendingAccount {
  rank: number;
  username: string;
  display_name: string;
  followers: number;
  trending_score: number;
  engagement_rate: number;
  virality_score: number;
  source: string;
  discovered_via: string;
  last_scraped: string | null;
  sentiment: TrendingSentimentBreakdown;
  posts: TrendingPost[];
}

export interface InstagramTrendingData {
  platform: string;
  total_accounts: number;
  updated_daily: string;
  accounts: TrendingAccount[];
}
