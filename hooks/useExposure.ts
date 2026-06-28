"use client";

import { useState } from "react";
import { executeExposure } from "../services/exposure.service";

export function useExposure() {
  const [loading, setLoading] = useState(false);

  const [cards, setCards] = useState<any>({
    total: 0,
    engagement: 0,
    reach: 0,
    sentimentScore: 0,
  });

  const [timeline, setTimeline] = useState<any[]>([]);

  async function reload(payload: any) {
    try {
      setLoading(true);

      const res = await executeExposure(payload);

      /**
       * IMPORTANT:
       * sesuaikan dengan response API kamu
       */
      setCards({
        total: res?.total ?? 0,
        engagement: res?.engagement ?? 0,
        reach: res?.reach ?? 0,
        sentimentScore: res?.sentimentScore ?? 0,
      });

      setTimeline(res?.timeline ?? []);
    } catch (err) {
      console.error("Exposure error:", err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    cards,
    timeline,
    reload,
  };
}