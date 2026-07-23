import { api } from "@/lib/api";

export type TrendRecommendationStatus = "pending" | "used";

export interface TrendRecommendation {
  topic: string;
  score: number;
  source: string;
  recommendation_date: string;
  status: TrendRecommendationStatus;
}

export interface TrendRecommendationsResponse {
  topics: TrendRecommendation[];
  count: number;
}

// GET /api/v1/trend-recommendations — topik yg SAAT INI dipakai auto-crawl
// YouTube tiap jam (top 20 by score, dedup per topik).
export async function listTrendRecommendations(): Promise<TrendRecommendationsResponse> {
  const { data } = await api.get("/api/v1/trend-recommendations");
  return data.data;
}

export interface ManualTopicInput {
  topic: string;
  score?: number;
}

// POST /api/v1/trend-recommendations/manual — tambah/naikkan score topik,
// masuk pool yg dibaca auto-crawl. score 0-1, default 1 (backend).
export async function submitManualTopic(input: ManualTopicInput): Promise<void> {
  await api.post("/api/v1/trend-recommendations/manual", {
    topic: input.topic,
    score: input.score,
  });
}
