"use client";

import { useCallback, useState } from "react";

import { dateSearch } from "@/features/search/services/dateSearch.service";

export interface SearchedVideoItem {
  video_id: string;
  title: string;
  channel: string;
  url: string;
  thumbnail_url: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
}

// General keyword search (not trending) has no date-range picker in the UI —
// widen the window so a plain keyword search behaves like YouTube's own
// search results rather than requiring the user to pick dates first.
const DAYS_BACK = 365;

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - DAYS_BACK);
  return { dateFrom: from.toISOString().slice(0, 10), dateTo: to.toISOString().slice(0, 10) };
}

export function useVideoSearch() {
  const [keyword, setKeyword] = useState("");
  const [items, setItems] = useState<SearchedVideoItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (q: string) => {
    const trimmed = q.trim();
    setKeyword(trimmed);

    if (!trimmed) {
      setItems(null);
      setTotal(0);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const { dateFrom, dateTo } = defaultRange();
      const raw = await dateSearch({
        platform: "youtube",
        keyword: trimmed,
        dateFrom,
        dateTo,
        sortBy: "newest",
        includeSentiment: false,
        limit: 24,
      });
      const data = raw?.data ?? raw ?? {};
      setItems(data.items ?? []);
      setTotal(data.total ?? data.items?.length ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari video");
      setItems(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  return { keyword, items, total, loading, error, search };
}
