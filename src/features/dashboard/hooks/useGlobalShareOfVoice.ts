"use client";

import { useEffect, useState } from "react";

import { getShareOfVoice } from "@/features/topic/services/topic.service";
import { normalizeShareOfVoice, type ShareOfVoiceItem } from "@/lib/shareOfVoice";

export function useGlobalShareOfVoice() {
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
        const raw = await getShareOfVoice([]);
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
  }, []);

  return { items, loading, error };
}
