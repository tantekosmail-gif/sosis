"use client";

import { useCallback, useEffect, useState } from "react";

import { getFacebookTrending } from "../services/trending.service";
import type { FacebookTrendingData, FacebookTrendingPost } from "../types/trending.types";

export type FacebookTrendingPeriod = "today" | "week";

function getLastWeekRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { dateFrom: fmt(from), dateTo: fmt(to) };
}

export function useFacebookTrending() {
  const [data, setData] = useState<FacebookTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [period, setPeriod] = useState<FacebookTrendingPeriod>("week");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const range = period === "week" ? getLastWeekRange() : {};
      const result = await getFacebookTrending(range);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending Facebook");
    } finally {
      setLoading(false);
    }
  }, [period]);

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
    period,
    setPeriod,
  };
}
