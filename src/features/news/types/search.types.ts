import type { NewsArticleBase } from "./article.types";

export interface NewsSearchItem extends NewsArticleBase {
  sentiment: string | null;
}

export interface NewsSearchData {
  query: string;
  source: string;
  total: number;
  items: NewsSearchItem[];
}
