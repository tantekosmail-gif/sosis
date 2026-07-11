"use client";

import { useState, useEffect, useCallback } from "react";
import {
  listSavedTopics,
  searchByTopics,
  deleteTopic as deleteTopicApi,
  searchSavedTopic,
  setTopicSchedule,
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
function needsConfirmation(result: any): boolean {
  return (
    result?.status === "needs_confirmation" ||
    result?.status === "partial_needs_confirmation" ||
    (Array.isArray(result?.needs_confirmation_keywords) && result.needs_confirmation_keywords.length > 0)
  );
}

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

  // Auto-confirm: kalau tier-1 belum ketemu data, langsung kirim ulang dengan
  // confirm_third_party=true supaya tier-3 (crawl) jalan tanpa perlu konfirmasi user.
  const runTopicSearch = useCallback(async (id: string) => {
    let result = await searchSavedTopic(id, { confirm_third_party: false });
    if (needsConfirmation(result)) {
      result = await searchSavedTopic(id, { confirm_third_party: true });
    }
    return result;
  }, []);

  const updateSchedule = useCallback(
    async (id: string, enabled: boolean, durationDays?: number | null) => {
      await setTopicSchedule(id, { enabled, duration_days: durationDays ?? null });
      await refresh();
    },
    [refresh]
  );

  return { topics, loading, error, refresh, addTopic, removeTopic, runTopicSearch, updateSchedule };
}
