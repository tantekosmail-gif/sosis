"use client";

import { PieChart } from "lucide-react";

import type { ShareOfVoiceItem } from "@/lib/shareOfVoice";
import { hankenGrotesk, jetBrainsMono } from "@/lib/fonts/dashboardFonts";

export type { ShareOfVoiceItem };

const BAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-400",
  "bg-sky-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-teal-500",
];

export default function ShareOfVoiceCard({
  items,
  title = "Share of Voice antar Keyword",
  description = "Porsi mention tiap keyword dibandingkan total mention dalam topik ini, lintas semua platform.",
}: {
  items: ShareOfVoiceItem[];
  title?: string;
  description?: string;
}) {
  if (items.length === 0) return null;

  const totalMentions = items.reduce((sum, item) => sum + item.mentions, 0);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-4 flex items-center gap-2">
        <PieChart size={16} className="text-indigo-600" />
        <h2 className={`${hankenGrotesk.className} font-bold text-slate-900 dark:text-slate-100`}>{title}</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{description}</p>

      {totalMentions === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          Belum ada mention yang tercatat untuk keyword-keyword ini.
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div key={item.keywordId || item.keyword}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.keyword}</span>
                <span className={`${jetBrainsMono.className} text-xs text-slate-400 dark:text-slate-500`}>
                  {item.percentage.toFixed(1)}% · {item.mentions.toLocaleString("id-ID")} mention
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                  style={{ width: `${Math.max(item.percentage, 1)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
