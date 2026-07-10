export interface TrendFeedItem {
  id: string;
  source_type: string;
  platform: string;
  author: string;
  content: string;
  url: string;
  published_at: string;
}

export interface TrendFeedData {
  keyword: string;
  date_from: string;
  date_to: string;
  platform: string;
  total: number;
  items: TrendFeedItem[];
}
