import { api } from "@/lib/api";
import type { FacebookPostsData } from "../types/posts.types";
import { normalizeFacebookPost, type RawFacebookPost } from "./normalize";

interface RawFacebookPostsData extends Omit<FacebookPostsData, "items"> {
  items: RawFacebookPost[];
}

export async function getFacebookPosts(params: {
  username: string;
  maxPosts?: number;
  maxComments?: number;
  forceRefresh?: boolean;
}): Promise<FacebookPostsData> {
  const { data } = await api.get<{ data: RawFacebookPostsData }>("/api/v1/facebook/posts", {
    params: {
      username: params.username,
      max_posts: params.maxPosts,
      max_comments: params.maxComments,
      force_refresh: params.forceRefresh,
    },
  });

  const raw = data.data;
  return { ...raw, items: raw.items.map(normalizeFacebookPost) };
}
