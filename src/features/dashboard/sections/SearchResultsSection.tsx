"use client";

import { Loader2 } from "lucide-react";

import { useDashboardStore } from "@/store/dashboard.store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import ExposureSection from "./ExposureSection";
import SentimentSection from "./SentimentSection";
import TopPostsSection from "./TopPostsSection";
import AISummarySection from "./AISummarySection";
import SentimentTimeline from "@/components/dashboard/SentimentTimeline";
import CommentsTable from "@/components/dashboard/CommentsTable";
import WordCloud from "@/components/dashboard/WordCloud";

export default function SearchResultsSection() {
  const { t } = useTranslation();
  const dashboard = useDashboardStore((s) => s.dashboard);
  const loading = useDashboardStore((s) => s.loading);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border bg-white dark:bg-slate-900 py-24 shadow-sm">
        <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
        <p className="font-semibold text-slate-700 dark:text-slate-300">{t.youtubeSentimentTab.loadingTitle}</p>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {t.overview.resultsTitle} <span className="text-indigo-600">&quot;{dashboard.keyword}&quot;</span>
        </h2>
      </div>

      <ExposureSection data={dashboard.summary} sentiment={dashboard.sentiment} timeline={dashboard.timeline} />

      <SentimentSection
        data={[
          { sentiment: "positive", total: dashboard.sentiment.positive },
          { sentiment: "neutral", total: dashboard.sentiment.neutral },
          { sentiment: "negative", total: dashboard.sentiment.negative },
        ]}
        platform={dashboard.platformDistribution}
      />

      <SentimentTimeline data={dashboard.timeline} />

      <TopPostsSection data={dashboard.topPosts} />

      {dashboard.comments?.length > 0 && <CommentsTable comments={dashboard.comments} />}

      <WordCloud data={dashboard.wordCloud} />

      <AISummarySection />
    </div>
  );
}
