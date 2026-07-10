"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendDiscovery } from "../services/discovery.service";
import type { TrendDiscoveryData } from "../types/discovery.types";

export function useTrendDiscovery() {
  const [data, setData] = useState<TrendDiscoveryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getTrendDiscovery();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat trend discovery");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
