"use client";

import { Loader2, Feather, Music2, AtSign } from "lucide-react";

import TrendDiscoveryChart from "@/components/trend/TrendDiscoveryChart";
import { useTrendDiscoveryBySource } from "../hooks/useTrendDiscoveryBySource";
import type { TrendDiscoverySource } from "../types/discovery.types";

const SOURCE_CONFIG = {
  twitter: {
    title: "Twitter/X Trends",
    subtitle: "Topik trending native Twitter/X",
    icon: Feather,
    iconClassName: "bg-sky-50 dark:bg-sky-950/40 text-sky-600",
    accentColor: "#0284c7",
  },
  tiktok: {
    title: "TikTok Trends",
    subtitle: "Topik hasil sapuan akun TikTok",
    icon: Music2,
    iconClassName: "bg-rose-50 dark:bg-rose-950/40 text-rose-600",
    accentColor: "#e11d48",
  },
  instagram: {
    title: "Instagram Trends",
    subtitle: "Topik hasil sapuan akun Instagram",
    icon: AtSign,
    iconClassName: "bg-pink-50 dark:bg-pink-950/40 text-pink-600",
    accentColor: "#db2777",
  },
} satisfies Record<TrendDiscoverySource, unknown>;

export default function TrendDiscoveryBySourceSection({ source }: { source: TrendDiscoverySource }) {
  const { data, loading, error } = useTrendDiscoveryBySource(source);
  const config = SOURCE_CONFIG[source];

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-16 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <TrendDiscoveryChart
      topics={data.topics ?? []}
      date={data.date}
      showConfirmation={false}
      {...config}
    />
  );
}
