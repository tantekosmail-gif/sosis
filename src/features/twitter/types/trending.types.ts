import type { TwitterComment } from "./posts.types";

export interface TwitterTrendingSentimentEntry {
  count: number;
  percentage: number;
}

export interface TwitterTrendingSentimentBreakdown {
  positif: TwitterTrendingSentimentEntry;
  negatif: TwitterTrendingSentimentEntry;
  netral: TwitterTrendingSentimentEntry;
}

export interface TwitterTrendingPost {
  post_id: string;
  url: string;
  caption: string;
  likes: number;
  retweet_count?: number;
  view_count?: number;
  comment_count: number;
  published_at: string;
  comments: TwitterComment[];
}

export interface TwitterTrendingTopic {
  topic: string;
  score: number;
  status: string;
  twitter_identifier: string;
  sentiment: TwitterTrendingSentimentBreakdown;
  posts: TwitterTrendingPost[];
}

export interface TwitterTrendingData {
  platform: string;
  date: string;
  total_topics: number;
  daily_budget: number;
  schedule: string;
  topics: TwitterTrendingTopic[];
}
