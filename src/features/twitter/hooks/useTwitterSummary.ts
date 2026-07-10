"use client";

import { useCallback, useEffect, useState } from "react";

import { getTwitterAnalysisSummary } from "../services/summary.service";
import type { TwitterAnalysisSummary } from "../types/summary.types";

export function useTwitterSummary() {
  const [data, setData] = useState<TwitterAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getTwitterAnalysisSummary();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis Twitter/X");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
