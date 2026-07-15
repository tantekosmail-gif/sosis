"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PeriodSelect from "@/components/dashboard/PeriodSelect";
import EngagementSummaryCard from "@/components/engagement/EngagementSummaryCard";
import EngagementCompositionChart from "@/components/engagement/EngagementCompositionChart";
import EngagementTrendGrid from "@/components/engagement/EngagementTrendGrid";
import { ENGAGEMENT_PLATFORMS, useEngagementDashboard } from "@/features/engagement/hooks/useEngagementDashboard";
import { PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { type PeriodPreset } from "@/lib/period";

export default function EngagementPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [period, setPeriod] = useState<PeriodPreset>("30d");
  const { summaries, trends, errors, loading, range } = useEngagementDashboard(period);

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

  const hasAnySummary = ENGAGEMENT_PLATFORMS.some((p) => summaries[p]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.engagement.title}</h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.engagement.subtitle}</p>
          </div>
          <PeriodSelect value={period} onChange={setPeriod} />
        </div>

        {!loading && Object.keys(errors).length > 0 && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0" />
            <ul className="space-y-0.5">
              {Object.entries(errors).map(([platform, msg]) => (
                <li key={platform}>
                  <span className="font-semibold">{PLATFORM_LABEL[platform as keyof typeof PLATFORM_LABEL]}:</span> {msg}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {ENGAGEMENT_PLATFORMS.map((platform) => (
            <EngagementSummaryCard
              key={platform}
              summary={summaries[platform]}
              error={errors[platform]}
              loading={loading}
            />
          ))}
        </div>

        {!loading && hasAnySummary && <EngagementCompositionChart summaries={summaries} />}

        {!loading && <EngagementTrendGrid trends={trends} dateFrom={range.date_from} dateTo={range.date_to} />}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={22} className="animate-spin text-indigo-500" />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
