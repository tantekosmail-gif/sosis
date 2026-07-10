export interface FacebookSentimentEntry {
  count: number;
  percentage: number;
}

export interface FacebookSentimentBreakdown {
  positif: FacebookSentimentEntry;
  negatif: FacebookSentimentEntry;
  netral: FacebookSentimentEntry;
}

export interface FacebookComment {
  id?: string;
  comment_id?: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface FacebookTrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  comment_count: number;
  thumbnail?: string;
  published_at: string;
  comments: FacebookComment[];
}

export interface FacebookTrendingTopic {
  topic: string;
  score: number;
  status: string;
  facebook_identifier: string;
  sentiment: FacebookSentimentBreakdown;
  posts: FacebookTrendingPost[];
}

export interface FacebookTrendingData {
  platform: string;
  date: string;
  total_topics: number;
  daily_budget: number;
  schedule: string;
  topics: FacebookTrendingTopic[];
}
