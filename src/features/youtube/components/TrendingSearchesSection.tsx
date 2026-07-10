"use client";

import { Loader2 } from "lucide-react";

import TrendingSearchesChart from "@/components/youtube/TrendingSearchesChart";
import { useYoutubeTrending } from "../hooks/useYoutubeTrending";

export default function TrendingSearchesSection() {
  const { data, loading, error } = useYoutubeTrending();

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

  return <TrendingSearchesChart items={data.items} geo={data.geo} period={data.period} />;
}
