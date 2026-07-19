"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, Eye, MessageSquare, Video } from "lucide-react";

import type { AggregatedViralStats } from "@/features/youtube/lib/aggregateViralStats";
import { jetBrainsMono } from "@/lib/fonts/dashboardFonts";

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Math.round(n).toLocaleString("id-ID");
}

function StatCard({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
        <span className={`${jetBrainsMono.className} text-[11px] font-medium uppercase tracking-wider`}>{label}</span>
        <Icon size={16} className="text-indigo-500" />
      </div>
      <p className={`${jetBrainsMono.className} mt-2 text-2xl font-medium text-slate-900 dark:text-slate-100`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>}
    </div>
  );
}

export default function AnalyticsStatCards({ stats }: { stats: AggregatedViralStats }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard icon={Video} label="Total Video" value={stats.total_videos.toLocaleString("id-ID")} />
      <StatCard icon={MessageSquare} label="Total Komentar" value={stats.total_comments.toLocaleString("id-ID")} />
      <StatCard
        icon={Eye}
        label="Rata-rata View"
        value={formatCompact(stats.avg_views)}
        sub="Dari seluruh channel yang dipantau"
      />
      <StatCard
        icon={BarChart3}
        label="Coverage"
        value={`${stats.coverage_pct.toFixed(1)}%`}
        sub={`${stats.total_analyzed.toLocaleString("id-ID")}/${stats.total_comments.toLocaleString("id-ID")} komentar dianalisis`}
      />
    </div>
  );
}
