"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateExecutiveInsight, type ExecutiveInsightPayload } from "../services/executiveInsight.service";

interface ExecutiveInsightResult {
  headline: string;
  insight: string;
}

export function useExecutiveInsight() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExecutiveInsightResult | null>(null);

  async function generate(payload: ExecutiveInsightPayload) {
    try {
      setLoading(true);
      const result = await generateExecutiveInsight(payload);
      if (result?.error) throw new Error(result.error);

      setData({
        headline: typeof result.headline === "string" ? result.headline : "",
        insight: typeof result.insight === "string" ? result.insight : "",
      });
    } catch (err: any) {
      toast.error("Gagal membuat insight AI", { description: err?.message || "Terjadi kesalahan" });
    } finally {
      setLoading(false);
    }
  }

  return { loading, data, generate };
}
