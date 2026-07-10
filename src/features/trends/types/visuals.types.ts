export interface TrendVisualItem {
  post_id: string;
  platform: string;
  author: string;
  url: string;
  title: string;
  thumbnail: string;
  published_at: string;
}

export interface TrendVisualsData {
  keyword: string;
  date_from: string;
  date_to: string;
  platform: string;
  total: number;
  items: TrendVisualItem[];
}
