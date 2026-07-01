"use client";

import { useState } from "react";
import { generateSummary } from "../services/summary.service";

export function useAISummary() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function run(payload: any) {
    try {
      setLoading(true);

      const result = await generateSummary(payload);

      console.log("AI RESULT:", result);

      setData({
        summary:
          typeof result.summary === "string"
            ? result.summary
            : JSON.stringify(result.summary, null, 2),

        recommendation:
          typeof result.recommendation === "string"
            ? result.recommendation
            : JSON.stringify(result.recommendation, null, 2),

        key_insights: Array.isArray(result.key_insights)
          ? result.key_insights.map((item: any) =>
              typeof item === "string"
                ? item
                : item.metric && item.value
                ? `${item.metric}: ${item.value}`
                : JSON.stringify(item)
            )
          : [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    data,
    run,
  };
}