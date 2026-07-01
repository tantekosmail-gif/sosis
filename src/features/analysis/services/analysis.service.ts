import { smartSearch } from "@/features/search/services/search.service";
import { dateSearch } from "@/features/search/services/dateSearch.service";

export interface AnalyzePayload {
  platform: string;
  keyword: string;
  dateFrom?: string;
  dateTo?: string;
}

const SUPPORTED = ["youtube", "tiktok", "instagram", "facebook"];

export async function analyze(payload: AnalyzePayload) {
  const { platform, keyword, dateFrom, dateTo } = payload;

  if (!SUPPORTED.includes(platform)) {
    throw new Error("Platform belum didukung");
  }

  // Gunakan date-search jika filter tanggal aktif
  if (dateFrom && dateTo) {
    return dateSearch({
      platform,
      keyword,
      dateFrom,
      dateTo,
      includeSentiment: true,
      limit: 20,
    });
  }

  // Fallback ke smart-search
  return smartSearch({
    platform,
    keyword,
    limitVideos: 20,
    limitComments: 20,
  });
}
