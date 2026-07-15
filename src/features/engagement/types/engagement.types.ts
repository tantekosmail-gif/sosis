export type EngagementPlatform = "youtube" | "tiktok" | "twitter" | "facebook" | "instagram";

export interface EngagementBreakdown {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  replies: number;
  clicks: number;
}

export interface EngagementSummary {
  platform: EngagementPlatform;
  exposure: number;
  reach: number;
  engagement: number;
  breakdown: EngagementBreakdown;
  sentimentScore: number;
  mentionGrowth: number | null;
  mentions: number;
}

export interface EngagementTrendPoint {
  period: string;
  mentions: number;
}

export interface EngagementTrend {
  platform: EngagementPlatform;
  series: EngagementTrendPoint[];
}

export interface RawMetricsSummaryResponse {
  success: boolean;
  data: {
    scope: string;
    platforms: string[];
    period: { from: string; to: string };
    metrics: {
      exposure: { value: number | null };
      reach: { value: number | null };
      engagement: {
        value: number;
        breakdown: {
          likes: number;
          comments: number;
          shares: number;
          saves: number;
          replies: number;
          clicks: number;
        };
      };
      sentiment_score: { value: number | null };
      mention_growth: { value: number | null; available: boolean };
      mentions: { value: number };
    };
  };
}

export interface RawMetricsTrendResponse {
  success: boolean;
  data: {
    scope: string;
    granularity: string;
    platforms: string[];
    period: { from: string; to: string };
    series: { period: string; mentions: number }[];
  };
}
