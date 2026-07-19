export interface ThreadsMedia {
  type: string;
  url: string;
}

export interface ThreadsComment {
  id: string;
  post_id: string;
  content: string;
  author: string;
  reply_to?: string | null;
  like_count: number;
  sentiment: "positif" | "netral" | "negatif" | string;
  sentiment_source: string;
  score: number;
  published_at: string;
}

export interface ThreadsPost {
  id: string;
  external_id: string;
  url: string;
  author: string;
  content: string;
  likes: number;
  replies: number;
  reposts: number;
  quotes: number;
  media: ThreadsMedia[];
  tags: string[];
  published_at: string;
  collected_at: string;
  comment_count: number;
  comments: ThreadsComment[];
}

export interface ThreadsSearchData {
  status: "ready" | "empty";
  query: string;
  total_posts?: number;
  message?: string;
  posts: ThreadsPost[];
}

export interface ThreadsSearchJob {
  status: "queued";
  query: string;
  job_id: string;
  message: string;
}

export interface ThreadsPostDetail extends ThreadsPost {
  total_comments_in_db: number;
}
