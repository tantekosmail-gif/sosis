"use client";

import { useState, useEffect, useCallback } from "react";

export interface HistoryItem {
  id: string;
  keyword: string;
  platform: string;
  analyzedAt: string;
  stats: {
    totalPosts: number;
    totalComments: number;
    sentiment: { positive: number; neutral: number; negative: number };
  };
}

const KEY = "search_history";
const MAX = 20;

export function useSearchHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  const push = useCallback((item: Omit<HistoryItem, "id" | "analyzedAt">) => {
    setHistory((prev) => {
      const deduped = prev.filter(
        (h) => !(h.keyword === item.keyword && h.platform === item.platform)
      );
      const next: HistoryItem[] = [
        { ...item, id: crypto.randomUUID(), analyzedAt: new Date().toISOString() },
        ...deduped,
      ].slice(0, MAX);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    try { localStorage.removeItem(KEY); } catch {}
  }, []);

  return { history, push, remove, clear };
}
