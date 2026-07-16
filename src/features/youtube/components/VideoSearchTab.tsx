"use client";

import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { FaYoutube } from "react-icons/fa6";

import VideoSearchGrid from "@/components/youtube/VideoSearchGrid";
import { useVideoSearch } from "../hooks/useVideoSearch";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function VideoSearchTab() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const { keyword, items, total, loading, error, search } = useVideoSearch();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(input);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.youtubeSearchTab.title}</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.subtitle}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      >
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          {t.youtubeSearchTab.keywordLabel}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              placeholder={t.youtubeSearchTab.keywordPlaceholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            {t.youtubeSearchTab.searchButton}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">{t.youtubeSearchTab.loadingTitle}</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.loadingDesc}</p>
        </div>
      )}

      {!loading && !error && items && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.youtubeSearchTab.showingPrefix}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{items.length}</span>{" "}
            {t.youtubeSearchTab.showingMiddle}{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{total}</span>{" "}
            {t.youtubeSearchTab.showingSuffix} &ldquo;{keyword}&rdquo;
          </p>
          <VideoSearchGrid items={items} />
        </>
      )}

      {!loading && !error && items === null && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
          <FaYoutube size={28} className="text-slate-300 dark:text-slate-600" />
          <p className="text-sm text-slate-400 dark:text-slate-500">{t.youtubeSearchTab.emptyTitle}</p>
        </div>
      )}
    </div>
  );
}
