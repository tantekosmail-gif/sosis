export interface TrendDiscoveryRelatedAccount {
  platform: string;
  username: string;
}

export interface TrendDiscoveryTopic {
  topic: string;
  score: number;
  related_accounts: TrendDiscoveryRelatedAccount[];
  status: string;
  confirmed_by: string[] | null;
  confidence_score: number | null;
  recommendation_date: string;
}

export interface TrendDiscoveryData {
  date: string;
  total: number;
  topics: TrendDiscoveryTopic[];
  source?: string;
}

export type TrendDiscoverySource = "twitter" | "tiktok" | "instagram";
