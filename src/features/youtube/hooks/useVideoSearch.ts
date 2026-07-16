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

// Local calendar date, not UTC — toISOString() would convert to UTC and, for
// any visitor east of it (e.g. WIB/UTC+7), roll dateTo back to "yesterday"
// during the first hours of the local day, silently excluding today's videos.
function toLocalDateString(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - DAYS_BACK);
  return { dateFrom: toLocalDateString(from), dateTo: toLocalDateString(to) };
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
