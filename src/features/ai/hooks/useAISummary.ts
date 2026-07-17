"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateSummary } from "../services/summary.service";
import { getSettings } from "@/features/settings/hooks/useSettings";
import { pushNotification } from "@/features/notifications/hooks/useNotifications";

export function useAISummary() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function run(payload: any) {
    try {
      setLoading(true);

      const result = await generateSummary(payload);

      console.log("AI RESULT:", result);

      if (getSettings().notifyOnAISummaryDone) {
        const title = "Ringkasan otomatis selesai dibuat";
        toast.success(title, { description: payload?.keyword ? `Keyword: ${payload.keyword}` : undefined });
        pushNotification({ type: "success", title, message: payload?.keyword ? `Keyword: ${payload.keyword}` : undefined });
      }

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
    } catch (err: any) {
      console.error(err);

      if (getSettings().notifyOnError) {
        const title = "Gagal membuat ringkasan otomatis";
        const message = err?.message || "Terjadi kesalahan";
        toast.error(title, { description: message });
        pushNotification({ type: "error", title, message });
      }
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