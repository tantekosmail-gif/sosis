"use client";

import { useCallback, useEffect, useState } from "react";

import { getInstagramTrending } from "../services/trending.service";
import type { InstagramTrendingData, InstagramTrendingPost } from "../types/trending.types";

export function useInstagramTrending() {
  const [data, setData] = useState<InstagramTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const result = await getInstagramTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending Instagram");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedPost: InstagramTrendingPost | null =
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
