export interface InstagramSummarySentimentEntry {
  count: number;
  percentage: number;
}

export interface InstagramSummarySentimentBreakdown {
  positif: InstagramSummarySentimentEntry;
  negatif: InstagramSummarySentimentEntry;
  netral: InstagramSummarySentimentEntry;
}

export interface InstagramOverallSummary {
  total_posts: number;
  total_comments: number;
  total_analyzed: number;
  fully_analyzed: boolean;
  sentiment: InstagramSummarySentimentBreakdown;
}

export interface InstagramAccountSummary {
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

export interface InstagramAnalysisSummary {
  overall: InstagramOverallSummary;
  per_account: InstagramAccountSummary[];
}
