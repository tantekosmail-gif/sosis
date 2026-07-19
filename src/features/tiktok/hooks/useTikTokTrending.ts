"use client";

import { useCallback, useEffect, useState } from "react";

import { getTikTokTrending } from "../services/trending.service";
import type { TikTokTrendingData, TikTokTrendingPost } from "../types/trending.types";

export type TikTokTrendingPeriod = "today" | "week";

function getLastWeekRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { dateFrom: fmt(from), dateTo: fmt(to) };
}

// dateFrom/dateTo tidak boleh tanggal yang sama -- backend membandingkan
// rentang tanggal secara eksklusif di batas atas, jadi from=to=hari-ini
// selalu balik kosong. dateTo digeser +1 hari supaya rentangnya benar-benar
// mencakup hari ini.
function getTodayRange() {
  const from = new Date();
  const to = new Date();
  to.setDate(to.getDate() + 1);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { dateFrom: fmt(from), dateTo: fmt(to) };
}

export function useTikTokTrending() {
  const [data, setData] = useState<TikTokTrendingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [period, setPeriod] = useState<TikTokTrendingPeriod>("week");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedPostId(null);

      const range = period === "week" ? getLastWeekRange() : getTodayRange();
      const result = await getTikTokTrending(range);
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data trending TikTok");
    } finally {
      setLoading(false);
    }
  }, [period]);

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
    period,
    setPeriod,
  };
}
