import type { ViralSentimentOverview, ViralVideoItem } from "../types/viral.types";

const SENTIMENT_KEYS = ["positif", "netral", "negatif"] as const;

export interface AggregatedViralStats {
  total_videos: number;
  total_comments: number;
  total_analyzed: number;
  coverage_pct: number;
  avg_views: number;
}

export function aggregateViralStats(items: ViralVideoItem[]): { stats: AggregatedViralStats; sentiment: ViralSentimentOverview } {
  const totals = { positif: 0, netral: 0, negatif: 0 };
  let totalComments = 0;
  let totalViews = 0;

  for (const item of items) {
    totalComments += item.comment_count ?? 0;
    totalViews += item.view_count ?? 0;
    for (const key of SENTIMENT_KEYS) {
      totals[key] += item.sentiment_summary?.[key]?.count ?? 0;
    }
  }

  const totalAnalyzed = totals.positif + totals.netral + totals.negatif;

  const breakdown = SENTIMENT_KEYS.reduce(
    (acc, key) => {
      acc[key] = {
        count: totals[key],
        percentage: totalAnalyzed > 0 ? (totals[key] / totalAnalyzed) * 100 : 0,
      };
      return acc;
    },
    {} as ViralSentimentOverview
  );

  const dominant = totalAnalyzed > 0
    ? SENTIMENT_KEYS.reduce((a, b) => (totals[b] > totals[a] ? b : a))
    : "netral";

  return {
    stats: {
      total_videos: items.length,
      total_comments: totalComments,
      total_analyzed: totalAnalyzed,
      coverage_pct: totalComments > 0 ? (totalAnalyzed / totalComments) * 100 : 0,
      avg_views: items.length > 0 ? totalViews / items.length : 0,
    },
    sentiment: {
      ...breakdown,
      dominant,
      total_analyzed: totalAnalyzed,
    },
  };
}
