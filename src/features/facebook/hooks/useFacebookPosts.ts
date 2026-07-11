"use client";

import { useCallback, useState } from "react";

import { getFacebookPosts } from "../services/posts.service";
import type { FacebookPostItem, FacebookPostsData } from "../types/posts.types";

export function useFacebookPosts() {
  const [data, setData] = useState<FacebookPostsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [maxPosts, setMaxPosts] = useState(5);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const search = useCallback(
    async (targetUsername: string, forceRefresh = false): Promise<FacebookPostsData | null> => {
      const trimmed = targetUsername.trim().replace(/^@/, "");
      if (!trimmed) return null;

      try {
        setLoading(true);
        setError("");
        setSelectedPostId(null);

        const result = await getFacebookPosts({
          username: trimmed,
          maxPosts,
          maxComments: 20,
          forceRefresh,
        });
        setData(result);
        return result;
      } catch (err: any) {
        setError(err?.message || "Gagal memuat data Facebook");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [maxPosts]
  );

  const selectedPost: FacebookPostItem | null =
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
