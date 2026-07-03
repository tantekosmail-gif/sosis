"use client";

import type { LucideIcon } from "lucide-react";
import { MessageSquare, PieChart, TrendingUp, Video } from "lucide-react";

import type { ViralSentimentOverview, ViralStats } from "@/features/viral/types/viral.types";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" },
};

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function ViralOverview({
  stats,
  sentiment,
}: {
  stats: ViralStats;
  sentiment: ViralSentimentOverview;
}) {
  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    ...sentiment[key],
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Video} label="Total Video" value={stats.total_videos.toLocaleString("id-ID")} />
        <StatCard icon={MessageSquare} label="Total Komentar" value={stats.total_comments.toLocaleString("id-ID")} />
        <StatCard icon={TrendingUp} label="Dianalisis" value={stats.total_analyzed.toLocaleString("id-ID")} />
        <StatCard icon={PieChart} label="Coverage" value={`${stats.coverage_pct.toFixed(1)}%`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentimen Komentar</span>
          <span className="text-[11px] text-slate-400">{sentiment.total_analyzed} komentar dianalisis</span>
        </div>

        {sentiment.total_analyzed > 0 ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {entries.map((e) => (
                <div key={e.key} className={SENTIMENT_COLOR[e.key].bar} style={{ width: `${e.percentage}%` }} />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {entries.map((e) => (
                <span
                  key={e.key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[e.key].bg} ${SENTIMENT_COLOR[e.key].text} ${
                    sentiment.dominant === e.key ? "border-current" : "border-transparent"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[e.key].bar}`} />
                  {SENTIMENT_LABEL[e.key]} {e.percentage.toFixed(1)}% ({e.count})
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400">Belum ada komentar yang dianalisis</p>
        )}
      </div>
    </div>
  );
}
