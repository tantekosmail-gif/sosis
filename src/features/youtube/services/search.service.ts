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
      hours_back: params.hoursBack ?? 168,
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

export interface SentimentDistributionEntry {
  label: "positif" | "negatif" | "netral";
  count: number;
  percentage: number;
}

export interface SentimentDistributionResponse {
  keyword_id: string;
  keyword_text: string;
  total_comments: number;
  distribution: SentimentDistributionEntry[];
}

// GET /api/v1/youtube/sentiment/distribution — distribusi sentimen dari SELURUH
// komentar yang sudah dianalisis untuk satu keyword_id (bukan cuma sentiment_top_n
// video teratas seperti di search-recent). Cuma berlaku utk keyword yang sudah
// tersimpan sebagai bagian dari topik (punya keyword_id), bukan sembarang teks.
export async function getSentimentDistribution(keywordId: string): Promise<SentimentDistributionResponse> {
  const { data } = await api.get("/api/v1/youtube/sentiment/distribution", {
    params: { keyword_id: keywordId },
  });
  return data.data;
}
