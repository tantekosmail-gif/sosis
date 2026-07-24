"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, History, Loader2, Search, Tag, Zap } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTabs from "@/components/common/PageTabs";
import YoutubeTrendingTab from "@/features/youtube/components/TrendingTab";
import YoutubeSentimentTab from "@/features/youtube/components/SentimentTab";
import VideoSearchTab, { type VideoSearchTabHandle } from "@/features/youtube/components/VideoSearchTab";
import ComparePanel from "@/features/compare/components/ComparePanel";
import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";
import { useTopics } from "@/features/topic/hooks/useTopics";
import { useTrendRecommendations } from "@/features/keywordRecommendations/hooks/useTrendRecommendations";
import { getTrendRecommendationKeywords } from "@/features/keywordRecommendations/services/trendRecommendations.service";
import { useRecentYoutubeSearches } from "@/features/youtube/hooks/useRecentSearches";
import { useDashboardStore } from "@/store/dashboard.store";
import { useFilterStore } from "@/stores/filterStore";
import { useTopicStore } from "@/store/topic.store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SHOW_COMPARE_TAB = false;
const SHOW_SENTIMENT_TAB = false;

const TABS = [
  { key: "terkini", label: "Analisis Video" },
  { key: "trending", label: "Video Trending" },
  { key: "sentiment", label: "Analisis Sentimen" },
  { key: "compare", label: "Bandingkan" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function YoutubePage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState<TabKey>("terkini");
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const terkiniRef = useRef<VideoSearchTabHandle>(null);

  const { execute } = useAnalyze();
  const setFilterKeyword = useFilterStore((s) => s.setKeyword);
  const sentimentLoading = useDashboardStore((s) => s.loading);
  const { topics } = useTopics();
  const { items: keywordRecommendations } = useTrendRecommendations();
  const { recent, addRecentSearch } = useRecentYoutubeSearches();
  const globalTopicId = useTopicStore((s) => s.topicId);
  const globalTopicLabel = useTopicStore((s) => s.topicLabel);

  // Sumber saran ada tiga: keyword yang sudah pernah dicari di sini (recent,
  // localStorage, urutan terbaru dulu), keyword yang ditrack lewat fitur
  // Topics, dan keyword yang ditambahkan lewat Settings > Rekomendasi Keyword
  // (pool auto-crawl). Recent didahulukan karena lebih relevan (sudah pernah
  // dicari), dua sumber lain cuma nambahin yang belum ada -- dedupe
  // case-insensitive di seluruh sumber.
  const suggestionPool = useMemo(() => {
    const seen = new Set(recent.map((kw) => kw.toLowerCase()));
    const topicOnly = Array.from(new Set(topics.flatMap((topic) => topic.keywords)))
      .filter((kw) => !seen.has(kw.toLowerCase()))
      .sort((a, b) => a.localeCompare(b));
    topicOnly.forEach((kw) => seen.add(kw.toLowerCase()));

    const recommendationOnly = Array.from(new Set((keywordRecommendations ?? []).map((r) => r.topic))).filter(
      (kw) => !seen.has(kw.toLowerCase()),
    );

    return [
      ...recent.map((keyword) => ({ keyword, source: "recent" as const })),
      ...topicOnly.map((keyword) => ({ keyword, source: "topic" as const })),
      ...recommendationOnly.map((keyword) => ({ keyword, source: "recommendation" as const })),
    ];
  }, [recent, topics, keywordRecommendations]);

  const filteredSuggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q ? suggestionPool.filter((s) => s.keyword.toLowerCase().includes(q)) : suggestionPool;
    return pool.slice(0, 8);
  }, [query, suggestionPool]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  useEffect(() => {
    if (globalTopicId) return;
    if (!keywordRecommendations || keywordRecommendations.length === 0) return;

    const first = keywordRecommendations[0];
    useTopicStore.getState().setTopic(first.id, first.topic);
  }, [keywordRecommendations, globalTopicId]);

  useEffect(() => {
    if (!globalTopicId) return;

    if (tab !== "terkini") {
      setTab("terkini");
      return;
    }

    (async () => {
      let keywords: string[] = [];
      try {
        keywords = await getTrendRecommendationKeywords(globalTopicId);
      } catch (err) {
        console.error("Gagal memuat keyword topik:", err);
      }

      const searchTerms = keywords.length > 0 ? keywords : globalTopicLabel ? [globalTopicLabel] : [];
      if (searchTerms.length === 0) return;

      setQuery(searchTerms.join(", "));
      if (globalTopicLabel) addRecentSearch(globalTopicLabel);

      const trySearch = (attempt = 0) => {
        if (terkiniRef.current?.searchKeywords) {
          terkiniRef.current.searchKeywords(searchTerms);
        } else if (attempt < 20) {
          setTimeout(() => trySearch(attempt + 1), 50);
        }
      };
      trySearch();
    })();
  }, [globalTopicId, globalTopicLabel, tab, addRecentSearch]);

  // Cuma tab "terkini" (Analisis Video) & "sentiment" yang dikendalikan lewat
  // search bar bersama ini -- Video Viral (trending) sudah memuat datanya
  // sendiri (lihat useViralVideos) dan tidak butuh pencarian.
  const SEARCH_CONFIG: Partial<Record<TabKey, { placeholder: string; buttonLabel: string }>> = {
    terkini: { placeholder: t.youtubeSearchTab.keywordPlaceholder, buttonLabel: t.youtubeSearchTab.searchButton },
    sentiment: { placeholder: "Masukkan keyword pencarian YouTube...", buttonLabel: "Analyze" },
  };
  const { placeholder = "", buttonLabel = "" } = SEARCH_CONFIG[tab] ?? {};
  const showSearchBar = tab === "terkini" || tab === "sentiment";

  function runSearch(value: string) {
    const trimmed = value.trim();

    if (!trimmed) {
      toast.error("Masukkan keyword");
      return;
    }

    addRecentSearch(trimmed);

    if (tab === "terkini") {
      terkiniRef.current?.search(trimmed);
    } else if (tab === "sentiment") {
      setFilterKeyword(trimmed);
      execute("youtube", trimmed);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runSearch(query);
  }

  function selectSuggestion(keyword: string) {
    setQuery(keyword);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    runSearch(keyword);
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

        <PageTabs
          tabs={TABS.filter((t) => (t.key !== "compare" || SHOW_COMPARE_TAB) && (t.key !== "sentiment" || SHOW_SENTIMENT_TAB))}
          active={tab}
          onChange={setTab}
        />

        {showSearchBar && (
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
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setShowSuggestions(false)}
                onKeyDown={(e) => {
                  if (!showSuggestions || filteredSuggestions.length === 0) return;
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActiveSuggestionIndex((i) => (i + 1) % filteredSuggestions.length);
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActiveSuggestionIndex((i) => (i <= 0 ? filteredSuggestions.length - 1 : i - 1));
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                  } else if (e.key === "Enter" && activeSuggestionIndex >= 0) {
                    e.preventDefault();
                    selectSuggestion(filteredSuggestions[activeSuggestionIndex].keyword);
                  }
                }}
                autoComplete="off"
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
              />

              {showSuggestions && filteredSuggestions.length > 0 && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                  {filteredSuggestions.map((s, i) => (
                    <li key={s.keyword}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectSuggestion(s.keyword)}
                        className={`flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm transition-colors ${
                          i === activeSuggestionIndex
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
                            : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {s.source === "recent" ? (
                          <History size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        ) : s.source === "recommendation" ? (
                          <Flame size={13} className="shrink-0 text-orange-400" />
                        ) : (
                          <Tag size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />
                        )}
                        {s.keyword}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
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

        {tab === "trending" && <YoutubeTrendingTab />}
        {tab === "terkini" && <VideoSearchTab ref={terkiniRef} />}
        {tab === "sentiment" && <YoutubeSentimentTab />}
        {tab === "compare" && <ComparePanel platform="youtube" />}
      </div>
    </DashboardLayout>
  );
}
