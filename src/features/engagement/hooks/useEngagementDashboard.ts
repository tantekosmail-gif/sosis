"use client";

import { useEffect, useState } from "react";

import { fetchEngagementSummary, fetchEngagementTrend } from "../services/engagement.service";
import type { EngagementPlatform, EngagementSummary, EngagementTrend } from "../types/engagement.types";
import { periodToRange, type PeriodPreset } from "@/lib/period";

export const ENGAGEMENT_PLATFORMS: EngagementPlatform[] = [
  "youtube",
  "tiktok",
  "twitter",
  "facebook",
  "instagram",
];

export function useEngagementDashboard(period: PeriodPreset) {
  const [summaries, setSummaries] = useState<Partial<Record<EngagementPlatform, EngagementSummary>>>({});
  const [trends, setTrends] = useState<Partial<Record<EngagementPlatform, EngagementTrend>>>({});
  const [errors, setErrors] = useState<Partial<Record<EngagementPlatform, string>>>({});
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(() => periodToRange(period));

  useEffect(() => {
    let cancelled = false;
    const dateRange = periodToRange(period);

    (async () => {
      setLoading(true);
      setRange(dateRange);

      const [summaryResults, trendResults] = await Promise.all([
        Promise.allSettled(
          ENGAGEMENT_PLATFORMS.map((platform) =>
            fetchEngagementSummary(platform, { dateFrom: dateRange.date_from, dateTo: dateRange.date_to })
          )
        ),
        Promise.allSettled(
          ENGAGEMENT_PLATFORMS.map((platform) =>
            fetchEngagementTrend(platform, { dateFrom: dateRange.date_from, dateTo: dateRange.date_to })
          )
        ),
      ]);

      if (cancelled) return;

      const nextSummaries: Partial<Record<EngagementPlatform, EngagementSummary>> = {};
      const nextTrends: Partial<Record<EngagementPlatform, EngagementTrend>> = {};
      const nextErrors: Partial<Record<EngagementPlatform, string>> = {};

      ENGAGEMENT_PLATFORMS.forEach((platform, i) => {
        const summaryResult = summaryResults[i];
        const trendResult = trendResults[i];

        if (summaryResult.status === "fulfilled") {
          nextSummaries[platform] = summaryResult.value;
        } else {
          nextErrors[platform] = summaryResult.reason?.message || `Gagal memuat data ${platform}`;
        }

        if (trendResult.status === "fulfilled") {
          nextTrends[platform] = trendResult.value;
        }
      });

      setSummaries(nextSummaries);
      setTrends(nextTrends);
      setErrors(nextErrors);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [period]);

  return { summaries, trends, errors, loading, range };
}
