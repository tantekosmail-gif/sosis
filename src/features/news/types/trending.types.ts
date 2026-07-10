import type { NewsArticleBase } from "./article.types";

export interface NewsSentimentScore {
  label: string;
  score: number;
}

export interface NewsTrendingItem extends NewsArticleBase {
  sentiment: NewsSentimentScore | null;
}

export interface NewsTrendingData {
  date: string;
  total_articles: number;
  source: string;
  items: NewsTrendingItem[];
}
