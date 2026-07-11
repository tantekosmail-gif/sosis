"use client";

import { useState, type KeyboardEvent } from "react";
import { Search, Loader2, X, Tags } from "lucide-react";

import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import { useDashboardStore } from "@/store/dashboard.store";
import { useTopics } from "@/features/topic/hooks/useTopics";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function SmartSearchForm() {
  const { execute } = useAnalyze();
  const loading = useDashboardStore((s) => s.loading);
  const { topics } = useTopics();
  const { t } = useTranslation();

  const [keywords, setKeywords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState("");

  const query = inputValue.trim().toLowerCase();
  const suggestions = query ? topics.filter((topic) => topic.name.toLowerCase().includes(query)).slice(0, 5) : [];

  function addKeyword(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setKeywords((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setInputValue("");
  }

  function removeKeyword(keyword: string) {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  }

  function selectTopicSuggestion(topicKeywords: string[]) {
    setKeywords((prev) => {
      const merged = [...prev];
      topicKeywords.forEach((kw) => {
        if (!merged.includes(kw)) merged.push(kw);
      });
      return merged;
    });
    setInputValue("");
    setShowSuggestions(false);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(inputValue);
      setShowSuggestions(false);
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  }

  async function handleSearch() {
    // Sertakan teks yang belum ditekan Enter, supaya tidak hilang begitu saja
    const all = inputValue.trim() ? [...keywords, inputValue.trim()] : keywords;
    if (all.length === 0) {
      setError(t.search.errorKeywordRequired);
      return;
    }
    setError("");
    setKeywords(all);
    setInputValue("");
    setShowSuggestions(false);

    try {
      await execute("global", all.join(" "));
    } catch {
      setError(t.search.errorSearchFailed);
    }
  }

  const canSearch = keywords.length > 0 || !!inputValue.trim();

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative flex-1">
          <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 transition focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <Search size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />

            {keywords.map((kw) => (
              <span
                key={kw}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => removeKeyword(kw)}
                  aria-label={`Hapus keyword ${kw}`}
                  className="rounded-full p-0.5 hover:bg-indigo-100 dark:hover:bg-indigo-900"
                >
                  <X size={11} />
                </button>
              </span>
            ))}

            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder={keywords.length === 0 ? t.search.keywordPlaceholderEmpty : t.search.keywordPlaceholderMore}
              className="min-w-32 flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
              <p className="border-b border-slate-100 dark:border-slate-800 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t.search.similarTopics}
              </p>
              {suggestions.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectTopicSuggestion(topic.keywords)}
                  className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Tags size={14} className="shrink-0 text-indigo-500" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-800 dark:text-slate-200">{topic.name}</span>
                    <span className="block truncate text-xs text-slate-400 dark:text-slate-500">
                      {topic.keywords.join(", ")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !canSearch}
          className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          {loading ? t.search.searching : t.search.searchButton}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
