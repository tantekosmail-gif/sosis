"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, GitCompareArrows, Loader2, Search } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

import { useSocialCompare } from "../hooks/useSocialCompare";
import type { ComparablePlatform } from "../types/socialCompare.types";

const PLATFORM_META: Record<ComparablePlatform, { label: string; color: string }> = {
  facebook: { label: "Facebook", color: "#1877F2" },
  instagram: { label: "Instagram", color: "#E1306C" },
  twitter: { label: "Twitter/X", color: "#1DA1F2" },
  tiktok: { label: "TikTok", color: "#FE2C55" },
};

const PLATFORM_ORDER: ComparablePlatform[] = ["facebook", "instagram", "twitter", "tiktok"];

// totals (opsional): total pembanding per dataKey (per platform) — kalau
// diisi, tiap baris juga menampilkan persentase nilai terhadap total tersebut.
function CompareTooltip({ active, payload, label, totals }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 shadow-lg text-xs">
      <p className="mb-1 font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      {payload.map((p: any) => {
        const total = totals?.[p.dataKey];
        const pct = total > 0 ? Math.round(((Number(p.value) || 0) / total) * 100) : null;
        return (
          <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
            <span className="text-slate-500 dark:text-slate-400">{p.name}:</span>
            <span className="font-semibold" style={{ color: p.fill }}>{p.value?.toLocaleString("id-ID")}</span>
            {pct !== null && <span className="text-slate-400 dark:text-slate-500">({pct}%)</span>}
          </div>
        );
      })}
    </div>
  );
}

function pctOf(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

export default function SocialComparePanel() {
  const [keywordInput, setKeywordInput] = useState("");
  const { keyword, loading, error, results, platformErrors, compare } = useSocialCompare();

  const activePlatforms = useMemo(
    () => PLATFORM_ORDER.filter((platform) => results[platform]),
    [results]
  );
  const hasMultiple = activePlatforms.length >= 2;

  function runCompare(e?: React.FormEvent) {
    e?.preventDefault();
    if (!keywordInput.trim()) return;
    compare(keywordInput);
  }

  const statsData = hasMultiple
    ? [
        { label: "Post", ...Object.fromEntries(activePlatforms.map((p) => [p, results[p]!.totalPosts])) },
        { label: "Komentar", ...Object.fromEntries(activePlatforms.map((p) => [p, results[p]!.totalComments])) },
      ]
    : [];

  const sentimentData = hasMultiple
    ? (["positif", "netral", "negatif"] as const).map((s) => ({
        label: s === "positif" ? "Positif" : s === "netral" ? "Netral" : "Negatif",
        ...Object.fromEntries(activePlatforms.map((p) => [p, results[p]!.sentiment[s]])),
      }))
    : [];

  // Total komentar ber-sentimen per platform — pembagi persentase pada kartu
  // "Sentimen +/-" dan tooltip chart Distribusi Sentimen.
  const sentimentTotals = Object.fromEntries(
    activePlatforms.map((p) => {
      const s = results[p]!.sentiment;
      return [p, s.positif + s.netral + s.negatif];
    })
  ) as Record<ComparablePlatform, number>;

  const radarData = hasMultiple
    ? [
        { metric: "Post", ...Object.fromEntries(activePlatforms.map((p) => [PLATFORM_META[p].label, results[p]!.totalPosts])) },
        { metric: "Komentar", ...Object.fromEntries(activePlatforms.map((p) => [PLATFORM_META[p].label, results[p]!.totalComments])) },
        { metric: "Positif", ...Object.fromEntries(activePlatforms.map((p) => [PLATFORM_META[p].label, results[p]!.sentiment.positif])) },
        { metric: "Negatif", ...Object.fromEntries(activePlatforms.map((p) => [PLATFORM_META[p].label, results[p]!.sentiment.negatif])) },
      ]
    : [];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-950/40">
          <GitCompareArrows size={17} className="text-violet-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Bandingkan Platform</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Bandingkan topik/keyword yang sama antara Facebook, Instagram, Twitter/X &amp; TikTok</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <form onSubmit={runCompare} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              placeholder="Keyword atau hashtag, mis. pemilu2029"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 pl-9 pr-3 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !keywordInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <GitCompareArrows size={14} />}
            Bandingkan
          </button>
        </form>

        {error && (
          <p className="text-sm text-red-500 rounded-xl bg-red-50 dark:bg-red-950/40 px-4 py-3">{error}</p>
        )}

        {!loading && Object.keys(platformErrors).length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <ul className="space-y-0.5">
              {Object.entries(platformErrors).map(([platform, msg]) => (
                <li key={platform}>
                  <span className="font-semibold">{PLATFORM_META[platform as ComparablePlatform]?.label ?? platform}:</span> {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 size={28} className="animate-spin text-indigo-400 mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Membandingkan data antar platform...</p>
          </div>
        )}

        {!loading && hasMultiple && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6 justify-center">
              {activePlatforms.map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: PLATFORM_META[p].color }} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{PLATFORM_META[p].label}: {keyword}</span>
                </div>
              ))}
            </div>

            <div className={`grid grid-cols-2 gap-3 ${activePlatforms.length >= 3 ? "sm:grid-cols-2" : "sm:grid-cols-4"}`}>
              {[
                { label: "Total Post", key: "totalPosts" as const },
                { label: "Komentar", key: "totalComments" as const },
                { label: "Sentimen +", key: "sentiment.positif" as const },
                { label: "Sentimen -", key: "sentiment.negatif" as const },
              ].map(({ label, key }) => (
                <div key={label} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
                  <div className="mt-2 flex flex-wrap items-end gap-3">
                    {activePlatforms.map((p) => {
                      const result = results[p]!;
                      const isSentiment = key === "sentiment.positif" || key === "sentiment.negatif";
                      const value = key === "sentiment.positif"
                        ? result.sentiment.positif
                        : key === "sentiment.negatif"
                          ? result.sentiment.negatif
                          : result[key];
                      const pct = isSentiment ? pctOf(value, sentimentTotals[p]) : null;
                      return (
                        <div key={p}>
                          <span className="text-[10px] font-semibold" style={{ color: PLATFORM_META[p].color }}>
                            {PLATFORM_META[p].label.slice(0, 2).toUpperCase()}
                          </span>
                          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {value?.toLocaleString("id-ID")}
                            {pct !== null && <span className="ml-1 text-xs font-semibold text-slate-400 dark:text-slate-500">({pct}%)</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Volume</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={statsData} barGap={4} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CompareTooltip />} />
                    {activePlatforms.map((p) => (
                      <Bar key={p} dataKey={p} name={PLATFORM_META[p].label} fill={PLATFORM_META[p].color} radius={[6, 6, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Distribusi Sentimen</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={sentimentData} barGap={4} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CompareTooltip totals={sentimentTotals} />} />
                    {activePlatforms.map((p) => (
                      <Bar key={p} dataKey={p} name={PLATFORM_META[p].label} fill={PLATFORM_META[p].color} radius={[6, 6, 0, 0]} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Perbandingan Keseluruhan</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                  {activePlatforms.map((p) => (
                    <Radar
                      key={p}
                      name={PLATFORM_META[p].label}
                      dataKey={PLATFORM_META[p].label}
                      stroke={PLATFORM_META[p].color}
                      fill={PLATFORM_META[p].color}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {!loading && !hasMultiple && keyword && Object.keys(platformErrors).length === 0 && activePlatforms.length > 0 && (
          <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">
            Hanya satu platform berhasil dimuat — coba lagi untuk mendapat perbandingan penuh.
          </p>
        )}
      </div>
    </div>
  );
}
