"use client";

import type { ViralSentimentOverview } from "@/features/youtube/types/viral.types";
import { hankenGrotesk, jetBrainsMono } from "@/lib/fonts/dashboardFonts";

const SENTIMENT_COLOR: Record<string, { bar: string; dot: string }> = {
  positif: { bar: "bg-emerald-500", dot: "bg-emerald-500" },
  netral: { bar: "bg-amber-400", dot: "bg-amber-400" },
  negatif: { bar: "bg-red-500", dot: "bg-red-500" },
};

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

export default function AnalyticsSentimentPanel({ sentiment }: { sentiment: ViralSentimentOverview }) {
  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({ key, ...sentiment[key] }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`${hankenGrotesk.className} text-lg font-bold text-slate-900 dark:text-slate-100`}>
            Analisis Sentimen
          </h2>
          <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500">
            Distribusi sentimen dari {sentiment.total_analyzed.toLocaleString("id-ID")} komentar yang dianalisis.
          </p>
        </div>

        <div className={`${jetBrainsMono.className} flex flex-wrap items-center gap-4 text-xs font-medium`}>
          {entries.map((e) => (
            <span key={e.key} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className={`h-2.5 w-2.5 rounded-full ${SENTIMENT_COLOR[e.key].dot}`} />
              {SENTIMENT_LABEL[e.key]} ({e.percentage.toFixed(1)}%)
            </span>
          ))}
        </div>
      </div>

      {sentiment.total_analyzed > 0 ? (
        <div className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          {entries.map((e) =>
            e.percentage > 0 ? (
              <div key={e.key} className={SENTIMENT_COLOR[e.key].bar} style={{ width: `${e.percentage}%` }} />
            ) : null
          )}
        </div>
      ) : (
        <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">Belum ada komentar yang dianalisis</p>
      )}
    </div>
  );
}
