import { api } from "@/lib/api";
import type { TrendTimelineData } from "../types/timeline.types";

export async function getTrendTimeline(params: {
  topN?: number;
  hours?: number;
  interval?: "hour" | "day";
  includePlatformBreakdown?: boolean;
  dateFrom?: string;
  dateTo?: string;
  includeTopicClusters?: boolean;
} = {}): Promise<TrendTimelineData> {
  const { data } = await api.get<{ data: TrendTimelineData }>("/api/v1/trend-discovery/timeline", {
    params: {
      top_n: params.topN ?? 6,
      hours: params.dateFrom ? undefined : params.hours ?? 24,
      interval: params.interval ?? "hour",
      include_platform_breakdown: params.includePlatformBreakdown ?? false,
      date_from: params.dateFrom,
      date_to: params.dateTo,
      include_topic_clusters: params.includeTopicClusters,
    },
  });

  return data.data;
}
