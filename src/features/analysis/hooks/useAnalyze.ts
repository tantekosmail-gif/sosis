"use client";

import { useState } from "react";

import { analyze } from "../services/analysis.service";

import { transformDashboard } from "../transformers";

import { useDashboardStore } from "@/store/dashboard.store";

export function useAnalyze() {
  const setDashboard = useDashboardStore((s) => s.setDashboard);

  const setLoading = useDashboardStore((s) => s.setLoading);

  const [error, setError] = useState("");

  async function execute(platform: string, keyword: string) {
    try {
      setLoading(true);

      setError("");

      let response = await analyze({
        platform,
        keyword,
      });

      if (response.data.status === "not_found") {
        response = {
          success: true,
          data: {
            status: "ready",
            query: "",
            keyword_id: "",
            stats: {
              total_videos: 0,
              total_comments: 0,
              total_analyzed: 0,
              coverage_pct: 0,
            },
            sentiment: {
              positif: {
                count: 0,
                percentage: 0,
              },
              negatif: {
                count: 0,
                percentage: 0,
              },
              netral: {
                count: 0,
                percentage: 0,
              },
              dominant: "",
            },
            videos: [],
            comments: [],
          },
        };
      }

      const dashboard = transformDashboard(platform, response);

      setDashboard(dashboard);

      return dashboard;
    } catch (err: any) {
      setError(err.message);

      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    error,
  };
}
