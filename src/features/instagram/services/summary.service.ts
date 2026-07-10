import { api } from "@/lib/api";
import type { InstagramAnalysisSummary } from "../types/summary.types";

export async function getInstagramAnalysisSummary(): Promise<InstagramAnalysisSummary> {
  const { data } = await api.get<{ data: InstagramAnalysisSummary }>("/api/v1/instagram/analysis/summary");
  return data.data;
}
