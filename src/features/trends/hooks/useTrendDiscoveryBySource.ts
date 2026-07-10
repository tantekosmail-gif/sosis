"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendDiscoveryBySource } from "../services/discovery.service";
import type { TrendDiscoveryData, TrendDiscoverySource } from "../types/discovery.types";

export function useTrendDiscoveryBySource(source: TrendDiscoverySource) {
  const [data, setData] = useState<TrendDiscoveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getTrendDiscoveryBySource(source);
      setData(result);
    } catch (err: any) {
      setError(err?.message || `Gagal memuat trend discovery ${source}`);
    } finally {
      setLoading(false);
    }
  }, [source]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
