import { api } from "@/lib/api";
import type { YoutubeTrendingData } from "../types/trending.types";

export async function getYoutubeTrending(params: {
  geo?: string;
  period?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<YoutubeTrendingData> {
  const { data } = await api.get<{ data: YoutubeTrendingData }>("/api/v1/youtube/trending", {
    params: {
      geo: params.geo ?? "ID",
      period: params.period ?? "24h",
      limit: params.limit ?? 50,
      offset: params.offset ?? 0,
    },
  });

  return data.data;
}
