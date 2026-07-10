import { api } from "@/lib/api";
import type { NewsAnalysisSummary } from "../types/summary.types";

export async function getNewsAnalysisSummary(topN = 15): Promise<NewsAnalysisSummary> {
  const { data } = await api.get<{ data: NewsAnalysisSummary }>("/api/v1/news/analysis/summary", {
    params: { top_n: topN },
  });
  return data.data;
}
