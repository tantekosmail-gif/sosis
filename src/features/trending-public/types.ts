export interface TrendingPublicVideo {
  title: string;
  url: string;
  channel: string;
  thumbnail: string;
  views: number;
  likes: number;
  published_at: string;
}

export interface TrendingPublicTopic {
  rank: number;
  title: string;
  traffic: string;
  description: string;
  fetched_at: string;
  video_count: number;
  top_videos: TrendingPublicVideo[];
}

export interface TrendingPublicDay {
  date: string;
  topics: TrendingPublicTopic[];
}

export interface TrendingPublicData {
  geo: string;
  days: TrendingPublicDay[];
}

export interface TrendingPublicResponse {
  success: boolean;
  data: TrendingPublicData;
}
