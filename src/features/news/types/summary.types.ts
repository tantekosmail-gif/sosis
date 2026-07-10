export interface NewsSentimentEntry {
  count: number;
  percentage: number;
}

export interface NewsSentimentBreakdown {
  positif: NewsSentimentEntry;
  negatif: NewsSentimentEntry;
  netral: NewsSentimentEntry;
  caveat?: string;
}

export interface NewsEntity {
  text: string;
  type: string;
  mentions: number;
}

export interface NewsTrendingEntities {
  by_type: Record<string, number>;
  top: NewsEntity[];
}

export interface NewsSource {
  domain: string;
  articles: number;
}

export interface NewsAnalysisSummary {
  total_articles: number;
  total_analyzed: number;
  fully_analyzed: boolean;
  sentiment: NewsSentimentBreakdown;
  trending_entities: NewsTrendingEntities;
  sources: NewsSource[];
}
