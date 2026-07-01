export interface ViralVideoItem {
  rank: number;
  video_id: string;
  url: string;
  title: string;
  channel: string;
  view_count: number;
  thumbnail_url: string;
  duration: string;
  published_at: string;
  keyword: string;
}

export interface ViralComment {
  id: string;
  content: string;
  author: string;
  sentiment: "positif" | "netral" | "negatif" | string;
  score: number;
  video_url: string;
}

export interface ViralVideoData {
  total: number;
  note: string;
  filter: {
    keyword_id: string | null;
    q: string | null;
  };
  comments: ViralComment[];
  items: ViralVideoItem[];
}
