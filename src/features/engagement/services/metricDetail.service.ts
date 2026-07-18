import { api } from "@/lib/api";
import type { EngagementPlatform } from "../types/engagement.types";
import type { BreakdownKey } from "../lib/colors";

export type MetricDetailMetric = "mentions" | "exposure" | "engagement" | "reach" | "sentiment";
export type SentimentLabel = "positif" | "negatif" | "netral";

export interface MetricDetailParams {
  metric: MetricDetailMetric;
  platform?: EngagementPlatform;
  sentimentLabel?: SentimentLabel;
  sortBy?: BreakdownKey;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface MetricDetailPostItem {
  id: string;
  external_id: string;
  platform: string;
  url: string;
  title: string;
  author: string | null;
  published_at: string | null;
  views: number;
  engagement: number;
  engagement_breakdown: Record<BreakdownKey, number> & { unavailable_fields?: string[] };
}

export interface MetricDetailAccountItem {
  author: string;
  platform: string;
  post_count: number;
}

export interface MetricDetailCommentItem {
  comment_id: string;
  content: string;
  author: string;
  label: SentimentLabel;
  sentiment_source: "llm_reviewed" | "lexicon_only";
  post_id: string;
  post_url: string;
  post_title: string;
  platform: string;
  published_at: string;
}

export interface MetricDetailPagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface MetricDetailResponse<T> {
  scope: string;
  keyword: { id: string; text: string };
  metric: MetricDetailMetric;
  platforms: string[];
  period: { from: string; to: string };
  pagination: MetricDetailPagination;
  items: T[];
}

// GET /api/v1/metrics/keyword/{keyword_id}/detail — daftar data mentah di balik satu
// angka metrik (post untuk mentions/exposure/engagement, akun untuk reach, komentar
// untuk sentiment). Scoped ke SATU keyword_id — kalau butuh gabungan lintas keyword,
// panggil per keyword_id lalu gabungkan di frontend (lihat MetricSource.tsx).
export async function getKeywordMetricDetail<T>(
  keywordId: string,
  params: MetricDetailParams
): Promise<MetricDetailResponse<T>> {
  const { data } = await api.get(`/api/v1/metrics/keyword/${keywordId}/detail`, {
    params: {
      metric: params.metric,
      platform: params.platform,
      sentiment_label: params.sentimentLabel,
      sort_by: params.sortBy,
      date_from: params.dateFrom,
      date_to: params.dateTo,
      page: params.page ?? 1,
      limit: params.limit ?? 20,
    },
  });
  return data.data;
}
