"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "twitter_recent_searches";
const MAX_ITEMS = 8;

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

export function useRecentTwitterSearches() {
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    setRecent(readStored());
  }, []);

  const addRecentSearch = useCallback((username: string) => {
    const trimmed = username.trim().replace(/^@/, "");
    if (!trimmed) return;

    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((u) => u.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  return { recent, addRecentSearch };
}
