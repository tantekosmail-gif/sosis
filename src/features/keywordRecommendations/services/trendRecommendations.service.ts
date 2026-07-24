import { api } from "@/lib/api";

export type TrendRecommendationStatus = "pending" | "used";

export interface TrendRecommendation {
  id: string;
  topic: string;
  score: number;
  source: string;
  recommendation_date: string;
  status: TrendRecommendationStatus;
  keywords?: string[];
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
  keywords?: string[];
}

// POST /api/v1/trend-recommendations/manual — tambah/naikkan score topik,
// masuk pool yg dibaca auto-crawl. score 0-1, default 1 (backend). keywords
// opsional -- daftar keyword terkait yang ikut di-crawl bersama topik ini.
export async function submitManualTopic(input: ManualTopicInput): Promise<void> {
  await api.post("/api/v1/trend-recommendations/manual", {
    topic: input.topic,
    score: input.score,
    keywords: input.keywords?.length ? input.keywords : undefined,
  });
}

// GET /api/v1/trend-recommendations/{id}/keywords — daftar keyword terkait
// milik satu topik (rekomendasi). Dipakai supaya pencarian berdasarkan topik
// tidak cuma mengandalkan nama topik itu sendiri, tapi semua keyword
// terkaitnya sekaligus (mis. "KPK", "Komisi Pemberantasan Korupsi", "pimpinan
// KPK", dst digabung jadi satu pencarian gabungan).
export async function getTrendRecommendationKeywords(id: string): Promise<string[]> {
  const { data } = await api.get(`/api/v1/trend-recommendations/${id}/keywords`);
  return data.data?.keywords ?? [];
}
