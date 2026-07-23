"use client";

import { useState } from "react";
import { Loader2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { useTrendRecommendations } from "@/features/keywordRecommendations/hooks/useTrendRecommendations";
import { apiErrorMessage } from "@/features/topic/lib/apiError";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { jetBrainsMono } from "@/lib/fonts/dashboardFonts";

function scoreBadgeVariant(score: number): "success" | "warning" | "secondary" {
  if (score >= 0.8) return "success";
  if (score >= 0.5) return "warning";
  return "secondary";
}

function formatSource(source: string): string {
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function KeywordRecommendationsSection() {
  const { t } = useTranslation();
  const [keywordInput, setKeywordInput] = useState("");
  const [scoreInput, setScoreInput] = useState("1");

  const { items, loading, error, refresh, submit, submitting } = useTrendRecommendations();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = keywordInput.trim();
    if (!trimmed) {
      toast.error(t.settings.keywordRecs.keywordRequired);
      return;
    }

    const parsedScore = scoreInput.trim() ? Number(scoreInput) : undefined;
    if (parsedScore !== undefined && (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 1)) {
      toast.error(t.settings.keywordRecs.scoreInvalid);
      return;
    }

    try {
      await submit(trimmed, parsedScore);
      toast.success(t.settings.keywordRecs.submitSuccess);
      setKeywordInput("");
      setScoreInput("1");
    } catch (err) {
      toast.error(apiErrorMessage(err, t.settings.keywordRecs.submitError));
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.keywordRecs.formTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.keywordRecs.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-6 py-5 sm:flex-row">
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder={t.settings.keywordRecs.keywordPlaceholder}
            maxLength={255}
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
          />
          <input
            value={scoreInput}
            onChange={(e) => setScoreInput(e.target.value)}
            placeholder={t.settings.keywordRecs.scoreLabel}
            type="number"
            min={0}
            max={1}
            step={0.05}
            title={t.settings.keywordRecs.scoreLabel}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition sm:w-28"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {t.settings.keywordRecs.submitButton}
          </button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.keywordRecs.listTitle}</h3>
            <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.keywordRecs.listDesc}</p>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            {t.settings.keywordRecs.refreshButton}
          </button>
        </div>

        <div className="px-6">
          {error ? (
            <p className="py-6 text-sm text-red-600">{error}</p>
          ) : loading ? (
            <div className="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : !items || items.length === 0 ? (
            <p className="py-6 text-sm text-slate-400 dark:text-slate-500">{t.settings.keywordRecs.empty}</p>
          ) : (
            items.map((item, i) => (
              <div
                key={`${item.topic}-${i}`}
                className="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{item.topic}</p>
                  <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                    {formatSource(item.source)} &middot; {item.recommendation_date}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant={item.status === "used" ? "secondary" : "warning"}>
                    {item.status === "used" ? t.settings.keywordRecs.statusUsed : t.settings.keywordRecs.statusPending}
                  </Badge>
                  <Badge variant={scoreBadgeVariant(item.score)} className={jetBrainsMono.className}>
                    {item.score.toFixed(2)}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
