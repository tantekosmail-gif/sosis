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

  // YouTube selalu lewat smart-search (q, limit_videos=100, limit_comments=200).
  // Endpoint date-search tidak dipakai untuk YouTube karena response-nya tidak
  // membawa rincian per channel/komentar — channel distribution & sentimen jadi
  // tidak bisa dihitung. Filter tanggal untuk YouTube diterapkan di sisi client
  // (lihat filterYoutubeResponseByDate di useAnalyze).
  if (platform === "youtube") {
    return smartSearch({
      platform,
      keyword,
      limitVideos: 100,
      limitComments: 200,
    });
  }

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
