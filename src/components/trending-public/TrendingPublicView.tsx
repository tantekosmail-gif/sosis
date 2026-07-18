"use client";

import { useState } from "react";
import { AlertTriangle, Eye, Flame, Loader2, RefreshCw, ThumbsUp, TrendingUp } from "lucide-react";

import { useTrendingPublic } from "@/features/trending-public/useTrendingPublic";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import FallbackImage from "@/components/common/FallbackImage";

const RANK_STYLE: Record<number, string> = {
  1: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-sm shadow-amber-500/40",
  2: "bg-gradient-to-br from-slate-300 to-slate-500 text-white",
  3: "bg-gradient-to-br from-orange-300 to-orange-500 text-white",
};

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toLocaleString("id-ID");
}

function formatDayLabel(dateStr: string, isToday: boolean) {
  if (isToday) return "Hari ini";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });
}

export default function TrendingPublicView({ geo }: { geo: string }) {
  const { data, loading, error, refetch } = useTrendingPublic(geo);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const latestDate = data && data.days.length > 0 ? data.days[data.days.length - 1].date : null;
  const effectiveDate = selectedDate ?? latestDate;
  const selectedDay = data?.days.find((d) => d.date === effectiveDate) ?? data?.days[data.days.length - 1];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-sm shadow-red-500/30">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">Trending YouTube</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              🌐 {geo}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
            <button
              type="button"
              onClick={refetch}
              disabled={loading}
              title="Muat ulang"
              aria-label="Muat ulang"
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-6">
        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
            <AlertTriangle size={16} className="mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading && !data ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={26} className="animate-spin text-indigo-500" />
          </div>
        ) : data ? (
          <>
            {data.days.length > 0 && (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                {data.days.map((day, i) => {
                  const isToday = i === data.days.length - 1;
                  const active = day.date === selectedDay?.date;
                  return (
                    <button
                      key={day.date}
                      type="button"
                      onClick={() => setSelectedDate(day.date)}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition ${
                        active
                          ? "bg-indigo-600 text-white shadow shadow-indigo-500/20"
                          : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700 dark:hover:bg-slate-800"
                      }`}
                    >
                      {formatDayLabel(day.date, isToday)}
                    </button>
                  );
                })}
              </div>
            )}

            {!selectedDay || selectedDay.topics.length === 0 ? (
              <p className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">
                Belum ada topik trending untuk tanggal ini.
              </p>
            ) : (
              <div className="space-y-4">
                {selectedDay.topics.map((topic) => (
                  <div
                    key={topic.rank}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
                  >
                    <div className="flex items-start gap-3 p-4 sm:p-5">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          RANK_STYLE[topic.rank] ?? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                        }`}
                      >
                        {topic.rank}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 sm:text-base">
                            {decodeHtmlEntities(topic.title)}
                          </h2>
                          {topic.traffic && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
                              <Flame size={11} />
                              {topic.traffic}
                            </span>
                          )}
                        </div>
                        {topic.description && (
                          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                            {decodeHtmlEntities(topic.description)}
                          </p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-600">
                          {topic.video_count} video &middot; diperbarui {formatRelativeTime(topic.fetched_at)}
                        </p>
                      </div>
                    </div>

                    {topic.top_videos.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto border-t border-slate-100 px-4 py-3 dark:border-slate-800 sm:px-5">
                        {topic.top_videos.map((video) => (
                          <a
                            key={video.url}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group w-40 shrink-0"
                          >
                            <FallbackImage
                              src={video.thumbnail}
                              className="aspect-video overflow-hidden rounded-xl"
                              imgClassName="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-snug text-slate-700 dark:text-slate-300">
                              {decodeHtmlEntities(video.title)}
                            </p>
                            <p className="mt-0.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
                              {decodeHtmlEntities(video.channel)}
                            </p>
                            {(video.views > 0 || video.likes > 0) && (
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                                {video.views > 0 && (
                                  <span className="flex items-center gap-0.5">
                                    <Eye size={10} /> {formatCompact(video.views)}
                                  </span>
                                )}
                                {video.likes > 0 && (
                                  <span className="flex items-center gap-0.5">
                                    <ThumbsUp size={10} /> {formatCompact(video.likes)}
                                  </span>
                                )}
                              </div>
                            )}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : null}
      </main>

      <footer className="mx-auto max-w-5xl px-5 py-8 text-center text-[11px] text-slate-400 dark:text-slate-600">
        Data publik &amp; diperbarui otomatis (cache di server 10 menit) &middot; halaman ini tidak memerlukan login.
      </footer>
    </div>
  );
}
