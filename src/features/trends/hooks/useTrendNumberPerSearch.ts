"use client";

import { useCallback, useEffect, useState } from "react";
import { format, subDays } from "date-fns";

import { getTrendTimeline } from "../services/timeline.service";
import type { TrendTimelineData } from "../types/timeline.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useTrendNumberPerSearch() {
  const [data, setData] = useState<TrendTimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { trendRankingTopN, trendRankingDays } = getSettings();
      const today = new Date();
      const result = await getTrendTimeline({
        topN: trendRankingTopN,
        includeTopicClusters: true,
        dateFrom: format(subDays(today, trendRankingDays), "yyyy-MM-dd"),
        dateTo: format(today, "yyyy-MM-dd"),
      });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data number per search");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
