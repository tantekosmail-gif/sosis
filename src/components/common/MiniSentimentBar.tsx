"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const SENTIMENT_BAR_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const SENTIMENT_DOT_COLOR: Record<string, string> = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_TEXT_COLOR: Record<string, string> = {
  positif: "text-emerald-600 dark:text-emerald-400",
  netral: "text-amber-600 dark:text-amber-400",
  negatif: "text-red-600 dark:text-red-400",
};

// Mini bar komposisi sentimen (dipakai di tabel "Per Akun" tiap ringkasan
// platform). Label di samping bar menampilkan ketiga persentase
// (positif/netral/negatif) berwarna sesuai segmen bar-nya, supaya artinya
// jelas tanpa perlu hover; tooltip menambahkan jumlah komentar per kelas.
export default function MiniSentimentBar({ positif, negatif, netral }: { positif: number; negatif: number; netral: number }) {
  const total = positif + negatif + netral;
  if (total === 0) {
    return <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800" />;
  }
  const pct = (n: number) => Math.round((n / total) * 100);
  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    count: key === "positif" ? positif : key === "netral" ? netral : negatif,
  }));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-2 cursor-default">
          <div className="flex h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={SENTIMENT_BAR_COLOR.positif} style={{ width: `${(positif / total) * 100}%` }} />
            <div className={SENTIMENT_BAR_COLOR.netral} style={{ width: `${(netral / total) * 100}%` }} />
            <div className={SENTIMENT_BAR_COLOR.negatif} style={{ width: `${(negatif / total) * 100}%` }} />
          </div>
          <span className="whitespace-nowrap text-[10px] font-semibold">
            {entries.map((entry, i) => (
              <span key={entry.key}>
                {i > 0 && <span className="text-slate-300 dark:text-slate-600">/</span>}
                <span className={SENTIMENT_TEXT_COLOR[entry.key]}>{pct(entry.count)}%</span>
              </span>
            ))}
          </span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="mb-1.5 font-semibold text-slate-700 dark:text-slate-300">{total.toLocaleString("id-ID")} komentar dianalisis</p>
        <div className="space-y-1">
          {entries.map((entry) => (
            <div key={entry.key} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${SENTIMENT_DOT_COLOR[entry.key]}`} />
                {SENTIMENT_LABEL[entry.key]}
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {pct(entry.count)}% ({entry.count.toLocaleString("id-ID")})
              </span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
