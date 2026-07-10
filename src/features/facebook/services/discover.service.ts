import { api } from "@/lib/api";
import type { FacebookDiscoverResult } from "../types/discover.types";

export async function discoverFacebookAccounts(params: {
  keyword: string;
  maxResults?: number;
}): Promise<FacebookDiscoverResult> {
  const { data } = await api.post<{ data: FacebookDiscoverResult }>("/api/v1/facebook/discover", null, {
    params: {
      keyword: params.keyword,
      max_results: params.maxResults ?? 10,
    },
  });

  return data.data;
}
