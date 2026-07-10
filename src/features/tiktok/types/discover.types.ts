export interface TikTokDiscoverAccount {
  platform: string;
  username: string;
}

export interface TikTokDiscoverSamplePost {
  caption: string;
  author: string;
  url: string;
  identifier_extracted: string;
}

export interface TikTokDiscoverSubmission {
  created: string[];
  updated: string[];
  evicted: string[];
  rejected: string[];
}

export interface TikTokDiscoverResult {
  keyword: string;
  posts_found: number;
  accounts_found: TikTokDiscoverAccount[];
  submitted: TikTokDiscoverSubmission;
  sample_posts: TikTokDiscoverSamplePost[];
}
