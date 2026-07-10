import { api } from "@/lib/api";
import type { TwitterComment } from "../types/posts.types";
import type { TwitterTrendingData, TwitterTrendingPost, TwitterTrendingTopic } from "../types/trending.types";

interface RawTrendingPost {
  post_id: string;
  url: string;
  text: string;
  likes: number;
  retweets?: number;
  views?: number;
  comment_count: number;
  published_at: string;
  comments: TwitterComment[];
}

interface RawTrendingTopic extends Omit<TwitterTrendingTopic, "posts"> {
  posts: RawTrendingPost[];
}

interface RawTwitterTrendingData extends Omit<TwitterTrendingData, "topics"> {
  topics: RawTrendingTopic[];
}

function normalizeTrendingPost(raw: RawTrendingPost): TwitterTrendingPost {
  return {
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.text,
    likes: raw.likes,
    retweet_count: raw.retweets,
    view_count: raw.views,
    comment_count: raw.comment_count,
    published_at: raw.published_at,
    comments: raw.comments ?? [],
  };
}

export async function getTwitterTrending(): Promise<TwitterTrendingData> {
  const { data } = await api.get<{ data: RawTwitterTrendingData }>("/api/v1/twitter/trending");
  const raw = data.data;

  return {
    ...raw,
    topics: raw.topics.map((topic) => ({
      ...topic,
      posts: topic.posts.map(normalizeTrendingPost),
    })),
  };
}
