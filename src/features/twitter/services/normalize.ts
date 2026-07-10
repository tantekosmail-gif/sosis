import type { TwitterPostItem, TwitterSentimentBreakdown } from "../types/posts.types";

const EMPTY_SENTIMENT: TwitterSentimentBreakdown = {
  positif: { count: 0, percentage: 0 },
  netral: { count: 0, percentage: 0 },
  negatif: { count: 0, percentage: 0 },
};

export interface RawTweetItem {
  rank?: number;
  tweet_id: string;
  url: string;
  text: string;
  author?: string;
  likes: number;
  retweets?: number;
  quotes?: number;
  views?: number;
  comment_count: number;
  published_at: string;
  collected_at?: string;
  sentiment_summary?: TwitterSentimentBreakdown;
  comments: TwitterPostItem["comments"];
}

export function normalizeTweetItem(raw: RawTweetItem): TwitterPostItem {
  return {
    rank: raw.rank,
    post_id: raw.tweet_id,
    url: raw.url,
    caption: raw.text,
    author: raw.author,
    likes: raw.likes,
    comment_count: raw.comment_count,
    retweet_count: raw.retweets,
    quote_count: raw.quotes,
    view_count: raw.views,
    published_at: raw.published_at,
    collected_at: raw.collected_at,
    sentiment_summary: raw.sentiment_summary ?? EMPTY_SENTIMENT,
    comments: raw.comments ?? [],
  };
}
