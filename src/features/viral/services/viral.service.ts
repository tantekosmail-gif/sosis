import { api } from "@/lib/api";
import type { ViralVideoData } from "../types/viral.types";

export async function getViralVideos(params: {
  limit?: number;
  limitComments?: number;
  keywordId?: string;
  q?: string;
}): Promise<ViralVideoData> {
  const { data } = await api.get("/api/v1/youtube/videos/viral", {
    params: {
      limit: params.limit,
      limit_comments: params.limitComments,
      keyword_id: params.keywordId,
      q: params.q || undefined,
    },
  });

  return data.data;
}
