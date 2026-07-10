import { api } from "@/lib/api";
import type { FacebookComment, FacebookTrendingData, FacebookTrendingPost, FacebookTrendingTopic } from "../types/trending.types";

interface RawTrendingPost {
  post_id: string;
  url: string;
  message: string;
  likes: number;
  comment_count: number;
  published_at: string;
  comments: FacebookComment[];
}

interface RawTrendingTopic extends Omit<FacebookTrendingTopic, "posts"> {
  posts: RawTrendingPost[];
}

interface RawFacebookTrendingData extends Omit<FacebookTrendingData, "topics"> {
  topics: RawTrendingTopic[];
}

function normalizeTrendingPost(raw: RawTrendingPost): FacebookTrendingPost {
  return {
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.message,
    likes: raw.likes,
    comment_count: raw.comment_count,
    published_at: raw.published_at,
    comments: raw.comments ?? [],
  };
}

export async function getFacebookTrending(): Promise<FacebookTrendingData> {
  const { data } = await api.get<{ data: RawFacebookTrendingData }>("/api/v1/facebook/trending");
  const raw = data.data;

  return {
    ...raw,
    topics: raw.topics.map((topic) => ({
      ...topic,
      posts: topic.posts.map(normalizeTrendingPost),
    })),
  };
}
