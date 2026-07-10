export interface TrendTimelinePoint {
  bucket: string;
  count: number;
}

export interface TrendTimelineSeries {
  total_mentions: number;
  total: TrendTimelinePoint[];
}

export interface TrendTimelineData {
  mode: string;
  date_from: string;
  date_to: string;
  since: string;
  until: string;
  interval: string;
  platform: string;
  keywords: string[];
  series: Record<string, TrendTimelineSeries>;
}
