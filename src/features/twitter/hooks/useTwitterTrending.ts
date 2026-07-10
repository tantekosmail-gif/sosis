"use client";

import { useCallback, useEffect, useState } from "react";

import { getTwitterTrending } from "../services/trending.service";
import type { TwitterTrendingData, TwitterTrendingPost } from "../types/trending.types";

export function useTwitterTrending() {
  const [data, setData] = useState<TwitterTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const result = await getTwitterTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending Twitter/X");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedPost: TwitterTrendingPost | null =
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
