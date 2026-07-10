export interface TwitterDiscoverAccount {
  platform: string;
  username: string;
}

export interface TwitterDiscoverSamplePost {
  text: string;
  author: string;
  url: string;
  identifier_extracted: string;
}

export interface TwitterDiscoverSubmission {
  created: string[];
  updated: string[];
  evicted: string[];
  rejected: string[];
}

export interface TwitterDiscoverResult {
  keyword: string;
  posts_found: number;
  accounts_found: TwitterDiscoverAccount[];
  submitted: TwitterDiscoverSubmission;
  sample_posts: TwitterDiscoverSamplePost[];
}
