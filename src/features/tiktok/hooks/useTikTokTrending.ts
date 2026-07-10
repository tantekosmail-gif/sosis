"use client";

import { useCallback, useEffect, useState } from "react";

import { getTikTokTrending } from "../services/trending.service";
import type { TikTokTrendingData, TikTokTrendingPost } from "../types/trending.types";

export function useTikTokTrending() {
  const [data, setData] = useState<TikTokTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const result = await getTikTokTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending TikTok");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedPost: TikTokTrendingPost | null =
    data?.topics?.flatMap((topic) => topic.posts).find((post) => post.post_id === selectedPostId) ?? null;

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  };
}
