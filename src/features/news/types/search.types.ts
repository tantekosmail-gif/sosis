import type { NewsArticleBase } from "./article.types";
import type { NewsSentimentScore } from "./trending.types";

export interface NewsSearchItem extends NewsArticleBase {
  // Sebagian sumber cuma kirim label string, sebagian objek {label, score} —
  // NewsResultCard menangani keduanya, tampilkan skor persentase kalau ada.
  sentiment: NewsSentimentScore | string | null;
}

export interface NewsSearchData {
  query: string;
  source: string;
  total: number;
  items: NewsSearchItem[];
}
