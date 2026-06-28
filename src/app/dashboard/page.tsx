"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardLayout from "@/components/layout/DashboardLayout";

import ExposureSection from "@/features/dashboard/sections/ExposureSection";
import SentimentSection from "@/features/dashboard/sections/SentimentSection";
import TopPostsSection from "@/features/dashboard/sections/TopPostsSection";
import WordCloud from "@/components/dashboard/WordCloud";

import { useDashboardStore } from "@/store/dashboard.store";

export default function DashboardPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);

  const dashboard = useDashboardStore((s) => s.dashboard);
  const loading = useDashboardStore((s) => s.loading);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        Checking authentication...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardHeader />

      <AnalysisPanel />

      {loading && (
        <div className="rounded-xl border bg-white p-10 text-center">
          Loading...
        </div>
      )}

      {!loading && !dashboard && (
        <div className="rounded-xl border bg-white p-20 text-center text-gray-500">
          <h2 className="text-xl font-semibold">Belum ada hasil analisis</h2>

          <p className="mt-2 text-sm text-gray-400">
            Pilih platform, masukkan keyword, lalu klik Analyze.
          </p>
        </div>
      )}

      {!loading && dashboard && (
        <>
          <ExposureSection
            data={dashboard.summary}
            timeline={dashboard.timeline}
          />

          <SentimentSection
            data={[
              {
                sentiment: "positive",
                total: dashboard.sentiment.positive,
              },
              {
                sentiment: "neutral",
                total: dashboard.sentiment.neutral,
              },
              {
                sentiment: "negative",
                total: dashboard.sentiment.negative,
              },
            ]}
            platform={dashboard.platformDistribution}
          />

          <TopPostsSection data={dashboard.topPosts} />

          <WordCloud data={dashboard.wordCloud} />
        </>
      )}
    </DashboardLayout>
  );
}
