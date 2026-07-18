"use client";

import type { LucideIcon } from "lucide-react";
import { Eye, MessageSquare, PieChart, Video } from "lucide-react";

import type { ViralSentimentOverview } from "@/features/youtube/types/viral.types";
import type { AggregatedViralStats } from "@/features/youtube/lib/aggregateViralStats";
import { INFO_HINT, useInfoSource, type InfoSourceRequest, type SentimentKind } from "@/components/common/InfoSource";

const VIRAL_SOURCE =
  "Video YouTube dengan jumlah tayangan tertinggi yang terpantau sistem beserta komentar-komentar publiknya, sesuai filter yang sedang aktif di halaman ini.";

const SENTIMENT_KIND: Record<string, SentimentKind> = {
  positif: "positive",
  netral: "neutral",
  negatif: "negative",
};

const SENTIMENT_MEANING: Record<string, string> = {
  positif: "Komentar yang mendukung, memuji, atau menyambut baik video-video tersebut.",
  netral: "Komentar yang sekadar bertanya, menginformasikan, atau tidak menunjukkan keberpihakan.",
  negatif: "Komentar yang mengkritik, menolak, atau menunjukkan kekecewaan terhadap video-video tersebut.",
};

function formatCompact(n: number) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return Math.round(n).toLocaleString("id-ID");
}

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

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  info,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  info: InfoSourceRequest;
}) {
  const { explain } = useInfoSource();
  return (
    <button
      type="button"
      onClick={() => explain(info)}
      title={INFO_HINT}
      className="block w-full cursor-pointer rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Icon size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">{sub}</p>}
    </button>
  );
}

export default function ViralOverview({
  stats,
  sentiment,
}: {
  stats: AggregatedViralStats;
  sentiment: ViralSentimentOverview;
}) {
  const { explain } = useInfoSource();
  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    ...sentiment[key],
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon={Video}
          label="Total Video"
          value={stats.total_videos.toLocaleString("id-ID")}
          info={{
            title: "Total Video",
            value: stats.total_videos.toLocaleString("id-ID"),
            meaning: "Jumlah video viral yang sedang ditampilkan setelah filter (pencarian, channel, keyword, umur, periode) diterapkan.",
            source: VIRAL_SOURCE,
          }}
        />
        <StatCard
          icon={MessageSquare}
          label="Total Komentar"
          value={stats.total_comments.toLocaleString("id-ID")}
          info={{
            title: "Total Komentar",
            value: stats.total_comments.toLocaleString("id-ID"),
            meaning: "Jumlah seluruh komentar publik pada video-video yang sedang ditampilkan.",
            source: VIRAL_SOURCE,
          }}
        />
        <StatCard
          icon={Eye}
          label="Rata-rata View"
          value={formatCompact(stats.avg_views)}
          info={{
            title: "Rata-rata View",
            value: formatCompact(stats.avg_views),
            meaning: "Rata-rata jumlah tayangan per video dari video-video yang sedang ditampilkan — gambaran seberapa besar daya jangkau tipikal satu video.",
            source: VIRAL_SOURCE,
          }}
        />
        <StatCard
          icon={PieChart}
          label="Coverage"
          value={`${stats.coverage_pct.toFixed(1)}%`}
          sub={`${stats.total_analyzed.toLocaleString("id-ID")}/${stats.total_comments.toLocaleString("id-ID")} komentar`}
          info={{
            title: "Coverage",
            value: `${stats.coverage_pct.toFixed(1)}%`,
            meaning: `Porsi komentar yang sudah dianalisis sentimennya (${stats.total_analyzed.toLocaleString("id-ID")} dari ${stats.total_comments.toLocaleString("id-ID")} komentar). Semakin tinggi, semakin bisa dipercaya angka sentimen di bawah.`,
            source: VIRAL_SOURCE,
          }}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sentimen Komentar</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{sentiment.total_analyzed} komentar dianalisis</span>
        </div>

        {sentiment.total_analyzed > 0 ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {entries.map((e) => (
                <div key={e.key} className={SENTIMENT_COLOR[e.key].bar} style={{ width: `${e.percentage}%` }} />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {entries.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  onClick={() =>
                    explain({
                      title: `Sentimen Komentar — ${SENTIMENT_LABEL[e.key]}`,
                      value: `${e.percentage.toFixed(1)}% (${e.count.toLocaleString("id-ID")} komentar)`,
                      sentiment: SENTIMENT_KIND[e.key],
                      meaning: SENTIMENT_MEANING[e.key],
                      source: VIRAL_SOURCE,
                      note: sentiment.dominant === e.key ? "Ini sentimen yang paling dominan saat ini." : undefined,
                    })
                  }
                  title={INFO_HINT}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[e.key].bg} ${SENTIMENT_COLOR[e.key].text} ${
                    sentiment.dominant === e.key ? "border-current" : "border-transparent"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[e.key].bar}`} />
                  {SENTIMENT_LABEL[e.key]} {e.percentage.toFixed(1)}% ({e.count})
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada komentar yang dianalisis</p>
        )}
      </div>
    </div>
  );
}
