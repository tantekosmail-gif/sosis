"use client";

import { useCallback, useEffect, useState } from "react";
import type { TrendingPublicData, TrendingPublicResponse } from "./types";

// Deliberately plain fetch() with no headers/credentials — this endpoint is
// public and must never carry the admin dashboard's Authorization token
// (see src/lib/api.ts, which attaches one automatically). Anonymous visitors
// opening the shared /trending link have no token anyway, but a logged-in
// admin previewing the same link in their own browser must not leak one.
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "https://api.dismi.xyz";

export function useTrendingPublic(geo: string) {
  const [data, setData] = useState<TrendingPublicData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (targetGeo: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `${API_BASE}/api/v1/youtube/trending-public?geo=${encodeURIComponent(targetGeo)}`
      );
      if (!res.ok) throw new Error(`Gagal memuat data trending (status ${res.status})`);
      const json: TrendingPublicResponse = await res.json();
      if (!json.success) throw new Error("Respons API tidak valid");
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat data trending");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await fetchData(geo);
    })();
  }, [geo, fetchData]);

  return { data, loading, error, refetch: () => fetchData(geo) };
}
