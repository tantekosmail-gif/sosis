import { api } from "@/lib/api";

interface SmartSearchPayload {
  keyword: string;
  platform: string;
  limitVideos: number;
  limitComments: number;
}

export async function smartSearch(payload: SmartSearchPayload) {
  const endpoint = `/api/v1/${payload.platform}/smart-search`;

  const { data } = await api.get(endpoint, {
    params: {
      q: payload.keyword,
      limit_videos: payload.limitVideos,
      limit_comments: payload.limitComments,
    },
  });
  return data;
}
