export interface TwitterSummarySentimentEntry {
  count: number;
  percentage: number;
}

export interface TwitterSummarySentimentBreakdown {
  positif: TwitterSummarySentimentEntry;
  negatif: TwitterSummarySentimentEntry;
  netral: TwitterSummarySentimentEntry;
}

export interface TwitterOverallSummary {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  fully_analyzed: boolean;
  sentiment: TwitterSummarySentimentBreakdown;
}

export interface TwitterAccountSummary {
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

export interface TwitterAnalysisSummary {
  overall: TwitterOverallSummary;
  per_account: TwitterAccountSummary[];
}
