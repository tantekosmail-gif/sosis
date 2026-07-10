"use client";

import { useCallback, useEffect, useState } from "react";

import { getTrendTimeline } from "../services/timeline.service";
import { getTrendFeed } from "../services/feed.service";
import type { TrendFeedData } from "../types/feed.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useTrendFeed() {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeyword, setSelectedKeyword] = useState("");
  const [data, setData] = useState<TrendFeedData | null>(null);
  const [loadingKeywords, setLoadingKeywords] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(false);
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

        // Rank by total_mentions desc, same as the Word Count widget — the
        // raw `keywords` array order from the API isn't sorted by volume.
        const ranked = [...timeline.keywords].sort(
          (a, b) => (timeline.series[b]?.total_mentions ?? 0) - (timeline.series[a]?.total_mentions ?? 0)
        );

        setKeywords(ranked);
        setSelectedKeyword(ranked[0] ?? "");
      } catch (err: any) {
        setError(err?.message || "Gagal memuat keyword trending");
      } finally {
        setLoadingKeywords(false);
      }
    })();
  }, []);

  const fetchFeed = useCallback(async (keyword: string) => {
    if (!keyword) return;
    try {
      setLoadingFeed(true);
      setError("");
      const { trendWindowHours, searchResultLimit } = getSettings();
      const result = await getTrendFeed({ keyword, hours: trendWindowHours, limit: searchResultLimit });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal memuat feed");
    } finally {
      setLoadingFeed(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed(selectedKeyword);
  }, [selectedKeyword, fetchFeed]);

  return {
    keywords,
    selectedKeyword,
    setSelectedKeyword,
    data,
    loading: loadingKeywords || loadingFeed,
    error,
  };
}
