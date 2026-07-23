"use client";

import { FaTiktok, FaYoutube } from "react-icons/fa6";

import FallbackImage from "@/components/common/FallbackImage";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import type { CrossPlatformVideoDetail } from "@/features/crossPlatform/services/videoSearch.service";
import {
  Eye,
  ExternalLink,
  Flame,
  Loader2,
  MessageCircle,
  MousePointerClick,
  Share2,
  ShieldCheck,
  Star,
  Tag,
  ThumbsUp,
  Timer,
  Users,
  Zap,
} from "lucide-react";

function formatCompact(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function formatRelativeTime(dateStr?: string) {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.round(diffMs / 60_000);

  if (diffMinutes < 1) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;

  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} hari lalu`;
}

const SCORE_ITEMS: { key: keyof CrossPlatformVideoDetail["scores"]; icon: typeof Flame; labelKey: "trendScoreLabel" | "engagementScoreLabel" | "freshnessScoreLabel" | "authorityScoreLabel" }[] = [
  { key: "trend_score", icon: Flame, labelKey: "trendScoreLabel" },
  { key: "engagement_score", icon: Zap, labelKey: "engagementScoreLabel" },
  { key: "freshness_score", icon: Timer, labelKey: "freshnessScoreLabel" },
  { key: "authority_score", icon: ShieldCheck, labelKey: "authorityScoreLabel" },
];

const PLATFORM_META = {
  youtube: { Icon: FaYoutube, className: "text-red-500", label: "YouTube" },
  tiktok: { Icon: FaTiktok, className: "text-slate-900 dark:text-slate-100", label: "TikTok" },
} as const;

interface Props {
  detail: CrossPlatformVideoDetail | null;
  loading: boolean;
  error: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export default function VideoDetailPanel({ detail, loading, error, isFavorite, onToggleFavorite }: Props) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500 dark:text-slate-400">{t.videoDetailModal.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
        {error}
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <MousePointerClick size={22} className="text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-400 dark:text-slate-500">{t.videoDetailModal.emptySelection}</p>
      </div>
    );
  }

  const platformMeta = PLATFORM_META[detail.platform];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-xl sm:w-32">
          <FallbackImage src={detail.thumbnail} className="h-full w-full" imgClassName="h-full w-full object-cover" />
          <span className="absolute left-1.5 top-1.5 flex items-center gap-1 rounded-full bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            <platformMeta.Icon size={10} /> {platformMeta.label}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h2 className="line-clamp-3 text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {decodeHtmlEntities(detail.title)}
            </h2>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={onToggleFavorite}
                title={isFavorite ? t.videoDetailModal.removeFavorite : t.videoDetailModal.addFavorite}
                className={`shrink-0 rounded-lg p-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 ${
                  isFavorite ? "text-amber-400" : "text-slate-300 hover:text-amber-400 dark:text-slate-600"
                }`}
              >
                <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <a
              href={detail.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-xs text-slate-500 hover:text-indigo-600 dark:text-slate-400"
            >
              {decodeHtmlEntities(detail.author)} <ExternalLink size={11} />
            </a>
            {typeof detail.author_fans === "number" && detail.author_fans > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                <Users size={11} /> {formatCompact(detail.author_fans)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {SCORE_ITEMS.map(({ key, icon: Icon, labelKey }) => (
          <div
            key={key}
            className="flex flex-col items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 py-2.5 dark:border-slate-700 dark:bg-slate-800"
          >
            <Icon size={14} className="text-indigo-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{detail.scores[key].toFixed(1)}</span>
            <span className="text-center text-[10px] leading-tight text-slate-400 dark:text-slate-500">
              {t.videoDetailModal[labelKey]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <span className="flex items-center gap-1.5">
          <Eye size={14} className="text-slate-400 dark:text-slate-500" /> {formatCompact(detail.metrics.views)}
        </span>
        <span className="flex items-center gap-1.5">
          <ThumbsUp size={13} className="text-slate-400 dark:text-slate-500" /> {formatCompact(detail.metrics.likes)}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={13} className="text-slate-400 dark:text-slate-500" /> {formatCompact(detail.metrics.comments)}
        </span>
        {detail.metrics.shares > 0 && (
          <span className="flex items-center gap-1.5">
            <Share2 size={13} className="text-slate-400 dark:text-slate-500" /> {formatCompact(detail.metrics.shares)}
          </span>
        )}
        {formatRelativeTime(detail.published_at) && (
          <span className="font-normal text-slate-400 dark:text-slate-500">{formatRelativeTime(detail.published_at)}</span>
        )}
      </div>

      {detail.ai_summary && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3.5 dark:border-indigo-900 dark:bg-indigo-950/30">
          <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400">
            {t.videoDetailModal.aiSummaryLabel}
          </p>
          <p className="mt-1 text-sm leading-snug text-slate-700 dark:text-slate-300">{decodeHtmlEntities(detail.ai_summary)}</p>
        </div>
      )}

      {detail.ai_tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {detail.ai_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {(detail.source_topics?.length > 0 || detail.source_topic) && (
        <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
            <Tag size={12} /> {t.videoDetailModal.keywordLabel}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(detail.source_topics?.length ? detail.source_topics : [detail.source_topic]).map((kw) => (
              <span
                key={kw}
                className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {t.videoDetailModal.commentsLabel} ({detail.saved_comment_count})
        </p>
        {detail.comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white py-8 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
            {t.videoDetailModal.noComments}
          </div>
        ) : (
          <ul className="scrollbar-thin max-h-72 divide-y divide-slate-100 overflow-y-auto rounded-xl border border-slate-200 bg-white dark:divide-slate-800 dark:border-slate-700 dark:bg-slate-900">
            {detail.comments.map((comment, i) => (
              <li key={i} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{comment.author}</span>
                  <span className="flex shrink-0 items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <ThumbsUp size={10} /> {comment.likes}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-snug text-slate-600 dark:text-slate-400">
                  {decodeHtmlEntities(comment.content)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
