"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import VisualsPreviewWidget from "@/components/youtube/VisualsPreviewWidget";
import { getViralVideos } from "../services/viral.service";
import type { ViralVideoItem } from "../types/viral.types";

export default function VisualsSection() {
  const [items, setItems] = useState<ViralVideoItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (isRefresh: boolean) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError("");
      const result = await getViralVideos({ limit: 8, limitComments: 0 });
      setItems(result.items ?? []);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat visuals video YouTube");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchData(false);
    })();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-16 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!items || items.length === 0) return null;

  return <VisualsPreviewWidget items={items} refreshing={refreshing} onRefresh={() => fetchData(true)} />;
}
