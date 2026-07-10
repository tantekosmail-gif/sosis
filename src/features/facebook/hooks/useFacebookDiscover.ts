"use client";

import { useCallback, useState } from "react";

import { discoverFacebookAccounts } from "../services/discover.service";
import type { FacebookDiscoverResult } from "../types/discover.types";

export function useFacebookDiscover() {
  const [data, setData] = useState<FacebookDiscoverResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discover = useCallback(async (keyword: string, maxResults = 10) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    try {
      setLoading(true);
      setError("");
      const result = await discoverFacebookAccounts({ keyword: trimmed, maxResults });
      setData(result);
    } catch (err: any) {
      setError(err?.message || "Gagal menemukan akun untuk topik ini");
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, discover };
}
