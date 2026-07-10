"use client";

import { useCallback, useState } from "react";

import { discoverTwitterAccounts } from "../services/discover.service";
import type { TwitterDiscoverResult } from "../types/discover.types";
import { getSettings } from "@/features/settings/hooks/useSettings";

export function useTwitterDiscover() {
  const [data, setData] = useState<TwitterDiscoverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discover = useCallback(async (keyword: string, maxResults?: number) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError("");
      const result = await discoverTwitterAccounts({ keyword: trimmed, maxResults: maxResults ?? getSettings().discoverMaxResults });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal menemukan akun untuk topik ini");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, discover };
}
