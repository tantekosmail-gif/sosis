"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendTimeline } from "../services/timeline.service";
import { getTrendVisuals } from "../services/visuals.service";
import type { TrendVisualsData } from "../types/visuals.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useTrendVisuals() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [data, setData] = useState<TrendVisualsData | null>(null);
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [loadingVisuals, setLoadingVisuals] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoadingKeywords(true);
        setError("");
        const { trendTopN, trendWindowHours } = getSettings();
        const timeline = await getTrendTimeline({
          topN: trendTopN,
          hours: trendWindowHours,
          interval: "hour",
          includePlatformBreakdown: false,
          includeTopicClusters: false,
        });
        setKeywords(timeline.keywords);
        setSelectedKeyword(timeline.keywords[0] ?? "");
      } catch (err: any) {
        setError(err?.message || "Gagal memuat keyword trending");
      } finally {
        setLoadingKeywords(false);
      }
    })();
  }, []);

  const fetchVisuals = useCallback(async (keyword: string) => {
    if (!keyword) return;
    try {
      setLoadingVisuals(true);
      setError("");
      const { trendWindowHours, trendVisualsLimit } = getSettings();
      const result = await getTrendVisuals({ keyword, hours: trendWindowHours, limit: trendVisualsLimit });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat visuals");
    } finally {
      setLoadingVisuals(false);
    }
  }, []);

  useEffect(() => {
    fetchVisuals(selectedKeyword);
  }, [selectedKeyword, fetchVisuals]);

  return {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    data,
    loading: loadingKeywords || loadingVisuals,
    error,
  };
}
