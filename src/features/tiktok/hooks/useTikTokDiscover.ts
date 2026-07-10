"use client";

import { useCallback, useState } from "react";

import { discoverTikTokAccounts } from "../services/discover.service";
import type { TikTokDiscoverResult } from "../types/discover.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useTikTokDiscover() {
  const [data, setData] = useState<TikTokDiscoverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discover = useCallback(async (keyword: string, maxResults?: number) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError("");
      const result = await discoverTikTokAccounts({ keyword: trimmed, maxResults: maxResults ?? getSettings().discoverMaxResults });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal menemukan akun untuk topik ini");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, discover };
}
