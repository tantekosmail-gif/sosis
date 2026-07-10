import { api } from "@/lib/api";
import type { InstagramPostsData } from "../types/posts.types";

export async function getInstagramPosts(params: {
  username: string;
  maxPosts?: number;
  maxComments?: number;
  forceRefresh?: boolean;
}): Promise<InstagramPostsData> {
  const { data } = await api.get("/api/v1/instagram/posts", {
    params: {
      username: params.username,
      max_posts: params.maxPosts,
      max_comments: params.maxComments,
      force_refresh: params.forceRefresh,
    },
  });

  return data.data;
}
