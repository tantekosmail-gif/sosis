"use client";

import { Activity, Loader2, Lightbulb, Target, CheckCircle2 } from "lucide-react";
import { useAISummary } from "@/features/ai/hooks/useAISummary";
import { useDashboardStore } from "@/store/dashboard.store";

export default function AISummarySection() {
  const { loading, data, run } = useAISummary();
  const dashboard = useDashboardStore((s) => s.dashboard);

  async function handleGenerate() {
    if (!dashboard) return;
    await run({
      platform: dashboard.platform,
      keyword: dashboard.keyword,
      videos: dashboard.videos,
      comments: dashboard.comments,
      sentiment: dashboard.sentiment,
      topics: dashboard.topics,
      stats: dashboard.stats,
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50 px-6 py-5 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow shadow-violet-500/30">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">Ringkasan Eksekutif</h2>
          </div>
        </div>

        <button
          disabled={loading || !dashboard}
          onClick={handleGenerate}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow shadow-violet-500/30 transition hover:from-violet-700 hover:to-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <><Loader2 size={15} className="animate-spin" /> Memproses...</>
          ) : (
            <>Generate Otomatis</>
          )}
        </button>
      </div>

      <div className="p-6">
        {/* Empty */}
        {!loading && !data && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 py-16 text-center dark:border-slate-700 dark:bg-slate-950/50">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/40">
              <Activity size={24} className="text-violet-400" />
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Belum ada ringkasan</p>
            <p className="mt-2 max-w-xs text-sm text-slate-400 dark:text-slate-500">
              Klik <span className="font-semibold text-violet-600">Generate Otomatis</span> untuk membuat ringkasan eksekutif dari data analisis.
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative mb-5">
              <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-violet-600" />
              </div>
            </div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Sedang menganalisa...</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Memproses komentar dan menyusun ringkasan</p>
          </div>
        )}

        {/* Result */}
        {!loading && data && (
          <div className="space-y-5">
            {/* Summary */}
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-5 dark:bg-violet-950/40">
              <div className="mb-3 flex items-center gap-2">
                <Lightbulb size={15} className="text-violet-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-violet-600">
                  Executive Summary
                </h3>
              </div>
              <p className="leading-7 text-slate-700 dark:text-slate-300">{data.summary}</p>
            </div>

            {/* Recommendation */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:bg-indigo-950/40">
              <div className="mb-3 flex items-center gap-2">
                <Target size={15} className="text-indigo-600" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Recommendation
                </h3>
              </div>
              <p className="leading-7 text-slate-700 dark:text-slate-300">{data.recommendation}</p>
            </div>

            {/* Key Insights */}
            {data.key_insights?.length > 0 && (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                    Key Insights
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {data.key_insights.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                        {i + 1}
                      </div>
                      <span className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
