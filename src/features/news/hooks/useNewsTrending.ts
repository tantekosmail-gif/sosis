"use client";

import { useCallback, useEffect, useState } from "react";

import { getNewsTrending } from "../services/trending.service";
import type { NewsTrendingData } from "../types/trending.types";

export function useNewsTrending() {
  const [data, setData] = useState<NewsTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getNewsTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat berita trending");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
