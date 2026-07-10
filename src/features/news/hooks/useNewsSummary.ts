"use client";

import { useCallback, useEffect, useState } from "react";

import { getNewsAnalysisSummary } from "../services/summary.service";
import type { NewsAnalysisSummary } from "../types/summary.types";

export function useNewsSummary(topN = 15) {
  const [data, setData] = useState<NewsAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getNewsAnalysisSummary(topN);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis berita");
    } finally {
      setLoading(false);
    }
  }, [topN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
