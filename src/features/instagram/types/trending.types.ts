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
  id?: string;
  comment_id?: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface InstagramTrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  comment_count: number;
  thumbnail?: string;
  published_at: string;
  comments: TrendingComment[];
}

export interface InstagramTrendingTopic {
  topic: string;
  score: number;
  status: string;
  instagram_identifier: string;
  sentiment: TrendingSentimentBreakdown;
  posts: InstagramTrendingPost[];
}

export interface InstagramTrendingData {
  platform: string;
  date: string;
  total_topics: number;
  updated_daily: string;
  message?: string;
  topics: InstagramTrendingTopic[];
}
