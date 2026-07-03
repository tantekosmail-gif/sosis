"use client";

import { useCallback, useEffect, useState } from "react";

import { getViralVideos } from "../services/viral.service";
import type { ViralVideoData } from "../types/viral.types";

export function useViralVideos() {
  const [data, setData] = useState<ViralVideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [limit, setLimit] = useState(20);
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setSelectedVideoId(null);

      const result = await getViralVideos({ limit, limitComments: 10, q });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat data video viral");
    } finally {
      setLoading(false);
    }
  }, [limit, q]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const selectedVideo = data?.items.find((item) => item.video_id === selectedVideoId) ?? null;

  return {
    data,
    loading,
    error,
    q,
    setQ,
    limit,
    setLimit,
    refetch: fetchData,
    selectedVideoId,
    setSelectedVideoId,
    selectedVideo,
  };
}
