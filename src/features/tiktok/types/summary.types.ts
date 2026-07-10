export interface TikTokSummarySentimentEntry {
  count: number;
  percentage: number;
}

export interface TikTokSummarySentimentBreakdown {
  positif: TikTokSummarySentimentEntry;
  negatif: TikTokSummarySentimentEntry;
  netral: TikTokSummarySentimentEntry;
}

export interface TikTokOverallSummary {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  fully_analyzed: boolean;
  sentiment: TikTokSummarySentimentBreakdown;
}

export interface TikTokAccountSummary {
  username: string;
  post_count: number;
  comment_count: number;
  analyzed_count: number;
  fully_analyzed: boolean;
  sentiment: {
    positif: number;
    negatif: number;
    netral: number;
  };
}

export interface TikTokAnalysisSummary {
  overall: TikTokOverallSummary;
  per_account: TikTokAccountSummary[];
}
