"use client";

import { useCallback, useEffect, useState } from "react";

import { getInstagramAnalysisSummary } from "../services/summary.service";
import type { InstagramAnalysisSummary } from "../types/summary.types";

export function useInstagramSummary() {
  const [data, setData] = useState<InstagramAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getInstagramAnalysisSummary();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis Instagram");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
