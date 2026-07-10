"use client";

import { Loader2 } from "lucide-react";

import TrendWordCountChart from "@/components/trend/TrendWordCountChart";
import { useTrendTimeline } from "../hooks/useTrendTimeline";

export default function TrendWordCountSection() {
  const { data, loading, error } = useTrendTimeline();

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

  return <TrendWordCountChart data={data} />;
}
