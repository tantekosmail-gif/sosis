import { api } from "@/lib/api";
import type { FacebookAnalysisSummary } from "../types/summary.types";

export async function getFacebookAnalysisSummary(): Promise<FacebookAnalysisSummary> {
  const { data } = await api.get<{ data: FacebookAnalysisSummary }>("/api/v1/facebook/analysis/summary");
  return data.data;
}
