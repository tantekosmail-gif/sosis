import { api } from "@/lib/api";
import type { TrendRecommendationItem } from "../types/recommendations.types";

export async function getTrendRecommendations(params: {
  limit?: number;
}): Promise<TrendRecommendationItem[]> {
  const { data } = await api.get("/api/v1/trend-recommendations", {
    params: { limit: params.limit },
  });

  return data.data;
}
