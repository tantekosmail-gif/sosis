import { api } from "@/lib/api";
import type { TrendFeedData } from "../types/feed.types";

export async function getTrendFeed(params: {
  keyword: string;
  hours?: number;
  limit?: number;
}): Promise<TrendFeedData> {
  const { data } = await api.get<{ data: TrendFeedData }>("/api/v1/trend-discovery/feed", {
    params: {
      keyword: params.keyword,
      hours: params.hours ?? 24,
      limit: params.limit ?? 20,
    },
  });

  return data.data;
}
