import { api } from "@/lib/api";
import type { ThreadsPostDetail, ThreadsSearchData, ThreadsSearchJob } from "../types/search.types";

export async function getThreadsSearch(
  query: string,
  limitPosts = 20,
  limitComments = 999999
): Promise<ThreadsSearchData> {
  const { data } = await api.get<{ data: ThreadsSearchData }>("/api/v1/threads/search", {
    params: { q: query, limit_posts: limitPosts, limit_comments: limitComments },
  });
  return data.data;
}

export async function triggerThreadsSearch(
  query: string,
  maxPosts = 10,
  commentsTopN = 3
): Promise<ThreadsSearchJob> {
  const { data } = await api.post<{ data: ThreadsSearchJob }>(
    "/api/v1/threads/search",
    null,
    { params: { q: query, max_posts: maxPosts, comments_top_n: commentsTopN } }
  );
  return data.data;
}

export async function getThreadsPostDetail(postId: string, limitComments = 999999): Promise<ThreadsPostDetail> {
  const { data } = await api.get<{ data: ThreadsPostDetail }>(`/api/v1/threads/posts/${postId}`, {
    params: { limit_comments: limitComments },
  });
  return data.data;
}
