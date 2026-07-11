"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PageTabs from "@/components/common/PageTabs";
import InstagramTrendingTab from "@/features/instagram/components/TrendingTab";
import InstagramSentimentTab from "@/features/instagram/components/SentimentTab";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const TABS = [
  { key: "trending", label: "Trending" },
  { key: "sentiment", label: "Sentiment" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function InstagramPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [tab, setTab] = useState<TabKey>("sentiment");

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
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.checkingAuth}</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Instagram</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            {t.platforms.instagram.subtitle}
          </p>
        </div>

        <PageTabs tabs={TABS} active={tab} onChange={setTab} />

        {tab === "trending" ? <InstagramTrendingTab /> : <InstagramSentimentTab />}
      </div>
    </DashboardLayout>
  );
}
