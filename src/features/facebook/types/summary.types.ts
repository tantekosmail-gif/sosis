export interface FacebookSummarySentimentEntry {
  count: number;
  percentage: number;
}

export interface FacebookSummarySentimentBreakdown {
  positif: FacebookSummarySentimentEntry;
  negatif: FacebookSummarySentimentEntry;
  netral: FacebookSummarySentimentEntry;
}

export interface FacebookOverallSummary {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  fully_analyzed: boolean;
  sentiment: FacebookSummarySentimentBreakdown;
}

export interface FacebookAccountSummary {
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

export interface FacebookAnalysisSummary {
  overall: FacebookOverallSummary;
  per_account: FacebookAccountSummary[];
}
