import { api } from "@/lib/api";

interface CollectPayload {
  keyword: string;
  platform: string;
  maxPages?: number;
  maxCommentsPerVideo?: number;
  maxCommentPages?: number;
}

export async function collect(payload: CollectPayload) {
  const { data } = await api.post(`/api/v1/${payload.platform}/smart-search`, {
    q: payload.keyword,
    max_pages: payload.maxPages,
    max_comments_per_video: payload.maxCommentsPerVideo,
    max_comment_pages: payload.maxCommentPages,
    force_refresh: false,
  });
  return data;
}
