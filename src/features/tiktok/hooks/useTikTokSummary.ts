"use client";

import { useCallback, useEffect, useState } from "react";

import { getTikTokAnalysisSummary } from "../services/summary.service";
import type { TikTokAnalysisSummary } from "../types/summary.types";

export function useTikTokSummary() {
  const [data, setData] = useState<TikTokAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getTikTokAnalysisSummary();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis TikTok");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
