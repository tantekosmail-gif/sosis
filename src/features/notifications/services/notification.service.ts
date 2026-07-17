import { api } from "@/lib/api";

export interface TopicNotification {
  id: string;
  topicId: string;
  platform: string;
  postId: string;
  keyword: string;
  metricType: string;
  metricValue: number;
  threshold: number;
  title: string;
  author: string;
  url: string;
  isRead: boolean;
  createdAt: string;
  /** Tanggal publish post/video aslinya (belum selalu dikirim backend) — null
   *  kalau belum tersedia, konsumen fallback ke createdAt. */
  publishedAt: string | null;
}

const NOTIFICATION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

// Notifikasi topik viral dianggap "masih relevan" kalau tanggal publish post
// aslinya (atau createdAt kalau backend belum kirim publishedAt) masih dalam
// 7 hari terakhir — post lama yang baru "ketahuan" viral hari ini tidak
// dihitung/ditampilkan sebagai notifikasi baru. Dipakai bareng oleh badge
// unread count dan daftar yang ditampilkan supaya angkanya selalu konsisten.
export function isNotificationRecent(n: Pick<TopicNotification, "createdAt" | "publishedAt">): boolean {
  const at = n.publishedAt ?? n.createdAt;
  return Date.now() - new Date(at).getTime() <= NOTIFICATION_WINDOW_MS;
}

function normalizeNotification(raw: any): TopicNotification {
  return {
    id: raw.id,
    topicId: raw.topic_id,
    platform: raw.platform,
    postId: raw.post_id,
    keyword: raw.keyword_text,
    metricType: raw.metric_type,
    metricValue: raw.metric_value,
    threshold: raw.threshold,
    title: raw.title,
    author: raw.author,
    url: raw.url,
    isRead: raw.is_read,
    createdAt: raw.created_at,
    publishedAt: raw.published_at ?? null,
  };
}

// GET /api/v1/search/notifications/unread-count — badge notifikasi topik viral.
// topicId opsional untuk badge per-topik.
export async function getUnreadNotificationCount(topicId?: string): Promise<number> {
  const { data } = await api.get("/api/v1/search/notifications/unread-count", {
    params: topicId ? { topic_id: topicId } : undefined,
  });
  return data?.data?.unread_count ?? 0;
}

export interface ListNotificationsParams {
  limit?: number;
  page?: number;
  topicId?: string;
  platform?: string;
  isRead?: boolean;
}

export interface NotificationListResult {
  items: TopicNotification[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// GET /api/v1/search/notifications — daftar notifikasi, dipanggil saat dropdown dibuka.
export async function listNotifications(params: ListNotificationsParams = {}): Promise<NotificationListResult> {
  const { data } = await api.get("/api/v1/search/notifications", {
    params: {
      limit: params.limit ?? 20,
      page: params.page ?? 1,
      topic_id: params.topicId,
      platform: params.platform,
      is_read: params.isRead,
    },
  });
  const body = data?.data ?? {};
  return {
    items: (body.items ?? []).map(normalizeNotification),
    page: body.pagination?.page ?? 1,
    limit: body.pagination?.limit ?? 20,
    total: body.pagination?.total ?? 0,
    totalPages: body.pagination?.total_pages ?? 1,
  };
}

// POST /api/v1/search/notifications/{id}/read — tandai satu notifikasi sudah dibaca.
export async function markNotificationRead(id: string): Promise<void> {
  await api.post(`/api/v1/search/notifications/${id}/read`);
}

export type NotificationThresholds = Record<string, { metric: "views" | "likes"; value: number }>;

// GET /api/v1/search/notifications/thresholds — ambang batas viral per platform saat ini.
export async function getNotificationThresholds(): Promise<NotificationThresholds> {
  const { data } = await api.get("/api/v1/search/notifications/thresholds");
  return data?.data?.thresholds ?? {};
}

export interface UpdateThresholdPayload {
  platform: string;
  metric: "views" | "likes";
  value: number;
}

// PATCH /api/v1/search/notifications/thresholds — ubah ambang batas satu platform.
export async function updateNotificationThreshold(payload: UpdateThresholdPayload): Promise<void> {
  await api.patch("/api/v1/search/notifications/thresholds", payload);
}
