"use client";

import { useQuery } from "@tanstack/react-query";

import type { NormalizedSnapshotItem, PlatformSnapshotConfig } from "../config/platforms";

const TREND_DAYS = 14;
const TOP_POSTS_LIMIT = 5;

export interface SnapshotTrendPoint {
  date: string;
  label: string;
  count: number;
}

export interface SnapshotTopPost {
  item: NormalizedSnapshotItem;
  value: number;
  share: number;
}

export interface PlatformSnapshotData {
  totalPosts: number;
  totalPrimaryMetric: number;
  totalComments: number;
  avgTrendScore: number | null;
  trend: SnapshotTrendPoint[];
  topPosts: SnapshotTopPost[];
}

const DAY_MS = 24 * 60 * 60 * 1000;

// item.publishedAt is a UTC ISO string from the API, so bucket keys must be
// computed in UTC too — mixing in local Date math (setHours/setDate) shifts
// the "today" bucket to the wrong calendar day for any viewer whose timezone
// is ahead of UTC (e.g. WIB/UTC+7), silently dropping that day's posts.
function buildTrend(items: NormalizedSnapshotItem[]): SnapshotTrendPoint[] {
  const now = new Date();
  const todayUtcMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  const buckets = new Map<string, number>();
  for (let i = TREND_DAYS - 1; i >= 0; i--) {
    const key = new Date(todayUtcMs - i * DAY_MS).toISOString().slice(0, 10);
    buckets.set(key, 0);
  }

  for (const item of items) {
    const key = item.publishedAt?.slice(0, 10);
    if (key && buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({
    date,
    label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    count,
  }));
}

function buildTopPosts(items: NormalizedSnapshotItem[], metric: "likes" | "views"): SnapshotTopPost[] {
  const sorted = [...items].sort((a, b) => b[metric] - a[metric]).slice(0, TOP_POSTS_LIMIT);
  const max = sorted[0]?.[metric] ?? 0;

  return sorted.map((item) => ({
    item,
    value: item[metric],
    share: max > 0 ? item[metric] / max : 0,
  }));
}

async function fetchPlatformSnapshot(config: PlatformSnapshotConfig): Promise<PlatformSnapshotData> {
  const res = await config.fetchSnapshot();

  return {
    totalPosts: res.total,
    totalPrimaryMetric: res.totalPrimaryMetric,
    totalComments: res.totalComments,
    avgTrendScore: res.avgTrendScore,
    trend: buildTrend(res.items),
    topPosts: buildTopPosts(res.items, config.primaryMetric),
  };
}

export function usePlatformSnapshot(config: PlatformSnapshotConfig) {
  return useQuery({
    queryKey: ["social-snapshot", config.key],
    queryFn: () => fetchPlatformSnapshot(config),
    staleTime: 60_000,
  });
}
