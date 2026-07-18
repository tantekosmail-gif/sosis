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
      // Minta backend sekalian menganalisis sentimen komentar untuk hasil
      // teratas — tanpa ini response hanya daftar video mentah.
      analyze_sentiment: true,
      sentiment_top_n: 20,
      max_comments_per_video: 100,
    },
  });

  return data;
}
