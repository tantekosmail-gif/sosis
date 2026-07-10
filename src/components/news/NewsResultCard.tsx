"use client";

import { ExternalLink } from "lucide-react";

import type { NewsArticleBase } from "@/features/news/types/article.types";
import type { NewsSentimentScore } from "@/features/news/types/trending.types";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", dot: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", dot: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", dot: "bg-red-500" },
};

function getSourceName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function excerpt(content: string, maxLength = 220) {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}...`;
}

interface Props {
  item: NewsArticleBase;
  sentiment?: NewsSentimentScore | null;
}

export default function NewsResultCard({ item, sentiment }: Props) {
  const date = formatDate(item.published_at) ?? formatDate(item.collected_at);
  const sentimentColor = sentiment ? SENTIMENT_COLOR[sentiment.label] : null;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    >
      {item.image_url && (
        <img
          src={item.image_url}
          alt=""
          className="h-24 w-24 shrink-0 rounded-xl object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs font-medium text-indigo-600">
          <span>{getSourceName(item.url)}</span>
          {date && <span className="text-slate-300">•</span>}
          {date && <span className="text-slate-400 dark:text-slate-500">{date}</span>}
          {sentiment && sentimentColor && (
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${sentimentColor.bg} ${sentimentColor.text}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${sentimentColor.dot}`} />
              {SENTIMENT_LABEL[sentiment.label] ?? sentiment.label}
            </span>
          )}
        </div>

        <h3 className="mt-1 line-clamp-2 font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600">
          {item.title}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
          {excerpt(item.content)}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          {item.author && <span>{item.author}</span>}
          <span className="flex items-center gap-1 text-slate-300 group-hover:text-indigo-500">
            <ExternalLink size={12} />
            Buka artikel
          </span>
        </div>
      </div>
    </a>
  );
}
