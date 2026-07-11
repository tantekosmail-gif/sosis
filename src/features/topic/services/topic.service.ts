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
