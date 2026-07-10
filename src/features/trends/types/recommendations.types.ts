export interface TrendRelatedAccount {
  platform: string;
  username: string;
}

export interface TrendRecommendationItem {
  id: string;
  topic: string;
  score: number;
  related_accounts: TrendRelatedAccount[];
  source: string;
  recommendation_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}
