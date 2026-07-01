"use client";

import { smartSearch } from "../services/search.service";
import { useDashboardStore } from "@/store/dashboard.store";

interface SmartSearchPayload {
  keyword: string;
  platform: string;
  limitVideos: number;
  limitComments: number;
}

export function useSmartSearch() {
  const { setDashboard, setLoading, loading } = useDashboardStore();

  async function execute(payload: SmartSearchPayload) {
    try {
      setLoading(true);
      const result = await smartSearch(payload);
      setDashboard(result);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    execute,
    loadingSmartSearch: loading,
  };
}
