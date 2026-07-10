export type ComparablePlatform = "facebook" | "instagram" | "twitter" | "tiktok";

export interface PlatformSentimentCounts {
  positif: number;
  netral: number;
  negatif: number;
}

export interface PlatformTopItem {
  postId: string;
  url: string;
  caption: string;
  likes: number;
  commentCount: number;
  publishedAt: string;
}

export interface PlatformSearchResult {
  platform: ComparablePlatform;
  keyword: string;
  totalPosts: number;
  totalComments: number;
  totalAnalyzed: number;
  sentiment: PlatformSentimentCounts;
  topItems: PlatformTopItem[];
}
