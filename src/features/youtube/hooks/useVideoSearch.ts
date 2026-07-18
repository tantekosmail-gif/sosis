"use client";

import { useCallback, useState } from "react";

import { searchRecentVideos } from "../services/search.service";
import type { ViralSentimentBreakdown } from "../types/viral.types";

export interface SearchedVideoItem {
  video_id: string;
  title: string;
  channel: string;
  url: string;
  thumbnail: string;
  views: number;
  likes: number;
  published_at: string;
  /** Hanya ada di video yang ikut dianalisis backend (sentiment_top_n teratas). */
  sentiment_summary?: ViralSentimentBreakdown;
}

// Bentuk mentah tiap entri array `data.sentiment` dari search-recent — flat
// per kelas (bukan {count, percentage} seperti ViralSentimentBreakdown), dan
// cuma ada utk video yang ikut dianalisis backend (lihat sentiment_note pada
// response: hanya sentiment_top_n video PALING BARU dari yg baru ditemukan).
interface RawSentimentEntry {
  video_id: string;
  comments_fetched?: number;
  comments_analyzed?: number;
  positif?: number;
  netral?: number;
  negatif?: number;
}

function toSentimentSummary(entry?: RawSentimentEntry): ViralSentimentBreakdown | undefined {
  if (!entry) return undefined;
  const positif = entry.positif ?? 0;
  const netral = entry.netral ?? 0;
  const negatif = entry.negatif ?? 0;
  const total = positif + netral + negatif;
  if (total === 0) return undefined;

  const pct = (n: number) => Math.round((n / total) * 1000) / 10;
  return {
    positif: { count: positif, percentage: pct(positif) },
    netral: { count: netral, percentage: pct(netral) },
    negatif: { count: negatif, percentage: pct(negatif) },
  };
}

// Keyword search surfaces only recently published videos (last N hours)
// rather than searching all-time, so results stay relevant to "what's
// happening now" for a given keyword. The window is user-selectable:
// 24 jam (1 hari, default) atau 168 jam (1 minggu).
const DEFAULT_HOURS_BACK = 24;

export function useVideoSearch() {
  const [keyword, setKeyword] = useState("");
  const [hoursBack, setHoursBack] = useState(DEFAULT_HOURS_BACK);
  const [items, setItems] = useState<SearchedVideoItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const search = useCallback(async (q: string, hoursOverride?: number) => {
    const trimmed = q.trim();
    setKeyword(trimmed);

    if (!trimmed) {
      setItems(null);
      setTotal(0);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const raw = await searchRecentVideos({
        keyword: trimmed,
        hoursBack: hoursOverride ?? hoursBack,
        maxResults: 50,
      });
      const data = raw?.data ?? raw ?? {};
      const videos = data.videos ?? data.items ?? [];
      const sentimentByVideoId = new Map<string, RawSentimentEntry>(
        (data.sentiment ?? []).map((entry: RawSentimentEntry) => [entry.video_id, entry])
      );
      const merged = videos.map((video: SearchedVideoItem) => ({
        ...video,
        sentiment_summary: toSentimentSummary(sentimentByVideoId.get(video.video_id)),
      }));
      setItems(merged);
      setTotal(data.found ?? data.total ?? merged.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari video");
      setItems(null);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [hoursBack]);

  // Ganti periode pencarian; kalau sudah ada keyword aktif, langsung cari
  // ulang dengan periode baru supaya hasil di layar ikut berubah.
  const changeHoursBack = useCallback(
    (hours: number) => {
      setHoursBack(hours);
      if (keyword.trim()) void search(keyword, hours);
    },
    [keyword, search],
  );

  return { keyword, items, total, loading, error, search, hoursBack, changeHoursBack };
}
