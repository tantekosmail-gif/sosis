"use client";

import { useCallback, useEffect, useState } from "react";

import { getFacebookTrending } from "../services/trending.service";
import type { FacebookTrendingData, FacebookTrendingPost } from "../types/trending.types";

export function useFacebookTrending() {
  const [data, setData] = useState<FacebookTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const result = await getFacebookTrending();
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending Facebook");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedPost: FacebookTrendingPost | null =
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
