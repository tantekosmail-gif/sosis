"use client";

import { PieChart } from "lucide-react";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", bar: "bg-red-500" },
};

interface Props {
  positif: number;
  netral: number;
  negatif: number;
  platformCount: number;
}

export default function OverallSentimentWidget({ positif, netral, negatif, platformCount }: Props) {
  const total = positif + netral + negatif;

  const percentage = (count: number) => (total === 0 ? 0 : (count / total) * 100);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <PieChart size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Sentimen Publik Gabungan</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Agregat sentimen dari {platformCount} platform yang dipantau</p>
        </div>
      </div>

      <div className="p-6">
        {total === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada data sentimen yang dianalisis</p>
        ) : (
          <>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sentimen Keseluruhan</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{total.toLocaleString("id-ID")} item dianalisis</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {(["positif", "netral", "negatif"] as const).map((key) => (
                <div
                  key={key}
                  className={SENTIMENT_COLOR[key].bar}
                  style={{ width: `${percentage(key === "positif" ? positif : key === "netral" ? netral : negatif)}%` }}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(
                [
                  ["positif", positif],
                  ["netral", netral],
                  ["negatif", negatif],
                ] as const
              ).map(([key, count]) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[key].bg} ${SENTIMENT_COLOR[key].text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[key].bar}`} />
                  {SENTIMENT_LABEL[key]} {percentage(count).toFixed(1)}% ({count.toLocaleString("id-ID")})
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
