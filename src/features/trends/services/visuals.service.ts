import { api } from "@/lib/api";
import type { TrendVisualsData } from "../types/visuals.types";

export async function getTrendVisuals(params: {
  keyword: string;
  hours?: number;
  limit?: number;
}): Promise<TrendVisualsData> {
  const { data } = await api.get<{ data: TrendVisualsData }>("/api/v1/trend-discovery/visuals", {
    params: {
      keyword: params.keyword,
      hours: params.hours ?? 24,
      limit: params.limit ?? 12,
    },
  });

  return data.data;
}
