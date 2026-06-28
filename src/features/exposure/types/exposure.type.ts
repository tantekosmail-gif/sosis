export interface ExposureResponse {
  total: number;
  engagement: number;
  reach: number;
  sentimentScore: number;
}

export interface TimelineItem {
  date: string;
  exposure: number;
}