"use client";

import { useCallback, useEffect, useState } from "react";

import { getFacebookAnalysisSummary } from "../services/summary.service";
import type { FacebookAnalysisSummary } from "../types/summary.types";

export function useFacebookSummary() {
  const [data, setData] = useState<FacebookAnalysisSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getFacebookAnalysisSummary();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat ringkasan analisis Facebook");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
