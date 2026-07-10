"use client";

import { useCallback, useEffect, useState } from "react";

import { getYoutubeTrending } from "../services/trending.service";
import type { YoutubeTrendingData } from "../types/trending.types";

export function useYoutubeTrending() {
  const [data, setData] = useState<YoutubeTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getYoutubeTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat trending searches YouTube");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
