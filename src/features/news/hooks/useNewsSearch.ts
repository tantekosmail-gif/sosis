"use client";

import { useCallback, useState } from "react";

import { searchNews } from "../services/search.service";
import type { NewsSearchData } from "../types/search.types";

export function useNewsSearch() {
  const [data, setData] = useState<NewsSearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (query: string, limit = 10): Promise<NewsSearchData | null> => {
    const trimmed = query.trim();
    if (!trimmed) return null;

    try {
      setLoading(true);
      setError("");
      setHasSearched(true);

      const result = await searchNews(trimmed, limit);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err?.message || "Gagal memuat hasil pencarian berita");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    hasSearched,
    search,
  };
}
