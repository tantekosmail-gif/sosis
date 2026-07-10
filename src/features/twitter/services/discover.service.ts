import { api } from "@/lib/api";
import type { TwitterDiscoverResult } from "../types/discover.types";

export async function discoverTwitterAccounts(params: {
  keyword: string;
  maxResults?: number;
}): Promise<TwitterDiscoverResult> {
  const { data } = await api.post<{ data: TwitterDiscoverResult }>("/api/v1/twitter/discover", null, {
    params: {
      keyword: params.keyword,
      max_results: params.maxResults ?? 10,
    },
  });

  return data.data;
}
