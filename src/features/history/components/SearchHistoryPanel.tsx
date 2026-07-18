"use client";

import { Clock, Trash2, X, RotateCcw } from "lucide-react";
import { HistoryItem } from "../hooks/useSearchHistory";

const PLATFORM_STYLE: Record<string, { dot: string; label: string }> = {
  youtube:   { dot: "bg-red-500",   label: "YouTube"   },
  tiktok:    { dot: "bg-slate-900", label: "TikTok"    },
  instagram: { dot: "bg-pink-500",  label: "Instagram" },
  facebook:  { dot: "bg-blue-600",  label: "Facebook"  },
};

const SENTIMENT_BAR = (pos: number, neu: number, neg: number) => {
  const total = pos + neu + neg || 1;
  return { pos: (pos / total) * 100, neu: (neu / total) * 100, neg: (neg / total) * 100 };
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Baru saja";
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

interface Props {
  history: HistoryItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onReload: (item: HistoryItem) => void;
  open: boolean;
  onClose: () => void;
}

export default function SearchHistoryPanel({ history, onRemove, onClear, onReload, open, onClose }: Props) {
  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-30 bg-slate-900/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40">
              <Clock size={15} className="text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Riwayat Pencarian</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">{history.length} analisis tersimpan</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <button
                onClick={onClear}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors dark:hover:bg-red-950/40"
              >
                <Trash2 size={12} />
                Hapus semua
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Clock size={22} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600 dark:text-slate-400">Belum ada riwayat</p>
              <p className="mt-1.5 text-sm text-slate-400 dark:text-slate-500">Riwayat analisis akan muncul di sini setelah kamu melakukan analisis pertama.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100 p-3 space-y-1 dark:divide-slate-800">
              {history.map((item) => {
                const ps = PLATFORM_STYLE[item.platform] ?? { dot: "bg-slate-400", label: item.platform };
                const { pos, neu, neg } = SENTIMENT_BAR(
                  item.stats.sentiment.positive,
                  item.stats.sentiment.neutral,
                  item.stats.sentiment.negative
                );
                return (
                  <li
                    key={item.id}
                    className="group rounded-xl p-3.5 hover:bg-slate-50 transition-colors dark:hover:bg-slate-800"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 shrink-0 rounded-full ${ps.dot}`} />
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{ps.label}</span>
                        </div>
                        <p className="mt-1 truncate font-semibold text-slate-900 dark:text-slate-100">
                          {item.keyword}
                        </p>
                        <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{relativeTime(item.analyzedAt)}</p>

                        {/* Mini sentiment bar — disembunyikan kalau belum ada
                            komentar dianalisis; bar penuh abu-abu dengan angka
                            serba nol cuma membingungkan. */}
                        {item.stats.sentiment.positive + item.stats.sentiment.neutral + item.stats.sentiment.negative > 0 ? (
                          <>
                            <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full">
                              <div className="bg-emerald-400 transition-all" style={{ width: `${pos}%` }} />
                              <div className="bg-slate-300 transition-all" style={{ width: `${neu}%` }} />
                              <div className="bg-red-400 transition-all" style={{ width: `${neg}%` }} />
                            </div>
                            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                              <span className="text-emerald-600">Positif {item.stats.sentiment.positive} ({Math.round(pos)}%)</span>
                              <span>Netral {item.stats.sentiment.neutral} ({Math.round(neu)}%)</span>
                              <span className="text-red-500">Negatif {item.stats.sentiment.negative} ({Math.round(neg)}%)</span>
                            </div>
                          </>
                        ) : (
                          <p className="mt-2 text-[10px] italic text-slate-400 dark:text-slate-500">Belum ada komentar dianalisis</p>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { onReload(item); onClose(); }}
                          title="Jalankan ulang analisis"
                          className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 transition-colors dark:hover:bg-indigo-950/40"
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          onClick={() => onRemove(item.id)}
                          title="Hapus dari riwayat"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors dark:hover:bg-red-950/40"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
