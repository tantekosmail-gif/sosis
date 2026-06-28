"use client";

import { useState } from "react";

import { analyze } from "../services/analysis.service";
import { transformDashboard } from "../transformers";

import { collect } from "@/features/search/services/collection.service";
import { useDashboardStore } from "@/store/dashboard.store";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

      // ============================
      // Belum ada data -> mulai scraping
      // ============================
      if (response.data.status === "not_found") {
        await collect({
          platform,
          keyword,
          maxPages: 2,
          maxCommentsPerVideo: 50,
          maxCommentPages: 2,
        });

        let retries = 20;

        while (retries > 0) {
          await sleep(2000);

          response = await analyze({
            platform,
            keyword,
          });

          if (response.data.status === "ready") {
            break;
          }

          retries--;
        }

        if (response.data.status !== "ready") {
          throw new Error(
            "Data masih diproses. Silakan coba lagi beberapa saat.",
          );
        }
      }

      // ============================
      // Dashboard
      // ============================
      const dashboard = transformDashboard(platform, response);

      setDashboard(dashboard);

      return dashboard;
    } catch (err: any) {
      console.error(err);

      setError(err?.message || "Terjadi kesalahan");

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
