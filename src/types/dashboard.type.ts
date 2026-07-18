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
  positive?: number;
  neutral?: number;
  negative?: number;
}

export interface DashboardComment {
  id: string;
  author: string;
  content: string;
  sentiment: "positive" | "neutral" | "negative";
  publishedAt: string;
  videoUrl?: string;
  likes?: number;
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
  /** null = belum ada komentar yang dianalisis untuk konten ini — UI tidak
   *  menampilkan label sentimen, bukan memfallback ke "netral". */
  sentiment: "positive" | "neutral" | "negative" | null;
  url: string;
}

export interface DashboardPlatform {
  platform: string;
  total: number;
}

export interface DashboardData {
  platform: string;
  keyword: string;
  summary: DashboardSummary;
  sentiment: DashboardSentiment;
  timeline: DashboardTimeline[];
  topPosts: DashboardPost[];
  wordCloud: DashboardWord[];
  platformDistribution: DashboardPlatform[];
  comments: DashboardComment[];
  videos: any[];
  stats: any;
}