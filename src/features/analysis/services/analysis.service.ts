import { smartSearch } from "@/features/search/services/search.service";

interface AnalyzePayload {
  platform: string;
  keyword: string;
}

export async function analyze(payload: AnalyzePayload) {
  switch (payload.platform) {
    case "youtube":
      return smartSearch({
        platform: "youtube",
        keyword: payload.keyword,
        limitVideos: 20,
        limitComments: 20,
      });

    case "tiktok":
      return smartSearch({
        platform: "tiktok",
        keyword: payload.keyword,
        limitVideos: 20,
        limitComments: 20,
      });

    case "instagram":
      return smartSearch({
        platform: "instagram",
        keyword: payload.keyword,
        limitVideos: 20,
        limitComments: 20,
      });

    case "facebook":
      return smartSearch({
        platform: "facebook",
        keyword: payload.keyword,
        limitVideos: 20,
        limitComments: 20,
      });

    default:
      throw new Error("Platform belum didukung");
  }
}