"use client";

import { AlertTriangle, ExternalLink } from "lucide-react";

import type { NewsArticleBase } from "@/features/news/types/article.types";
import type { NewsSentimentScore } from "@/features/news/types/trending.types";

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
  const article = findMostNegativeArticle(items);
  if (!article) return null;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-4 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/30 p-4 shadow-sm transition hover:border-red-300"
    >
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="h-20 w-20 shrink-0 rounded-xl object-cover"
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-400">
          <AlertTriangle size={13} />
          Artikel Paling Disorot Negatif
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-slate-800 dark:text-slate-200">{article.title}</p>

        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          {article.author && <span>{article.author}</span>}
          <span className="flex items-center gap-1 text-red-700 dark:text-red-400">
            <ExternalLink size={11} />
            Buka artikel
          </span>
        </div>
      </div>
    </a>
  );
}
