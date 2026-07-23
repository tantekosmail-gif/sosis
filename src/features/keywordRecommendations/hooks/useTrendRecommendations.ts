"use client";

import { useCallback, useEffect, useState } from "react";

import {
  listTrendRecommendations,
  submitManualTopic,
  type TrendRecommendation,
} from "../services/trendRecommendations.service";

export function useTrendRecommendations() {
  const [items, setItems] = useState<TrendRecommendation[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listTrendRecommendations();
      // Backend sudah mengurutkan by score, tapi diurutkan ulang di sini
      // sebagai jaga-jaga supaya urutan tampilan selalu benar.
      setItems([...data.topics].sort((a, b) => b.score - a.score));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat rekomendasi keyword");
      setItems(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async (topic: string, score?: number) => {
      setSubmitting(true);
      try {
        await submitManualTopic({ topic, score });
        await refresh();
      } finally {
        setSubmitting(false);
      }
    },
    [refresh],
  );

  return { items, loading, error, refresh, submit, submitting };
}
