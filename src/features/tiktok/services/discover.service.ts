import { api } from "@/lib/api";
import type { TikTokDiscoverResult } from "../types/discover.types";

export async function discoverTikTokAccounts(params: {
  keyword: string;
  maxResults?: number;
}): Promise<TikTokDiscoverResult> {
  const { data } = await api.post<{ data: TikTokDiscoverResult }>("/api/v1/tiktok/discover", null, {
    params: {
      keyword: params.keyword,
      max_results: params.maxResults ?? 10,
    },
  });

  return data.data;
}
