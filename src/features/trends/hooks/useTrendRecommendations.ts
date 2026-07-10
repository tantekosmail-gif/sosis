"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendRecommendations } from "../services/recommendations.service";
import type { TrendRecommendationItem } from "../types/recommendations.types";

export function useTrendRecommendations() {
  const [data, setData] = useState<TrendRecommendationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [limit, setLimit] = useState(20);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getTrendRecommendations({ limit });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trend recommendations");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    limit,
    setLimit,
    refetch: fetchData,
  };
}
