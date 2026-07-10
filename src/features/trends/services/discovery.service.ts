import { api } from "@/lib/api";
import type { TrendDiscoveryData, TrendDiscoverySource } from "../types/discovery.types";

export async function getTrendDiscovery(params: {
  date?: string;
  minConfidence?: number;
} = {}): Promise<TrendDiscoveryData> {
  const { data } = await api.get<{ data: TrendDiscoveryData }>("/api/v1/trend-discovery", {
    params: {
      date: params.date || undefined,
      min_confidence: params.minConfidence,
    },
  });

  return data.data;
}

export async function getTrendDiscoveryBySource(
  source: TrendDiscoverySource,
  params: { date?: string } = {}
): Promise<TrendDiscoveryData> {
  const { data } = await api.get<{ data: TrendDiscoveryData }>(`/api/v1/trend-discovery/${source}`, {
    params: {
      date: params.date || undefined,
    },
  });

  return data.data;
}
