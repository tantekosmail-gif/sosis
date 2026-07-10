import { api } from "@/lib/api";
import type {
  FacebookPostItem,
  FacebookPostsSearchData,
  FacebookPostSentimentOverview,
} from "../types/posts.types";
import type { FacebookComment } from "../types/trending.types";

interface RawSearchComment {
  content: string;
  author: string;
  published_at?: string | null;
  sentiment: string;
}

interface RawSearchItem {
  post_id: string;
  external_id?: string;
  author?: string;
  message: string;
  url: string;
  likes: number;
  comments_count: number;
  published_at: string;
  sentiment: {
    post: { label: string; score: number } | null;
    comments_summary: { positif: number; negatif: number; netral: number };
  };
  comments: RawSearchComment[];
}

interface RawFacebookPostsSearchData {
  query: string | null;
  total: number;
  limit: number;
  offset: number;
  items: RawSearchItem[];
}

function sentimentEntry(count: number, total: number) {
  return { count, percentage: total > 0 ? Number(((count / total) * 100).toFixed(1)) : 0 };
}

function normalizeSearchItem(raw: RawSearchItem): FacebookPostItem {
  const { positif, negatif, netral } = raw.sentiment?.comments_summary ?? { positif: 0, negatif: 0, netral: 0 };
  const totalAnalyzed = positif + negatif + netral;

  const comments: FacebookComment[] = (raw.comments ?? []).map((comment) => ({
    content: comment.content,
    author: comment.author,
    sentiment: comment.sentiment,
    score: 0,
  }));

  return {
    post_id: raw.post_id,
    url: raw.url,
    caption: raw.message,
    author: raw.author,
    likes: raw.likes,
    comment_count: raw.comments_count,
    thumbnail: "",
    published_at: raw.published_at,
    sentiment_summary: {
      positif: sentimentEntry(positif, totalAnalyzed),
      negatif: sentimentEntry(negatif, totalAnalyzed),
      netral: sentimentEntry(netral, totalAnalyzed),
    },
    comments,
  };
}

function aggregateSentiment(items: FacebookPostItem[]): FacebookPostSentimentOverview {
  const totals = { positif: 0, negatif: 0, netral: 0 };
  for (const item of items) {
    totals.positif += item.sentiment_summary.positif.count;
    totals.negatif += item.sentiment_summary.negatif.count;
    totals.netral += item.sentiment_summary.netral.count;
  }
  const totalAnalyzed = totals.positif + totals.negatif + totals.netral;
  const dominant = (["positif", "netral", "negatif"] as const).reduce((best, key) =>
    totals[key] > totals[best] ? key : best
  , "netral" as "positif" | "netral" | "negatif");

  return {
    positif: sentimentEntry(totals.positif, totalAnalyzed),
    negatif: sentimentEntry(totals.negatif, totalAnalyzed),
    netral: sentimentEntry(totals.netral, totalAnalyzed),
    dominant,
    total_analyzed: totalAnalyzed,
  };
}

export async function searchFacebookPosts(params: {
  q?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}): Promise<FacebookPostsSearchData> {
  const { data } = await api.get<{ data: RawFacebookPostsSearchData }>("/api/v1/facebook/posts/search", {
    params: {
      q: params.q,
      date_from: params.dateFrom,
      date_to: params.dateTo,
      limit: params.limit ?? 20,
      offset: params.offset ?? 0,
    },
  });

  const raw = data.data;
  const items = raw.items.map(normalizeSearchItem);

  return {
    platform: "facebook",
    query: raw.query,
    total: raw.total,
    limit: raw.limit,
    offset: raw.offset,
    sentiment: aggregateSentiment(items),
    items,
  };
}
