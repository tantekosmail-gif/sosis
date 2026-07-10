import { api } from "@/lib/api";
import type { TrendRecommendationItem } from "../types/recommendations.types";

export async function getTrendRecommendations(params: {
  limit?: number;
  recommendationDate?: string;
}): Promise<TrendRecommendationItem[]> {
  const { data } = await api.get("/api/v1/trend-recommendations", {
    params: {
      limit: params.limit,
      recommendation_date: params.recommendationDate || undefined,
    },
  });

  return data.data;
}
