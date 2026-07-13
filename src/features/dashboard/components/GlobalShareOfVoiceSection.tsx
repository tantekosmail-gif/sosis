"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import PeriodSelect from "@/components/dashboard/PeriodSelect";
import ShareOfVoicePieChart from "./ShareOfVoicePieChart";
import { useGlobalShareOfVoice } from "../hooks/useGlobalShareOfVoice";
import type { PeriodPreset } from "@/lib/period";

export default function GlobalShareOfVoiceSection() {
  const [period, setPeriod] = useState<PeriodPreset>("all");
  const { items, loading, error } = useGlobalShareOfVoice(period);

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
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

  // Perbandingan cuma berarti kalau ada lebih dari 1 keyword aktif.
  if (items.length < 2) return null;

  return <ShareOfVoicePieChart items={items} headerRight={<PeriodSelect value={period} onChange={setPeriod} />} />;
}
