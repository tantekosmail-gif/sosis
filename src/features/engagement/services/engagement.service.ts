import { api } from "@/lib/api";
import type {
  EngagementPlatform,
  EngagementSummary,
  EngagementTrend,
  RawMetricsSummaryResponse,
  RawMetricsTrendResponse,
} from "../types/engagement.types";

interface RangeParams {
  dateFrom: string;
  dateTo: string;
}

export async function fetchEngagementSummary(
  platform: EngagementPlatform,
  { dateFrom, dateTo }: RangeParams
): Promise<EngagementSummary> {
  const { data } = await api.get<RawMetricsSummaryResponse>("/api/v1/metrics/summary", {
    params: { platforms: platform, date_from: dateFrom, date_to: dateTo },
  });

  const m = data.data.metrics;
  return {
    platform,
    exposure: m.exposure.value ?? 0,
    reach: m.reach.value ?? 0,
    engagement: m.engagement.value,
    breakdown: {
      likes: m.engagement.breakdown.likes,
      comments: m.engagement.breakdown.comments,
      shares: m.engagement.breakdown.shares,
      saves: m.engagement.breakdown.saves,
      replies: m.engagement.breakdown.replies,
      clicks: m.engagement.breakdown.clicks,
    },
    sentimentScore: m.sentiment_score.value ?? 0,
    mentionGrowth: m.mention_growth.available ? m.mention_growth.value : null,
    mentions: m.mentions.value,
  };
}

export async function fetchEngagementTrend(
  platform: EngagementPlatform,
  { dateFrom, dateTo }: RangeParams
): Promise<EngagementTrend> {
  const { data } = await api.get<RawMetricsTrendResponse>("/api/v1/metrics/trend", {
    params: { platforms: platform, granularity: "day", date_from: dateFrom, date_to: dateTo },
  });

  return {
    platform,
    series: data.data.series.map((point) => ({ period: point.period, mentions: point.mentions })),
  };
}
