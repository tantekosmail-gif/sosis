"use client";

import { useState } from "react";
import { GitCompareArrows, Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";
import { dateSearch } from "@/features/search/services/dateSearch.service";
import { smartSearch } from "@/features/search/services/search.service";
import { transformDashboard } from "@/features/analysis/transformers";
import { transformDateSearch } from "@/features/analysis/transformers/dateSearch.transformer";
import { DashboardData } from "@/types/dashboard.type";
import { useFilterStore } from "@/stores/filterStore";
import { getSettings } from "@/features/settings/hooks/useSettings";

// FastAPI validation errors come back as `{ detail: [{ msg, loc, ... }] }`
// instead of a plain string — flatten those into one readable line.
function extractErrorMessage(err: any): string {
  const detail = err?.response?.data?.detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => d.msg).filter(Boolean).join("; ") || "Gagal membandingkan";
  }
  if (typeof detail === "string") return detail;
  return err?.message ?? "Gagal membandingkan";
}

interface Props {
  platform: string;
  baseKeyword: string;
}

const COLOR_A = "#6366f1";
const COLOR_B = "#f43f5e";

function CompareTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs dark:border-slate-700 dark:bg-slate-900">
      <p className="mb-1 font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
          <span className="font-semibold" style={{ color: p.fill }}>{p.value?.toLocaleString("id-ID")}</span>
        </div>
      ))}
    </div>
  );
}

export default function ComparePanel({ platform, baseKeyword }: Props) {
  const [compareKeyword, setCompareKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dataA, setDataA] = useState<DashboardData | null>(null);
  const [dataB, setDataB] = useState<DashboardData | null>(null);

  const startDate = useFilterStore((s) => s.startDate);
  const endDate = useFilterStore((s) => s.endDate);

  async function runCompare() {
    if (!baseKeyword || !compareKeyword) return;
    setLoading(true);
    setError("");
    try {
      const { searchResultLimit } = getSettings();
      const usingDateSearch = !!(startDate && endDate);

      async function fetchOne(keyword: string) {
        if (usingDateSearch) {
          const res = await dateSearch({ keyword, platform, dateFrom: startDate, dateTo: endDate, limit: searchResultLimit, includeSentiment: true });
          return transformDateSearch(res, platform, keyword);
        }
        const res = await smartSearch({ keyword, platform, limitVideos: searchResultLimit, limitComments: searchResultLimit });
        return transformDashboard(platform, res, keyword);
      }

      const [resultA, resultB] = await Promise.all([fetchOne(baseKeyword), fetchOne(compareKeyword)]);
      setDataA(resultA);
      setDataB(resultB);
    } catch (e: any) {
      const message = extractErrorMessage(e);
      setError(message);
      toast.error("Gagal membandingkan", { description: message });
    } finally {
      setLoading(false);
    }
  }

  const sentimentData = dataA && dataB ? [
    { label: "Positif",  a: dataA.sentiment.positive,  b: dataB.sentiment.positive  },
    { label: "Netral",   a: dataA.sentiment.neutral,   b: dataB.sentiment.neutral   },
    { label: "Negatif",  a: dataA.sentiment.negative,  b: dataB.sentiment.negative  },
  ] : [];

  const statsData = dataA && dataB ? [
    { label: "Post", a: dataA.summary.totalPosts,    b: dataB.summary.totalPosts    },
    { label: "Komentar", a: dataA.summary.totalComments, b: dataB.summary.totalComments },
    { label: "Reach (K)", a: Math.round(dataA.summary.reach / 1000), b: Math.round(dataB.summary.reach / 1000) },
  ] : [];

  const radarData = dataA && dataB ? [
    { metric: "Post",     A: dataA.summary.totalPosts,    B: dataB.summary.totalPosts    },
    { metric: "Komentar", A: dataA.summary.totalComments, B: dataB.summary.totalComments },
    { metric: "Positif",  A: dataA.sentiment.positive,    B: dataB.sentiment.positive    },
    { metric: "Negatif",  A: dataA.sentiment.negative,    B: dataB.sentiment.negative    },
    { metric: "Reach",    A: Math.round(dataA.summary.reach / 1000), B: Math.round(dataB.summary.reach / 1000) },
  ] : [];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-700 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-5 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
          <GitCompareArrows size={17} className="text-violet-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Perbandingan Keyword</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Bandingkan dua keyword secara berdampingan</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Input */}
        <div className="flex items-center gap-3">
          {/* Keyword A (base) */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-bold text-white">A</span>
            <input
              value={baseKeyword}
              readOnly
              className="h-10 w-full rounded-xl border border-indigo-200 bg-indigo-50 pl-10 pr-3 text-sm font-medium text-indigo-800 dark:bg-indigo-950/40"
            />
          </div>

          <span className="text-slate-300 font-light text-lg">vs</span>

          {/* Keyword B */}
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              placeholder="Keyword pembanding..."
              value={compareKeyword}
              onChange={(e) => setCompareKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runCompare()}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
            />
          </div>

          <button
            onClick={runCompare}
            disabled={loading || !compareKeyword}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <GitCompareArrows size={14} />}
            Bandingkan
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 rounded-xl bg-red-50 px-4 py-3 dark:bg-red-950/40">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-indigo-400 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Membandingkan data...</p>
          </div>
        )}

        {/* Results */}
        {!loading && dataA && dataB && (
          <div className="space-y-6">
            {/* Legend labels */}
            <div className="flex items-center gap-6 justify-center">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-indigo-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">A: {dataA.keyword}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">B: {dataB.keyword}</span>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Total Post",    a: dataA.summary.totalPosts,    b: dataB.summary.totalPosts },
                { label: "Komentar",      a: dataA.summary.totalComments, b: dataB.summary.totalComments },
                { label: "Sentimen +",    a: dataA.sentiment.positive,    b: dataB.sentiment.positive },
                { label: "Sentimen -",    a: dataA.sentiment.negative,    b: dataB.sentiment.negative },
              ].map(({ label, a, b }) => (
                <div key={label} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                  <div className="mt-2 flex items-end gap-3">
                    <div>
                      <span className="text-[10px] text-indigo-500 font-semibold">A</span>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{a?.toLocaleString("id-ID")}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-rose-500 font-semibold">B</span>
                      <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{b?.toLocaleString("id-ID")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts side by side */}
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Sentiment bar */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Distribusi Sentimen</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sentimentData} barGap={4} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CompareTooltip />} />
                    <Bar dataKey="a" name={dataA.keyword} fill={COLOR_A} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="b" name={dataB.keyword} fill={COLOR_B} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Radar */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Perbandingan Keseluruhan</p>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                    <Radar name={dataA.keyword} dataKey="A" stroke={COLOR_A} fill={COLOR_A} fillOpacity={0.2} />
                    <Radar name={dataB.keyword} dataKey="B" stroke={COLOR_B} fill={COLOR_B} fillOpacity={0.2} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
