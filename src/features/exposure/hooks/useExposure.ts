"use client";

import { useState } from "react";

import { executeExposure } from "../services/exposure.service";

export function useExposure() {
  const [loading, setLoading] = useState(false);

  const [cards, setCards] = useState();

  const [timeline, setTimeline] = useState();
  async function reload(topicId: string) {
    try {
      setLoading(true);

      const payload = {
        analyze_id: "8c0719bbfd327ebc3380a7b013b215ba",
        filter: JSON.stringify({
          query: {
            bool: {
              must: [],
            },
          },
        }),
        criteria_id: "b22bc8ad532305803f7188a73ea15eef",
        platform: "global",
        interval: "1d",
        type: "",
      };

      const response = await executeExposure(payload);

      /**
       * IMPORTANT:
       * mapping data harus sesuai response API
       */

      setCards(response?.cards || []);
      setTimeline(response?.timeline || []);
    } catch (err) {
      console.error(err);
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
