"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";

import type { NewsArticleBase } from "@/features/news/types/article.types";
import type { NewsSentimentScore } from "@/features/news/types/trending.types";
import { getNewsSourceName, newsExcerpt } from "@/features/news/lib/format";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import FallbackImage from "@/components/common/FallbackImage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

type NewsItem = NewsArticleBase & { sentiment?: NewsSentimentScore | string | null };

function getSentimentLabel(sentiment: NewsSentimentScore | string | null | undefined) {
  if (!sentiment) return null;
  return typeof sentiment === "string" ? sentiment : sentiment.label;
}

function getSentimentScore(sentiment: NewsSentimentScore | string | null | undefined) {
  return typeof sentiment === "object" && sentiment ? sentiment.score : 1;
}

function findMostNegativeArticle<T extends NewsItem>(items: T[]): T | null {
  let best: T | null = null;
  let bestScore = -Infinity;

  for (const item of items) {
    if (getSentimentLabel(item.sentiment) !== "negatif") continue;
    const score = getSentimentScore(item.sentiment);
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }

  return best;
}

export default function NegativeHighlightCard<T extends NewsItem>({ items }: { items: T[] }) {
  const { t, language } = useTranslation();
  const article = findMostNegativeArticle(items);
  if (!article) return null;

  const score = getSentimentScore(article.sentiment);
  const date = formatRelativeTime(article.published_at ?? article.collected_at, language);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4 shadow-sm transition hover:border-red-300"
    >
      <FallbackImage src={article.image_url} className="h-20 w-20 shrink-0 rounded-xl" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
            <AlertTriangle size={13} />
            {t.newsNegativeHighlight.title}
          </div>
          <span className="rounded-md bg-red-100 dark:bg-red-900/50 px-1.5 py-0.5 text-[10px] font-semibold text-red-700 dark:text-red-400">
            {t.newsNegativeHighlight.negativePercent.replace("{percent}", String(Math.round(score * 100)))}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{article.title}</p>

        <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
          {newsExcerpt(article.content, 160)}
        </p>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{getNewsSourceName(article.url)}</span>
          {date && <span className="text-slate-300 dark:text-slate-600">•</span>}
          {date && <span>{date}</span>}
          {article.author && <span className="text-slate-300 dark:text-slate-600">•</span>}
          {article.author && <span>{article.author}</span>}
          <span className="ml-auto flex shrink-0 items-center gap-1 text-red-700 dark:text-red-400">
            <ExternalLink size={11} />
            {t.newsNegativeHighlight.openArticle}
          </span>
        </div>
      </div>
    </a>
  );
}
