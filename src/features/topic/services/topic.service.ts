import { api } from "@/lib/api";

export interface TopicItemPayload {
  name: string;
  keywords: string[];
  description?: string | null;
}

export interface TopicSearchPayload {
  topics: TopicItemPayload[];
  platforms?: string[];
  limit_per_keyword?: number;
  include_sentiment?: boolean;
  include_comments?: boolean;
  auto_crawl?: boolean;
  confirm_third_party?: boolean;
  save_topic?: boolean;
  enable_recurring?: boolean;
  schedule_duration_days?: number;
}

// POST /api/v1/search/topics — cari data berdasarkan topik + keyword, dikelompokkan per topik.
export async function searchByTopics(payload: TopicSearchPayload) {
  const { data } = await api.post("/api/v1/search/topics", payload);
  return data;
}

export interface ListSavedTopicsParams {
  is_active?: boolean;
  limit?: number;
  offset?: number;
}

// GET /api/v1/search/topics/list — daftar topik tersimpan.
export async function listSavedTopics(params?: ListSavedTopicsParams) {
  const { data } = await api.get("/api/v1/search/topics/list", { params });
  return data;
}

export interface TopicDetailParams {
  limit_per_keyword?: number;
  include_sentiment?: boolean;
}

// GET /api/v1/search/topics/{topic_id} — detail satu topik (keyword + posts + sentimen).
export async function getTopicDetail(topicId: string, params?: TopicDetailParams) {
  const { data } = await api.get(`/api/v1/search/topics/${topicId}`, { params });
  return data;
}

// DELETE /api/v1/search/topics/{topic_id} — soft delete (nonaktifkan) topik.
export async function deleteTopic(topicId: string) {
  const { data } = await api.delete(`/api/v1/search/topics/${topicId}`);
  return data;
}

export interface SavedTopicSearchPayload {
  limit_per_keyword?: number;
  include_sentiment?: boolean;
  confirm_third_party?: boolean;
}

// POST /api/v1/search/topics/{topic_id}/search — cari ulang topik tersimpan pakai keyword/platform yang sudah di-set.
export async function searchSavedTopic(topicId: string, payload?: SavedTopicSearchPayload) {
  const { data } = await api.post(`/api/v1/search/topics/${topicId}/search`, payload ?? {});
  return data;
}

export interface TopicSchedulePayload {
  enabled: boolean;
  duration_days?: number | null;
}

// POST /api/v1/search/topics/{topic_id}/schedule — aktif/nonaktifkan pencarian berkala.
export async function setTopicSchedule(topicId: string, payload: TopicSchedulePayload) {
  const { data } = await api.post(`/api/v1/search/topics/${topicId}/schedule`, payload);
  return data;
}

const DEFAULT_SOV_PLATFORMS = ["youtube", "instagram", "facebook", "twitter", "tiktok"];
// Endpoint ini default ke 30 hari terakhir kalau date_from/date_to tidak dikirim —
// pakai tanggal jauh ke belakang supaya cakupannya all-time, bukan cuma sebulan
// terakhir (topik lama yang datanya sudah tidak berubah akan selalu tampil 0 kalau ikut default itu).
const SOV_ALL_TIME_FROM = "2000-01-01T00:00:00Z";

// GET /api/v1/metrics/sov — Share of Voice antar keyword (porsi mention). Query array
// params dikirim manual (bukan lewat axios `params`) supaya bentuknya pasti
// `keyword_ids=a&keyword_ids=b`, sesuai konvensi FastAPI untuk List[str] di query.
// dateFrom/dateTo opsional — default all-time kalau pemanggil tidak butuh filter periode.
export async function getShareOfVoice(
  keywordIds: string[],
  platforms: string[] = DEFAULT_SOV_PLATFORMS,
  dateFrom: string = SOV_ALL_TIME_FROM,
  dateTo: string = new Date().toISOString()
) {
  const search = new URLSearchParams();
  keywordIds.forEach((id) => search.append("keyword_ids", id));
  platforms.forEach((p) => search.append("platforms", p));
  search.set("date_from", dateFrom);
  search.set("date_to", dateTo);
  const { data } = await api.get(`/api/v1/metrics/sov?${search.toString()}`);
  return data;
}

// GET /api/v1/entities/top/{keyword_id} — top entitas (orang/organisasi/lokasi/event) untuk satu keyword.
export async function getTopEntities(keywordId: string, topN = 15) {
  const { data } = await api.get(`/api/v1/entities/top/${keywordId}`, { params: { top_n: topN } });
  return data;
}

// GET /api/v1/metrics/topic/{topic_id} — metrik agregat 1 topik, termasuk mention growth
// vs periode sebelumnya kalau include_growth=true. dateFrom/dateTo opsional, default all-time.
export async function getTopicMetrics(
  topicId: string,
  platforms: string[] = DEFAULT_SOV_PLATFORMS,
  dateFrom: string = SOV_ALL_TIME_FROM,
  dateTo: string = new Date().toISOString()
) {
  const search = new URLSearchParams();
  platforms.forEach((p) => search.append("platforms", p));
  search.set("include_growth", "true");
  search.set("date_from", dateFrom);
  search.set("date_to", dateTo);
  const { data } = await api.get(`/api/v1/metrics/topic/${topicId}?${search.toString()}`);
  return data;
}

// GET /api/v1/search/topics/{topic_id}/trend-graph — grafik tren N hari terakhir
// (1-30, default 7) utk 1 topik: volume post per hari per platform + sentimen
// komentar per hari + sub-topik baru yang ditemukan AI-context discovery per hari.
export async function getTopicTrendGraph(topicId: string, days = 7) {
  const { data } = await api.get(`/api/v1/search/topics/${topicId}/trend-graph`, { params: { days } });
  return data;
}

export interface GenerateReportPayload {
  topic_id?: string;
  format: "json" | "pdf" | "docx";
  [key: string]: unknown;
}

// POST /api/v1/reports/generate — trigger pembuatan laporan async (job).
// CATATAN: skema request/response endpoint ini ("GenerateReportRequest" /
// "ReportJobResponse") tidak terdokumentasi lengkap di spec yang tersedia —
// field selain "format" belum terverifikasi terhadap backend nyata.
export async function generateReport(payload: GenerateReportPayload) {
  const { data } = await api.post("/api/v1/reports/generate", payload);
  return data;
}

export interface SuggestKeywordsPayload {
  name: string;
  existingKeywords?: string[];
}

// POST /api/topics/suggest-keywords — saran keyword dari AI berdasarkan nama topik (route lokal Next.js).
export async function suggestTopicKeywords(payload: SuggestKeywordsPayload): Promise<string[]> {
  const res = await fetch("/api/topics/suggest-keywords", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Gagal mendapatkan saran keyword");
  return Array.isArray(data.keywords) ? data.keywords : [];
}
