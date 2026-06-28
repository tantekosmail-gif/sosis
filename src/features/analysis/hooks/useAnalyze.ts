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

      const response = await analyze({
        platform,
        keyword,
      });

      const dashboard = transformDashboard(
        platform,
        response
      );

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