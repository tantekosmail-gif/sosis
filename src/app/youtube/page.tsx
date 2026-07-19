"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, Zap } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTabs from "@/components/common/PageTabs";
import YoutubeTrendingTab, { type TrendingTabHandle } from "@/features/youtube/components/TrendingTab";
import YoutubeSentimentTab from "@/features/youtube/components/SentimentTab";
import VideoSearchTab, { type VideoSearchTabHandle } from "@/features/youtube/components/VideoSearchTab";
import ComparePanel from "@/features/compare/components/ComparePanel";
import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import { useDashboardStore } from "@/store/dashboard.store";
import { useFilterStore } from "@/stores/filterStore";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SHOW_COMPARE_TAB = false;

const TABS = [
  { key: "trending", label: "Trending" },
  { key: "terkini", label: "Terkini" },
  { key: "sentiment", label: "Sentiment" },
  { key: "compare", label: "Bandingkan" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function YoutubePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState<TabKey>("trending");
  const [query, setQuery] = useState("");

  const trendingRef = useRef<TrendingTabHandle>(null);
  const terkiniRef = useRef<VideoSearchTabHandle>(null);

  const { execute } = useAnalyze();
  const setFilterKeyword = useFilterStore((s) => s.setKeyword);
  const sentimentLoading = useDashboardStore((s) => s.loading);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  const SEARCH_CONFIG: Record<TabKey, { placeholder: string; buttonLabel: string }> = {
    trending: { placeholder: t.youtubeTrendingTab.searchPlaceholder, buttonLabel: t.youtubeSearchTab.searchButton },
    terkini: { placeholder: t.youtubeSearchTab.keywordPlaceholder, buttonLabel: t.youtubeSearchTab.searchButton },
    sentiment: { placeholder: "Masukkan keyword pencarian YouTube...", buttonLabel: "Analyze" },
    compare: { placeholder: "", buttonLabel: "" },
  };
  const { placeholder, buttonLabel } = SEARCH_CONFIG[tab];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();

    if (tab === "trending") {
      trendingRef.current?.search(trimmed);
      return;
    }

    if (!trimmed) {
      toast.error("Masukkan keyword");
      return;
    }

    if (tab === "terkini") {
      terkiniRef.current?.search(trimmed);
    } else {
      setFilterKeyword(trimmed);
      execute("youtube", trimmed);
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.checkingAuth}</p>
        </div>
      </div>
    );
  }

  const isSubmitting = tab === "sentiment" && sentimentLoading;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">YouTube</h1>
        </div>

        {tab !== "compare" && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 size={15} className="animate-spin" />
              ) : tab === "sentiment" ? (
                <Zap size={15} />
              ) : (
                <Search size={15} />
              )}
              {buttonLabel}
            </button>
          </div>
        </form>
        )}

        <PageTabs tabs={SHOW_COMPARE_TAB ? TABS : TABS.filter((t) => t.key !== "compare")} active={tab} onChange={setTab} />

        {tab === "trending" && <YoutubeTrendingTab ref={trendingRef} />}
        {tab === "terkini" && <VideoSearchTab ref={terkiniRef} />}
        {tab === "sentiment" && <YoutubeSentimentTab />}
        {tab === "compare" && <ComparePanel platform="youtube" />}
      </div>
    </DashboardLayout>
  );
}
