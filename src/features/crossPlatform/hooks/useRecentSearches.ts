"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "cross_platform_recent_searches";
// Sama seperti useRecentYoutubeSearches/useRecentTikTokVideoSearches -- dipakai
// sebagai korpus keyword suggestion, jadi disimpan jauh lebih banyak (bukan
// cuma yang paling baru) supaya saran makin kaya seiring waktu.
const MAX_ITEMS = 200;

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

export function useRecentCrossPlatformSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readStored());
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { recent, addRecentSearch };
}
