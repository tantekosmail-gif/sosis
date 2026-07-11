"use client";

import { Loader2, Minus, TrendingDown, TrendingUp } from "lucide-react";

import { useTopicGrowth } from "../hooks/useTopicGrowth";

export default function TopicGrowthSection() {
  const { items, loading } = useTopicGrowth();

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Growth belum tentu tersedia (nama field-nya belum terverifikasi terhadap
  // backend nyata) — tetap tampilkan ranking berdasarkan mentions supaya widget
  // tidak menghilang begitu saja kalau cuma field growth-nya yang tidak ketemu.
  const sorted = [...items].sort((a, b) => {
    if (a.growthPct !== null && b.growthPct !== null) return b.growthPct - a.growthPct;
    if (a.growthPct !== null) return -1;
    if (b.growthPct !== null) return 1;
    return b.mentions - a.mentions;
  });

  const anyGrowthAvailable = items.some((i) => i.growthPct !== null);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center gap-2">
        <TrendingUp size={16} className="text-indigo-600" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Topik Naik/Turun</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
        Perubahan jumlah mention dibanding periode sebelumnya — menangkap momentum, bukan cuma volume mentah.
      </p>

      {sorted.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          Belum ada data metrik topik untuk ditampilkan.
        </p>
      ) : (
        <>
          {!anyGrowthAvailable && (
            <p className="mb-3 text-[11px] text-amber-600 dark:text-amber-400">
              Data growth belum tersedia dari server — diurutkan berdasarkan jumlah mention saja.
            </p>
          )}
          <div className="space-y-2">
            {sorted.slice(0, 8).map((item) => {
              const growth = item.growthPct;
              const isFlat = growth === 0;
              const isUp = (growth ?? 0) > 0;
              const Icon = growth === null ? Minus : isFlat ? Minus : isUp ? TrendingUp : TrendingDown;
              const color =
                growth === null || isFlat
                  ? "text-slate-400 dark:text-slate-500"
                  : isUp
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400";

              return (
                <div
                  key={item.topicId}
                  className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5"
                >
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.topicName}</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${color}`}>
                    <Icon size={14} />
                    {growth === null ? `${item.mentions.toLocaleString("id-ID")} mention` : `${isUp ? "+" : ""}${growth.toFixed(1)}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
