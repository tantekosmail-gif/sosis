"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendTimeline } from "../services/timeline.service";
import type { TrendTimelineData } from "../types/timeline.types";

export function useTrendTimeline() {
  const [data, setData] = useState<TrendTimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getTrendTimeline();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat trend timeline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
