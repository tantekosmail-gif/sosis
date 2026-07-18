"use client";

import { useState } from "react";
import { toast } from "sonner";

import { analyze } from "../services/analysis.service";
import { transformDashboard } from "../transformers";
import { mergeGlobalDashboard } from "../transformers/global.transformer";
import { transformDateSearch } from "../transformers/dateSearch.transformer";
import { filterYoutubeResponseByDate } from "../transformers/youtube.transformer";

import { collect } from "@/features/search/services/collection.service";
import { useDashboardStore } from "@/store/dashboard.store";
import { useFilterStore } from "@/stores/filterStore";
import { getSettings } from "@/features/settings/hooks/useSettings";
import { pushNotification } from "@/features/notifications/hooks/useNotifications";

const ALL_PLATFORMS = ["youtube", "tiktok", "instagram", "facebook"];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAnalyze() {
  const setDashboard = useDashboardStore((s) => s.setDashboard);
  const setLoading = useDashboardStore((s) => s.setLoading);

  const [error, setError] = useState("");

  async function executeSingle(platform: string, keyword: string) {
    // Baca langsung dari store (bukan via hook reaktif) supaya selalu dapat
    // nilai terbaru — termasuk saat execute() dipanggil tepat setelah
    // setStartDate/setEndDate pada render yang sama (mis. klik preset tanggal
    // yang langsung memicu re-analisis), yang mana snapshot dari hook masih
    // membawa nilai lama sampai re-render berikutnya.
    const { startDate, endDate } = useFilterStore.getState();

    // YouTube tidak pernah lewat date-search — selalu smart-search, filter
    // tanggalnya diterapkan di client (lihat analysis.service).
    const usingDateSearch = !!(startDate && endDate) && platform !== "youtube";

    let response = await analyze({
      platform,
      keyword,
      dateFrom: startDate || undefined,
      dateTo: endDate || undefined,
    });

    // date-search pakai auto_crawl — tidak perlu collect + polling manual
    if (!usingDateSearch && response.status === "not_found") {
      const { maxPages, maxCommentsPerVideo, maxCommentPages } = getSettings();
      await collect({ platform, keyword, maxPages, maxCommentsPerVideo, maxCommentPages });

      let retries = 20;
      while (retries > 0) {
        await sleep(2000);
        response = await analyze({ platform, keyword });
        if (response.status === "ready") break;
        retries--;
      }

      if (response.status !== "ready") {
        throw new Error("Data masih diproses. Silakan coba lagi beberapa saat.");
      }
    }

    // Pakai transformer yang sesuai dengan format response
    if (usingDateSearch) {
      return transformDateSearch(response, platform, keyword);
    }
    if (platform === "youtube" && startDate && endDate) {
      response = filterYoutubeResponseByDate(response, startDate, endDate);
    }
    return transformDashboard(platform, response, keyword);
  }

  async function execute(platform: string, keyword: string) {
    try {
      setLoading(true);
      setError("");

      let dashboard;

      if (platform === "global") {
        // Jalankan semua platform paralel, abaikan yang gagal
        const results = await Promise.allSettled(
          ALL_PLATFORMS.map((p) => executeSingle(p, keyword))
        );
        const fulfilled = results
          .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
          .map((r) => r.value);

        if (fulfilled.length === 0) throw new Error("Semua platform gagal diakses.");
        dashboard = mergeGlobalDashboard(fulfilled, keyword);
      } else {
        dashboard = await executeSingle(platform, keyword);
      }

      setDashboard(dashboard);

      if (getSettings().notifyOnAnalysisDone) {
        const title = `Analisis "${keyword}" selesai`;
        const message = `Platform: ${platform === "global" ? "Semua platform" : platform}`;
        toast.success(title, { description: message });
        pushNotification({ type: "success", title, message });
      }

      return dashboard;
    } catch (err: any) {
      console.error(err);
      const message = err?.message || "Terjadi kesalahan";
      setError(message);

      if (getSettings().notifyOnError) {
        const title = `Analisis "${keyword}" gagal`;
        toast.error(title, { description: message });
        pushNotification({ type: "error", title, message });
      }

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
