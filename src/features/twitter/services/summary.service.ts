import { api } from "@/lib/api";
import type { TwitterAnalysisSummary } from "../types/summary.types";

export async function getTwitterAnalysisSummary(): Promise<TwitterAnalysisSummary> {
  const { data } = await api.get<{ data: TwitterAnalysisSummary }>("/api/v1/twitter/analysis/summary");
  return data.data;
}
