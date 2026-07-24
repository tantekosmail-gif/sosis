"use client";

import { useState, type KeyboardEvent } from "react";
import { Loader2, Plus, RefreshCw, Tag, X } from "lucide-react";
import { toast } from "sonner";

import { useTrendRecommendations } from "@/features/keywordRecommendations/hooks/useTrendRecommendations";
import { apiErrorMessage } from "@/features/topic/lib/apiError";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

function formatSource(source: string): string {
  return source.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function KeywordRecommendationsSection() {
  const { t, language } = useTranslation();
  const [keywordInput, setKeywordInput] = useState("");
  const [relatedKeywords, setRelatedKeywords] = useState<string[]>([]);
  const [relatedKeywordInput, setRelatedKeywordInput] = useState("");

  const { items, loading, error, refresh, submit, submitting } = useTrendRecommendations();

  function addRelatedKeyword(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setRelatedKeywords((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setRelatedKeywordInput("");
  }

  function removeRelatedKeyword(keyword: string) {
    setRelatedKeywords((prev) => prev.filter((k) => k !== keyword));
  }

  function handleRelatedKeywordKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRelatedKeyword(relatedKeywordInput);
    } else if (e.key === "Backspace" && !relatedKeywordInput && relatedKeywords.length > 0) {
      setRelatedKeywords((prev) => prev.slice(0, -1));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = keywordInput.trim();
    if (!trimmed) {
      toast.error(t.keywordRecommendations.keywordRequired);
      return;
    }

    const allRelatedKeywords = relatedKeywordInput.trim()
      ? [...relatedKeywords, relatedKeywordInput.trim()]
      : relatedKeywords;

    try {
      await submit(trimmed, undefined, allRelatedKeywords);
      toast.success(t.keywordRecommendations.submitSuccess);
      setKeywordInput("");
      setRelatedKeywords([]);
      setRelatedKeywordInput("");
    } catch (err) {
      toast.error(apiErrorMessage(err, t.keywordRecommendations.submitError));
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.keywordRecommendations.formTitle}</h3>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder={t.keywordRecommendations.keywordPlaceholder}
            maxLength={255}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
          />

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.keywordRecommendations.relatedKeywordsLabel}
            </label>
            <div className="flex min-h-10 flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 transition focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus-within:bg-slate-900">
              <Tag size={15} className="shrink-0 text-slate-400 dark:text-slate-500" />

              {relatedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                >
                  {kw}
                  <button
                    type="button"
                    onClick={() => removeRelatedKeyword(kw)}
                    aria-label={`Hapus keyword ${kw}`}
                    className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}

              <input
                value={relatedKeywordInput}
                onChange={(e) => setRelatedKeywordInput(e.target.value)}
                onKeyDown={handleRelatedKeywordKeyDown}
                placeholder={
                  relatedKeywords.length === 0
                    ? t.keywordRecommendations.relatedKeywordsPlaceholderEmpty
                    : t.keywordRecommendations.relatedKeywordsPlaceholderMore
                }
                className="min-w-32 flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow shadow-indigo-500/20 transition hover:from-indigo-700 hover:to-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
              {t.keywordRecommendations.submitButton}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.keywordRecommendations.listTitle}</h3>
          </div>
          <button
            type="button"
            onClick={() => refresh()}
            disabled={loading}
            className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            {t.keywordRecommendations.refreshButton}
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
            <p className="py-6 text-sm text-slate-400 dark:text-slate-500">{t.keywordRecommendations.empty}</p>
          ) : (() => {
              const manualItems = items.filter((item) => item.source === "manual_user");
              if (manualItems.length === 0) {
                return (
                  <p className="py-6 text-sm text-slate-400 dark:text-slate-500">{t.keywordRecommendations.empty}</p>
                );
              }
              return manualItems.map((item, i) => (
                <div
                  key={`${item.topic}-${i}`}
                  className="flex items-start justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{item.topic}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(item.keywords ?? []).map((kw) => (
                        <span
                          key={kw}
                          className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500">
                    {formatRelativeTime(item.recommendation_date, language)}
                  </span>
                </div>
              ));
            })()}
        </div>
      </div>
    </div>
  );
}
