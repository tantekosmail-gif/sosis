"use client";

import { useCallback, useEffect, useState } from "react";

// Kunci storage beda dari useRecentTikTokSearches (tiktok_recent_searches,
// berbasis username utk tab Sentiment) -- ini utk keyword pencarian video
// (tab Analisis Video), bukan username, jadi tidak boleh saling menimpa.
const STORAGE_KEY = "tiktok_video_recent_searches";
// Beda dari pola useRecentSearches platform lain (dibatasi 8 buat chip list) --
// di sini dipakai sebagai korpus keyword suggestion, jadi disimpan jauh lebih
// banyak (bukan cuma yang paling baru) supaya saran makin kaya seiring waktu.
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

export function useRecentTikTokVideoSearches() {
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
