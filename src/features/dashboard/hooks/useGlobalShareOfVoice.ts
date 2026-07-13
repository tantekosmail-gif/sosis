"use client";

import { useEffect, useState } from "react";

import { getShareOfVoice } from "@/features/topic/services/topic.service";
import { normalizeShareOfVoice, type ShareOfVoiceItem } from "@/lib/shareOfVoice";
import { periodToRange, type PeriodPreset } from "@/lib/period";

export function useGlobalShareOfVoice(period: PeriodPreset) {
  const [items, setItems] = useState<ShareOfVoiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError("");
        // keyword_ids kosong = semua keyword aktif, per dokumentasi endpoint.
        const { date_from, date_to } = periodToRange(period);
        const raw = await getShareOfVoice([], undefined, date_from, date_to);
        if (!cancelled) setItems(normalizeShareOfVoice(raw));
      } catch (err) {
        console.error("getShareOfVoice (global) failed:", err);
        if (!cancelled) setError("Gagal memuat Share of Voice");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return { items, loading, error };
}
