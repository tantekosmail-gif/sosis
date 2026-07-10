"use client";

import { useCallback, useEffect, useState } from "react";

import { getNewsAnalysisSummary } from "../services/summary.service";
import type { NewsAnalysisSummary } from "../types/summary.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useNewsSummary(topN?: number) {
  const resolvedTopN = topN ?? getSettings().newsSummaryTopN;
  const [data, setData] = useState<NewsAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getNewsAnalysisSummary(resolvedTopN);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis berita");
    } finally {
      setLoading(false);
    }
  }, [resolvedTopN]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
