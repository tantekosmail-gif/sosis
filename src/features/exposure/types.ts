export interface ExposureResponse {
  analyze_name: string;
  status: boolean;
  execution_time: number;
  data: ExposureData;
}

export interface ExposureData {
  total: number;

  positive: number;

  negative: number;

  neutral: number;

  engagement: number;

  timeline: TimelineItem[];

  platforms: PlatformItem[];

  posts: PostItem[];
}

export interface TimelineItem {
  date: string;

  value: number;
}

export interface PlatformItem {
  platform: string;

  total: number;
}

export interface PostItem {
  id: string;

  platform: string;

  author: string;

  text: string;

  created_at: string;

  engagement: number;
}