"use client";

import { useState, type KeyboardEvent } from "react";
import { Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { suggestTopicKeywords } from "../services/topic.service";

export interface TopicFormData {
  name: string;
  keywords: string[];
}

interface TopicFormProps {
  onSubmit: (data: TopicFormData) => void;
  loading?: boolean;
  submitLabel?: string;
  /** Lewati card wrapper (border/shadow/bg) — dipakai saat form ditaruh di dalam dialog. */
  bare?: boolean;
}

export default function TopicForm({ onSubmit, loading = false, submitLabel, bare = false }: TopicFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [error, setError] = useState("");
  const [suggesting, setSuggesting] = useState(false);

  function addKeyword(raw: string) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setKeywords((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    setKeywordInput("");
  }

  function removeKeyword(keyword: string) {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  }

  function handleKeywordKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(keywordInput);
    } else if (e.key === "Backspace" && !keywordInput && keywords.length > 0) {
      setKeywords((prev) => prev.slice(0, -1));
    }
  }

  async function handleAiSuggest() {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t.topics.errorNameRequired);
      return;
    }

    setSuggesting(true);
    try {
      const suggested = await suggestTopicKeywords({ name: trimmedName, existingKeywords: keywords });
      if (suggested.length === 0) {
        toast.info(t.topics.aiSuggestEmpty);
      } else {
        setKeywords((prev) => [...prev, ...suggested.filter((kw) => !prev.includes(kw))]);
        setError("");
      }
    } catch (err) {
      console.error("suggestTopicKeywords failed:", err);
      toast.error(t.topics.aiSuggestError);
    } finally {
      setSuggesting(false);
    }
  }

  function handleSubmit() {
    const trimmedName = name.trim();
    const allKeywords = keywordInput.trim() ? [...keywords, keywordInput.trim()] : keywords;

    if (!trimmedName) {
      setError(t.topics.errorNameRequired);
      return;
    }
    if (allKeywords.length === 0) {
      setError(t.topics.errorKeywordRequired);
      return;
    }

    setError("");
    setKeywords(allKeywords);
    setKeywordInput("");
    onSubmit({ name: trimmedName, keywords: allKeywords });
  }

  return (
    <div className={bare ? "space-y-4" : "rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5 space-y-4"}>
      <div>
        <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t.topics.nameLabel}
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.topics.namePlaceholder}
          className="h-11 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </div>

      <div>
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {t.topics.keywordLabel}
          </label>
          <button
            type="button"
            onClick={handleAiSuggest}
            disabled={suggesting || !name.trim()}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300 transition hover:bg-indigo-100 dark:hover:bg-indigo-900/60 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {suggesting && <Loader2 size={13} className="animate-spin" />}
            {t.topics.aiSuggestButton}
          </button>
        </div>
        <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 transition focus-within:border-indigo-400 focus-within:bg-white dark:focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500/20">
          <Tag size={16} className="shrink-0 text-slate-400 dark:text-slate-500" />

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
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            placeholder={keywords.length === 0 ? t.topics.keywordPlaceholderEmpty : t.topics.keywordPlaceholderMore}
            className="min-w-32 flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t.topics.saving : submitLabel ?? t.topics.addSubmit}
        </button>
      </div>
    </div>
  );
}
