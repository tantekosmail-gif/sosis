"use client";

import { useCallback, useState } from "react";

import { fetchPlatformSearchResult } from "../services/socialCompare.service";
import type { ComparablePlatform, PlatformSearchResult } from "../types/socialCompare.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

const PLATFORMS: ComparablePlatform[] = ["facebook", "instagram", "twitter", "tiktok"];

export function useSocialCompare() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState<Partial<Record<ComparablePlatform, PlatformSearchResult>>>({});
  const [platformErrors, setPlatformErrors] = useState<Partial<Record<ComparablePlatform, string>>>({});

  const compare = useCallback(async (targetKeyword: string, dateFrom?: string, dateTo?: string) => {
    const trimmed = targetKeyword.trim();
    if (!trimmed) return;

    setLoading(true);
    setError("");
    setKeyword(trimmed);

    const { searchResultLimit } = getSettings();
    const settled = await Promise.allSettled(
      PLATFORMS.map((platform) =>
        fetchPlatformSearchResult(platform, { keyword: trimmed, dateFrom, dateTo, limit: searchResultLimit })
      )
    );

    const nextResults: Partial<Record<ComparablePlatform, PlatformSearchResult>> = {};
    const nextErrors: Partial<Record<ComparablePlatform, string>> = {};

    settled.forEach((outcome, idx) => {
      const platform = PLATFORMS[idx];
      if (outcome.status === "fulfilled") {
        nextResults[platform] = outcome.value;
      } else {
        nextErrors[platform] = outcome.reason?.message || `Gagal memuat data ${platform}`;
      }
    });

    setResults(nextResults);
    setPlatformErrors(nextErrors);

    if (Object.keys(nextResults).length === 0) {
      setError("Gagal membandingkan platform — semua permintaan gagal.");
    }

    setLoading(false);
  }, []);

  return {
    keyword,
    loading,
    error,
    results,
    platformErrors,
    compare,
  };
}
