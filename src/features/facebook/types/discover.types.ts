export interface FacebookDiscoverAccount {
  platform: string;
  username: string;
}

export interface FacebookDiscoverSamplePost {
  message: string;
  author: string;
  url: string;
  identifier_extracted: string;
}

export interface FacebookDiscoverSubmission {
  created: string[];
  updated: string[];
  evicted: string[];
  rejected: string[];
}

export interface FacebookDiscoverResult {
  keyword: string;
  posts_found: number;
  accounts_found: FacebookDiscoverAccount[];
  submitted: FacebookDiscoverSubmission;
  sample_posts: FacebookDiscoverSamplePost[];
}
