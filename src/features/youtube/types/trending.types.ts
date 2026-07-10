export interface YoutubeTrendingItem {
  id: string;
  rank: number;
  title: string;
  traffic: string;
  description: string;
  geo: string;
  period: string;
  published_at: string;
  fetched_at: string;
}

export interface YoutubeTrendingFilter {
  date_from: string | null;
  date_to: string | null;
  hour: number | null;
}

export interface YoutubeTrendingData {
  geo: string;
  period: string;
  filter: YoutubeTrendingFilter;
  total: number;
  offset: number;
  items: YoutubeTrendingItem[];
}
