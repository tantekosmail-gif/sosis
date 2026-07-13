"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  listSavedTopics,
  searchByTopics,
  deleteTopic as deleteTopicApi,
  searchSavedTopic,
  setTopicSchedule,
  getTopicDetail,
} from "../services/topic.service";

export interface Topic {
  id: string;
  name: string;
  keywords: string[];
  isActive: boolean;
  recurring: boolean;
  scheduleDurationDays?: number | null;
  totalPosts?: number;
  totalComments?: number;
}

// Bentuk response backend belum di-strict-type di OpenAPI (additionalProperties: true),
// jadi dinormalisasi secara defensif dengan beberapa kemungkinan nama field.
// Dikonfirmasi dari response nyata:
// - GET /search/topics/list -> item pakai "name" + "schedule_recurring"
// - POST /search/topics     -> topic pakai "topic" + tanpa info schedule
function normalizeTopic(raw: any): Topic {
  return {
    id: raw.id ?? raw.topic_id,
    name: raw.name ?? raw.topic,
    keywords: raw.keywords ?? [],
    isActive: raw.is_active ?? true,
    recurring: raw.schedule_recurring ?? raw.enable_recurring ?? raw.recurring ?? false,
    scheduleDurationDays: raw.schedule_duration_days ?? null,
    totalPosts: raw.total_posts,
    totalComments: raw.total_comments,
  };
}

// GET /search/topics/list membungkus hasil di { success, data: { total, offset, items } }.
function extractTopicList(response: any): any[] {
  return response?.data?.items ?? response?.items ?? response?.topics ?? [];
}

// Beberapa keyword bisa "found" dan sebagian lagi "needs_confirmation" sekaligus
// (status jadi "partial_needs_confirmation"), jadi cek dari daftar keyword-nya,
// bukan cuma exact match ke satu string status.
export function needsConfirmation(result: any): boolean {
  return (
    result?.status === "needs_confirmation" ||
    result?.status === "partial_needs_confirmation" ||
    (Array.isArray(result?.needs_confirmation_keywords) && result.needs_confirmation_keywords.length > 0)
  );
}

// Sama logikanya dengan needsConfirmation: sebagian keyword bisa "queued"
// sementara sebagian lain sudah "found", jadi dicek dari daftar keyword-nya.
export function isQueued(result: any): boolean {
  return (
    result?.status === "queued" ||
    result?.status === "partial_queued" ||
    (Array.isArray(result?.queued_keywords) && result.queued_keywords.length > 0)
  );
}

const POLL_INTERVAL_MS = 8000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listSavedTopics({ is_active: true });
      const list = extractTopicList(data);
      setTopics(Array.isArray(list) ? list.map(normalizeTopic) : []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat daftar topik");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addTopic = useCallback(
    async (input: { name: string; keywords: string[] }) => {
      // auto_crawl=true diperlukan supaya backend menuntaskan alurnya sampai ke
      // langkah "simpan topik ke DB" -- confirm_third_party tetap false supaya
      // TIDAK ada crawl third-party berbayar yang benar-benar terpanggil,
      // endpoint cuma akan berhenti di status "needs_confirmation" kalau data
      // belum ada di DB, tapi topik & keyword-nya tetap tersimpan.
      const result = await searchByTopics({
        topics: [{ name: input.name, keywords: input.keywords }],
        save_topic: true,
        auto_crawl: true,
        confirm_third_party: false,
      });
      console.log("searchByTopics result:", result);
      await refresh();
    },
    [refresh]
  );

  const removeTopic = useCallback(async (id: string) => {
    await deleteTopicApi(id);
    setTopics((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // confirmThirdParty HARUS false di percobaan pertama. Kalau hasilnya
  // needs_confirmation, si pemanggil wajib menampilkan dialog persetujuan ke
  // user dulu (pencarian pihak ketiga berbayar/berkuota) sebelum memanggil ulang
  // dengan confirmThirdParty=true — lihat FLOW.md section 1 & 5.1.
  const searchTopic = useCallback(async (id: string, confirmThirdParty: boolean) => {
    return await searchSavedTopic(id, { confirm_third_party: confirmThirdParty });
  }, []);

  // Timer polling aktif per topic_id, supaya bisa dibatalkan (ganti pencarian
  // baru atau unmount) tanpa mengganggu polling topik lain yang sedang jalan.
  const pollTimers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const timers = pollTimers.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  // Poll GET /search/topics/{id} tiap 8 detik sampai total_posts bertambah dari
  // baseline (posisi sebelum pencarian dijalankan) atau timeout ~5 menit —
  // proses di server tetap lanjut walau polling di sini berhenti (FLOW.md 5.5).
  const pollTopicResult = useCallback(
    (id: string, baselineTotal: number, onDone: (found: boolean, latestTotal: number) => void) => {
      const startedAt = Date.now();

      const tick = async () => {
        try {
          const raw = await getTopicDetail(id);
          const body = raw?.data ?? raw;
          const latestTotal = body?.total_posts ?? 0;
          if (latestTotal > baselineTotal) {
            pollTimers.current.delete(id);
            onDone(true, latestTotal);
            return;
          }
        } catch (err) {
          console.error("pollTopicResult failed:", err);
        }

        if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
          pollTimers.current.delete(id);
          onDone(false, baselineTotal);
          return;
        }

        pollTimers.current.set(id, setTimeout(tick, POLL_INTERVAL_MS));
      };

      pollTimers.current.set(id, setTimeout(tick, POLL_INTERVAL_MS));

      return () => {
        const timer = pollTimers.current.get(id);
        if (timer) clearTimeout(timer);
        pollTimers.current.delete(id);
      };
    },
    []
  );

  const updateSchedule = useCallback(
    async (id: string, enabled: boolean, durationDays?: number | null) => {
      await setTopicSchedule(id, { enabled, duration_days: durationDays ?? null });
      await refresh();
    },
    [refresh]
  );

  return { topics, loading, error, refresh, addTopic, removeTopic, searchTopic, pollTopicResult, updateSchedule };
}
