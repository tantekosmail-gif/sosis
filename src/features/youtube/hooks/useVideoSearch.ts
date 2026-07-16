"use client";

import { useCallback, useState } from "react";

import { searchRecentVideos } from "../services/search.service";

export interface SearchedVideoItem {
  video_id: string;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  published_at: string;
}

// Keyword search surfaces only recently published videos (last N hours)
// rather than searching all-time, so results stay relevant to "what's
// happening now" for a given keyword.
const HOURS_BACK = 24;

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
      const raw = await searchRecentVideos({
        keyword: trimmed,
        hoursBack: HOURS_BACK,
        maxResults: 50,
      });
      const data = raw?.data ?? raw ?? {};
      const videos = data.videos ?? data.items ?? [];
      setItems(videos);
      setTotal(data.found ?? data.total ?? videos.length);
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
