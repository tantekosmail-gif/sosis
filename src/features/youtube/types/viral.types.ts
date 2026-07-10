export interface SentimentBreakdownEntry {
  count: number;
  percentage: number;
}

export interface ViralSentimentBreakdown {
  positif: SentimentBreakdownEntry;
  negatif: SentimentBreakdownEntry;
  netral: SentimentBreakdownEntry;
}

export interface ViralSentimentOverview extends ViralSentimentBreakdown {
  dominant: "positif" | "netral" | "negatif" | string;
  total_analyzed: number;
}

export interface ViralComment {
  id: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
}

export interface ViralVideoItem {
  rank: number;
  video_id: string;
  url: string;
  title: string;
  channel: string;
  view_count: number;
  thumbnail_url: string;
  duration: string;
  published_at: string;
  keyword: string;
  comment_count: number;
  sentiment_summary: ViralSentimentBreakdown;
  comments: ViralComment[];
}

export interface ViralStats {
  total_videos: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
}

export interface ViralVideoData {
  total: number;
  note: string;
  filter: {
    keyword_id: string | null;
    q: string | null;
  };
  stats: ViralStats;
  sentiment: ViralSentimentOverview;
  items: ViralVideoItem[];
}
