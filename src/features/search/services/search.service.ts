import { api } from "@/lib/api";

interface SmartSearchPayload {
  keyword: string;
  platform: string;
  limitVideos: number;
  limitComments: number;
}

export async function smartSearch(
  payload: SmartSearchPayload
) {
  const endpoint = `/api/v1/${payload.platform}/smart-search`;

  console.log("========== SMART SEARCH ==========");
  console.log(endpoint);

  const { data } = await api.get(endpoint, {
    params: {
      q: payload.keyword,
      limit_videos: payload.limitVideos,
      limit_comments: payload.limitComments,
    },
  });

  console.log("SMART SEARCH RESPONSE");
  console.log(data);

  return data;
}