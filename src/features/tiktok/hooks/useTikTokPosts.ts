"use client";

import { useCallback, useState } from "react";

import { getTikTokPosts } from "../services/posts.service";
import type { TikTokPostItem, TikTokPostsData } from "../types/posts.types";

export function useTikTokPosts() {
  const [data, setData] = useState<TikTokPostsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxPosts, setMaxPosts] = useState(5);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const search = useCallback(
    async (targetUsername: string, forceRefresh = false) => {
      const trimmed = targetUsername.trim().replace(/^@/, "");
      if (!trimmed) return;

      try {
        setLoading(true);
        setError("");
        setSelectedPostId(null);

        const result = await getTikTokPosts({
          username: trimmed,
          maxPosts,
          maxComments: 10,
          forceRefresh,
        });
        setData(result);
      } catch (err: any) {
        setError(err?.message || "Gagal memuat data TikTok");
      } finally {
        setLoading(false);
      }
    },
    [maxPosts]
  );

  const selectedPost: TikTokPostItem | null =
    data?.items?.find((item) => item.post_id === selectedPostId) ?? null;

  return {
    data,
    loading,
    error,
    maxPosts,
    setMaxPosts,
    search,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  };
}
