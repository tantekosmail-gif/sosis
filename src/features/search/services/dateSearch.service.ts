import { api } from "@/lib/api";

export interface DateSearchPayload {
  keyword: string;
  platform: string;
  dateFrom: string;
  dateTo: string;
  sortBy?: "newest" | "oldest" | "popular";
  limit?: number;
  offset?: number;
  includeSentiment?: boolean;
}

export async function dateSearch(payload: DateSearchPayload) {
  const params = {
    q: payload.keyword,
    date_from: payload.dateFrom,
    date_to: payload.dateTo,
    sort_by: payload.sortBy ?? "newest",
    limit: payload.limit ?? 20,
    offset: payload.offset ?? 0,
    include_sentiment: payload.includeSentiment ?? true,
  };

  // 1. Coba GET dulu (ambil dari cache)
  const { data: getResult } = await api.get(
    `/api/v1/${payload.platform}/videos/date-search`,
    { params }
  );

  const items = getResult?.data?.items ?? getResult?.items ?? [];

  if (items.length > 0) {
    return getResult;
  }

  // 2. Data kosong → POST dengan auto_crawl untuk trigger scraping
  const { data: postResult } = await api.post(
    `/api/v1/${payload.platform}/videos/date-search`,
    { ...params, auto_crawl: true }
  );

  return postResult;
}
