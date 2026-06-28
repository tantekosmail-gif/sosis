export interface DashboardSummary {
  totalPosts: number;
  totalComments: number;
  engagement: number;
  reach: number;
}

export interface DashboardSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface DashboardTimeline {
  date: string;
  total: number;
}

export interface DashboardWord {
  keyword: string;
  total: number;
}

export interface DashboardPost {
  id: string;
  title: string;
  author: string;
  publishedAt: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  sentiment: "positive" | "neutral" | "negative";
  url: string;
}

export interface DashboardPlatform {
  platform: string;
  total: number;
}

export interface DashboardData {
  summary: DashboardSummary;

  sentiment: DashboardSentiment;

  timeline: DashboardTimeline[];

  topPosts: DashboardPost[];

  wordCloud: DashboardWord[];

  platformDistribution: DashboardPlatform[];
}