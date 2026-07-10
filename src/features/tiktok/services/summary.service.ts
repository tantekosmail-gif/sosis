import { api } from "@/lib/api";
import type { TikTokAnalysisSummary } from "../types/summary.types";

export async function getTikTokAnalysisSummary(): Promise<TikTokAnalysisSummary> {
  const { data } = await api.get<{ data: TikTokAnalysisSummary }>("/api/v1/tiktok/analysis/summary");
  return data.data;
}
