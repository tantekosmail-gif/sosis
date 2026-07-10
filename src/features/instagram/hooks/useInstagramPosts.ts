"use client";

import { useCallback, useState } from "react";

import { getInstagramPosts } from "../services/posts.service";
import type { InstagramPostItem, InstagramPostsData } from "../types/posts.types";

export function useInstagramPosts() {
  const [data, setData] = useState<InstagramPostsData | null>(null);
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

        const result = await getInstagramPosts({
          username: trimmed,
          maxPosts,
          maxComments: 5,
          forceRefresh,
        });
        setData(result);
      } catch (err: any) {
        setError(err?.message || "Gagal memuat data Instagram");
      } finally {
        setLoading(false);
      }
    },
    [maxPosts]
  );

  const selectedPost: InstagramPostItem | null =
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
