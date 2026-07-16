import { api } from "@/lib/api";

export interface SearchRecentParams {
  keyword: string;
  hoursBack?: number;
  maxResults?: number;
}

export async function searchRecentVideos(params: SearchRecentParams) {
  const { data } = await api.get("/api/v1/youtube/search-recent", {
    params: {
      keyword: params.keyword,
      hours_back: params.hoursBack ?? 24,
      max_results: params.maxResults ?? 50,
    },
  });

  return data;
}
