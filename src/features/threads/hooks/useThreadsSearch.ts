"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getThreadsPostDetail, getThreadsSearch, triggerThreadsSearch } from "../services/search.service";
import type { ThreadsSearchData } from "../types/search.types";

const POLL_INTERVAL_MS = 8000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

export function useThreadsSearch() {
  const [data, setData] = useState<ThreadsSearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
    setPolling(false);
  }, []);

  const pollForResult = useCallback(
    (query: string) => {
      const startedAt = Date.now();
      setPolling(true);

      const tick = async () => {
        try {
          const result = await getThreadsSearch(query);
          if (result.status === "ready" && result.posts.length > 0) {
            setData(result);
            stopPolling();
            return;
          }
        } catch (err) {
          console.error("getThreadsSearch poll failed:", err);
        }

        if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
          stopPolling();
          setError("Pencarian Threads belum selesai — coba muat ulang beberapa saat lagi.");
          return;
        }

        pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
      };

      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    },
    [stopPolling]
  );

  const search = useCallback(
    async (query: string): Promise<ThreadsSearchData | null> => {
      const trimmed = query.trim();
      if (!trimmed) return null;

      stopPolling();
      try {
        setLoading(true);
        setError("");
        setHasSearched(true);
        setData(null);

        const result = await getThreadsSearch(trimmed);

        if (result.status === "empty") {
          await triggerThreadsSearch(trimmed);
          setData(result);
          pollForResult(trimmed);
        } else {
          setData(result);
        }

        return result;
      } catch (err: any) {
        setError(err?.response?.data?.detail || err?.message || "Gagal memuat hasil pencarian Threads");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [pollForResult, stopPolling]
  );

  const refreshPostComments = useCallback(async (postId: string) => {
    const detail = await getThreadsPostDetail(postId);
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        posts: prev.posts.map((post) =>
          post.id === postId ? { ...post, comments: detail.comments, comment_count: detail.total_comments_in_db } : post
        ),
      };
    });
    return detail;
  }, []);

  return { data, loading, polling, error, hasSearched, search, refreshPostComments };
}
