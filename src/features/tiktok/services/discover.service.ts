import { api } from "@/lib/api";
import type { TikTokDiscoverResult } from "../types/discover.types";

export async function discoverTikTokAccounts(params: {
  keyword: string;
  maxResults?: number;
}): Promise<TikTokDiscoverResult> {
  const { data } = await api.post<{ data: Partial<TikTokDiscoverResult> }>("/api/v1/tiktok/discover", null, {
    params: {
      keyword: params.keyword,
      max_results: params.maxResults ?? 10,
    },
  });

  const raw = data.data;
  // Backend kadang tidak sertakan array-nya sama sekali (bukan array kosong)
  // kalau hasilnya nihil -- default-kan di sini supaya UI tidak perlu peduli.
  return {
    keyword: raw.keyword ?? params.keyword,
    posts_found: raw.posts_found ?? 0,
    accounts_found: raw.accounts_found ?? [],
    submitted: {
      created: raw.submitted?.created ?? [],
      updated: raw.submitted?.updated ?? [],
      evicted: raw.submitted?.evicted ?? [],
      rejected: raw.submitted?.rejected ?? [],
    },
    sample_posts: raw.sample_posts ?? [],
  };
}
