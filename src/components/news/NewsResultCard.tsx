"use client";

import { ExternalLink } from "lucide-react";

import type { NewsArticleBase } from "@/features/news/types/article.types";
import type { NewsSentimentScore } from "@/features/news/types/trending.types";
import { getNewsSourceName, newsExcerpt } from "@/features/news/lib/format";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import FallbackImage from "@/components/common/FallbackImage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", dot: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", dot: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", dot: "bg-red-500" },
};

const RANK_STYLE: Record<number, string> = {
  1: "bg-amber-400 text-white",
  2: "bg-slate-400 text-white",
  3: "bg-orange-400 text-white",
};

function formatDate(value: string | null, language: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface Props {
  item: NewsArticleBase;
  sentiment?: NewsSentimentScore | string | null;
  /** Nomor urut trending (1-based) — dirender sebagai badge, top-3 dapat aksen emas/perak/perunggu. */
  rank?: number;
  /** "relative" cocok utk daftar yang semuanya dari hari yang sama (mis. tab
   *  Terkini) — tanggal absolut jadi identik di semua kartu dan tidak
   *  membedakan apa-apa. Default "absolute" utk konteks pencarian bebas tanggal. */
  dateMode?: "absolute" | "relative";
  /** "grid" — kartu vertikal (gambar di atas) utk grid multi-kolom, mis. hasil pencarian. */
  variant?: "list" | "grid";
}

export default function NewsResultCard({ item, sentiment, rank, dateMode = "absolute", variant = "list" }: Props) {
  const { t, language } = useTranslation();
  const SENTIMENT_LABEL: Record<string, string> = {
    positif: t.sentimentPie.positive,
    netral: t.sentimentPie.neutral,
    negatif: t.sentimentPie.negative,
  };
  const date =
    dateMode === "relative"
      ? formatRelativeTime(item.published_at ?? item.collected_at, language)
      : formatDate(item.published_at, language) ?? formatDate(item.collected_at, language);
  const sentimentLabel = typeof sentiment === "string" ? sentiment : sentiment?.label;
  const sentimentColor = sentimentLabel ? SENTIMENT_COLOR[sentimentLabel] : null;
  // Skor cuma ada kalau backend mengirim sentiment sebagai objek {label, score}
  // (mis. artikel trending) — utk endpoint yang cuma kirim label string (mis.
  // pencarian bebas tanggal), badge tetap tampil tanpa persentase.
  const sentimentScore = typeof sentiment === "object" && sentiment ? sentiment.score : null;

  const sentimentBadge = sentimentLabel && sentimentColor && (
    <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${sentimentColor.bg} ${sentimentColor.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${sentimentColor.dot}`} />
      {SENTIMENT_LABEL[sentimentLabel] ?? sentimentLabel}
      {sentimentScore !== null && ` ${Math.round(sentimentScore * 100)}%`}
    </span>
  );

  const rankBadge = rank !== undefined && (
    <span
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${RANK_STYLE[rank] ?? "bg-slate-800 text-white dark:bg-slate-700"}`}
    >
      {rank}
    </span>
  );

  if (variant === "grid") {
    return (
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
      >
        <div className="relative aspect-video w-full shrink-0 overflow-hidden">
          <FallbackImage
            src={item.image_url}
            className="h-full w-full"
            imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {rankBadge && <div className="absolute left-2 top-2">{rankBadge}</div>}
        </div>

        <div className="flex min-w-0 flex-1 flex-col p-4">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-indigo-600">
            <span className="truncate">{getNewsSourceName(item.url)}</span>
            {date && <span className="shrink-0 text-slate-400 dark:text-slate-500">• {date}</span>}
          </div>
          {sentimentBadge && <div className="mt-1.5">{sentimentBadge}</div>}

          <h3 className="mt-1.5 line-clamp-2 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
            {item.title}
          </h3>

          <p className="mt-1.5 line-clamp-3 flex-1 text-sm text-slate-500 dark:text-slate-400">
            {newsExcerpt(item.content, 140)}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500">
            {item.author ? <span className="truncate">{item.author}</span> : <span />}
            <span className="flex shrink-0 items-center gap-1 text-slate-300 group-hover:text-indigo-500">
              <ExternalLink size={12} />
              {t.newsResultCard.open}
            </span>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      {rankBadge}

      <FallbackImage src={item.image_url} className="h-24 w-24 shrink-0 rounded-xl" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
          <span>{getNewsSourceName(item.url)}</span>
          {date && <span className="text-slate-300">•</span>}
          {date && <span className="text-slate-400 dark:text-slate-500">{date}</span>}
          {sentimentBadge}
        </div>

        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
          {item.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {newsExcerpt(item.content)}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          {item.author && <span>{item.author}</span>}
          <span className="flex items-center gap-1 text-slate-300 group-hover:text-indigo-500">
            <ExternalLink size={12} />
            {t.newsResultCard.openArticle}
          </span>
        </div>
      </div>
    </a>
  );
}
