"use client";

import { AlertCircle, AtSign, Hash, Loader2, Music2, RefreshCw, X } from "lucide-react";

import type { TrendRecommendationItem } from "@/features/trends/types/recommendations.types";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-200",
  approved: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200",
  posted: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 dark:bg-red-950/40 text-red-700 border-red-200",
};

const PLATFORM_ICON: Record<string, React.ElementType> = {
  instagram: AtSign,
  twitter: Hash,
  tiktok: Music2,
};

function scoreStyle(score: number) {
  if (score >= 0.8) return "bg-emerald-500";
  if (score >= 0.6) return "bg-indigo-500";
  return "bg-slate-400";
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return "";
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMin = Math.round(diffMs / 60_000);
  if (diffMin < 1) return "baru saja";
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam lalu`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay} hari lalu`;
}

function PlatformPill({ platform, username }: { platform: string; username: string }) {
  const Icon = PLATFORM_ICON[platform.toLowerCase()] ?? AtSign;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-slate-400">
      <Icon size={11} className="text-slate-400 dark:text-slate-500" />
      {username}
    </span>
  );
}

export function TrendRecommendationsList({
  data,
  loading,
  error,
  limit,
  onLimitChange,
  recommendationDate,
  onRecommendationDateChange,
  onRefresh,
}: {
  data: TrendRecommendationItem[];
  loading: boolean;
  error: string;
  limit: number;
  onLimitChange: (limit: number) => void;
  recommendationDate: string;
  onRecommendationDateChange: (date: string) => void;
  onRefresh: () => void;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Trend Recommendations</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Topik yang sudah disubmit ke backend</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="date"
              value={recommendationDate}
              onChange={(e) => onRecommendationDateChange(e.target.value)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 py-1.5 pl-2 pr-6 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
            {recommendationDate && (
              <button
                type="button"
                onClick={() => onRecommendationDateChange("")}
                title="Tampilkan semua tanggal"
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-400"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2 py-1.5 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            {[10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && data.length === 0 && (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-slate-300">
            <Loader2 size={20} className="animate-spin" />
            <p className="text-xs">Memuat data...</p>
          </div>
        )}

        {!loading && error && (
          <div className="flex items-start gap-2 m-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-3.5 py-2.5 text-sm text-red-700">
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-1 text-center text-slate-300">
            <p className="text-xs">
              {recommendationDate
                ? `Tidak ada rekomendasi untuk ${formatDate(recommendationDate)}`
                : "Belum ada rekomendasi topik trending"}
            </p>
          </div>
        )}

        {data.length > 0 && (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.map((item, idx) => {
              const statusCfg = STATUS_STYLE[item.status?.toLowerCase()] ?? "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700";

              return (
                <li key={item.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 text-xs font-semibold text-slate-300">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <p className="text-sm font-medium leading-snug text-slate-800 dark:text-slate-200">{item.topic}</p>
                    </div>
                    <span className={`shrink-0 rounded-md border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusCfg}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center gap-2 pl-[26px]">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                      <div
                        className={`h-full ${scoreStyle(item.score)}`}
                        style={{ width: `${Math.round(item.score * 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {(item.score * 100).toFixed(0)}%
                    </span>
                  </div>

                  {item.related_accounts?.length > 0 && (
                    <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-[26px]">
                      {item.related_accounts.map((acc, i) => (
                        <PlatformPill key={`${acc.platform}-${acc.username}-${i}`} platform={acc.platform} username={acc.username} />
                      ))}
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-3 pl-[26px] text-[11px] text-slate-400 dark:text-slate-500">
                    <span>{formatDate(item.recommendation_date)}</span>
                    <span>&middot;</span>
                    <span>{item.source}</span>
                    <span>&middot;</span>
                    <span>{formatRelativeTime(item.created_at)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
