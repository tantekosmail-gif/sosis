import { api } from "@/lib/api";
import type { TwitterPostsData } from "../types/posts.types";
import { normalizeTweetItem, type RawTweetItem } from "./normalize";

interface RawTwitterPostsData extends Omit<TwitterPostsData, "items"> {
  items: RawTweetItem[];
}

export async function getTwitterPosts(params: {
  username: string;
  maxPosts?: number;
  maxComments?: number;
  forceRefresh?: boolean;
}): Promise<TwitterPostsData> {
  const { data } = await api.get<{ data: RawTwitterPostsData }>("/api/v1/twitter/posts", {
    params: {
      username: params.username,
      max_posts: params.maxPosts,
      max_comments: params.maxComments,
      force_refresh: params.forceRefresh,
    },
  });

  const raw = data.data;
  return { ...raw, items: raw.items.map(normalizeTweetItem) };
}
