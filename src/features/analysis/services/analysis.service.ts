import { smartSearch } from "@/features/search/services/search.service";
import { dateSearch } from "@/features/search/services/dateSearch.service";
import { getSettings } from "@/features/settings/hooks/useSettings";

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

  const { searchResultLimit } = getSettings();

  // Gunakan date-search jika filter tanggal aktif
  if (dateFrom && dateTo) {
    return dateSearch({
      platform,
      keyword,
      dateFrom,
      dateTo,
      includeSentiment: true,
      limit: searchResultLimit,
    });
  }

  // Fallback ke smart-search
  return smartSearch({
    platform,
    keyword,
    limitVideos: searchResultLimit,
    limitComments: searchResultLimit,
  });
}
