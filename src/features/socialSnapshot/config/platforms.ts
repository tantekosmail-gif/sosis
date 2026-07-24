import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaThreads, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import { getVideoMetadata } from "@/features/youtube/services/search.service";
import { getInstagramMetadata } from "@/features/instagram/services/metadata.service";
import { getFacebookMetadata } from "@/features/facebook/services/metadata.service";
import { getThreadsMetadata } from "@/features/threads/services/metadata.service";
import { getTikTokVideoMetadata } from "@/features/tiktok/services/videoMetadata.service";
import { getTwitterMetadata } from "@/features/twitter/services/metadata.service";

export interface NormalizedSnapshotItem {
  id: string;
  title: string;
  author: string;
  url: string;
  publishedAt: string;
  likes: number;
  views: number;
  comments: number;
  trendScore: number | null;
}

export interface NormalizedSnapshotResponse {
  items: NormalizedSnapshotItem[];
  total: number;
  totalPrimaryMetric: number;
  totalComments: number;
  avgTrendScore: number | null;
}

export type SnapshotMetric = "likes" | "views";

export type PlatformSnapshotKey = "youtube" | "instagram" | "facebook" | "threads" | "tiktok" | "twitter";

export interface PlatformSnapshotConfig {
  key: PlatformSnapshotKey;
  href: string;
  Icon: IconType;
  accentColor: string;
  primaryMetric: SnapshotMetric;
  fetchSnapshot: () => Promise<NormalizedSnapshotResponse>;
}

const FETCH_PARAMS = { sortBy: "published_at" as const, order: "desc" as const, pageSize: 100 };

function sumBy<T>(items: T[], pick: (item: T) => number): number {
  return items.reduce((sum, item) => sum + num(pick(item)), 0);
}

// Metadata endpoints don't always populate every metric field for every item
// (sparse/legacy rows) — coerce to 0 so a missing field doesn't turn a sum into NaN.
function num(n: number | null | undefined): number {
  return n ?? 0;
}

export const PLATFORM_SNAPSHOTS: PlatformSnapshotConfig[] = [
  {
    key: "youtube",
    href: "/youtube",
    Icon: FaYoutube,
    accentColor: "#EF4444",
    primaryMetric: "views",
    fetchSnapshot: async () => {
      const res = await getVideoMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.title?.trim() || it.content?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: num(it.metrics.views),
          comments: num(it.metrics.comments),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_videos),
        totalPrimaryMetric: num(res.stats.total_views),
        totalComments: sumBy(res.items, (it) => it.metrics.comments),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
  {
    key: "instagram",
    href: "/instagram",
    Icon: FaInstagram,
    accentColor: "#EC4899",
    primaryMetric: "likes",
    fetchSnapshot: async () => {
      const res = await getInstagramMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.title?.trim() || it.content?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: num(it.metrics.views),
          comments: num(it.metrics.comments),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_posts),
        totalPrimaryMetric: num(res.stats.total_likes),
        totalComments: sumBy(res.items, (it) => it.metrics.comments),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
  {
    key: "facebook",
    href: "/facebook",
    Icon: FaFacebook,
    accentColor: "#2563EB",
    primaryMetric: "likes",
    fetchSnapshot: async () => {
      const res = await getFacebookMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.title?.trim() || it.content?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: 0,
          comments: num(it.metrics.comments),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_posts),
        totalPrimaryMetric: num(res.stats.total_likes),
        totalComments: sumBy(res.items, (it) => it.metrics.comments),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
  {
    key: "threads",
    href: "/threads",
    Icon: FaThreads,
    accentColor: "#7C3AED",
    primaryMetric: "likes",
    fetchSnapshot: async () => {
      const res = await getThreadsMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.title?.trim() || it.content?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: num(it.metrics.views),
          comments: num(it.metrics.comments),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_posts),
        totalPrimaryMetric: num(res.stats.total_likes),
        totalComments: sumBy(res.items, (it) => it.metrics.comments),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
  {
    key: "tiktok",
    href: "/tiktok",
    Icon: FaTiktok,
    accentColor: "#0D9488",
    primaryMetric: "views",
    fetchSnapshot: async () => {
      const res = await getTikTokVideoMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.title?.trim() || it.content?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: num(it.metrics.views),
          comments: num(it.metrics.comments),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_videos),
        totalPrimaryMetric: num(res.stats.total_views),
        totalComments: sumBy(res.items, (it) => it.metrics.comments),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
  {
    key: "twitter",
    href: "/twitter",
    Icon: FaXTwitter,
    accentColor: "#0284C7",
    primaryMetric: "likes",
    fetchSnapshot: async () => {
      const res = await getTwitterMetadata(FETCH_PARAMS);
      return {
        items: res.items.map((it) => ({
          id: it.id,
          title: it.text?.trim()?.slice(0, 140) || "",
          author: it.author,
          url: it.url,
          publishedAt: it.published_at,
          likes: num(it.metrics.likes),
          views: num(it.metrics.views),
          comments: num(it.metrics.replies),
          trendScore: it.scores.trend_score,
        })),
        total: num(res.stats.total_posts),
        totalPrimaryMetric: num(res.stats.total_likes),
        totalComments: sumBy(res.items, (it) => it.metrics.replies),
        avgTrendScore: res.stats.avg_trend_score,
      };
    },
  },
];
