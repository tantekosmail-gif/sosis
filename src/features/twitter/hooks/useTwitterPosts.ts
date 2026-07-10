"use client";

import { useCallback, useState } from "react";

import { getTwitterPosts } from "../services/posts.service";
import type { TwitterPostItem, TwitterPostsData } from "../types/posts.types";

export function useTwitterPosts() {
  const [data, setData] = useState<TwitterPostsData | null>(null);
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

        const result = await getTwitterPosts({
          username: trimmed,
          maxPosts,
          maxComments: 10,
          forceRefresh,
        });
        setData(result);
      } catch (err: any) {
        setError(err?.message || "Gagal memuat data Twitter/X");
      } finally {
        setLoading(false);
      }
    },
    [maxPosts]
  );

  const selectedPost: TwitterPostItem | null =
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
