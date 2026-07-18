"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, LayoutGrid, Loader2, RefreshCw, Table2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import PeriodSelect from "@/components/dashboard/PeriodSelect";
import EngagementSummaryCard from "@/components/engagement/EngagementSummaryCard";
import EngagementSummaryTable from "@/components/engagement/EngagementSummaryTable";
import EngagementCompositionChart from "@/components/engagement/EngagementCompositionChart";
import EngagementTrendGrid from "@/components/engagement/EngagementTrendGrid";
import { MetricSourceProvider } from "@/components/engagement/MetricSource";
import { ENGAGEMENT_PLATFORMS, useEngagementDashboard } from "@/features/engagement/hooks/useEngagementDashboard";
import { PLATFORM_LABEL } from "@/features/engagement/lib/colors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { type PeriodPreset } from "@/lib/period";

export default function EngagementPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [period, setPeriod] = useState<PeriodPreset>("30d");
  const [view, setView] = useState<"cards" | "table">("cards");
  const { summaries, trends, errors, loading, range, fetchedAt, refresh } = useEngagementDashboard(period);

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
      <MetricSourceProvider dateFrom={range.date_from} dateTo={range.date_to} fetchedAt={fetchedAt}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.engagement.title}</h1>
            {fetchedAt && !loading && (
              <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                Diperbarui {fetchedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} — klik angka, grafik, atau keterangan untuk melihat sumber datanya
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={loading}
              title="Ambil ulang data dari API"
              className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setView("cards")}
                aria-pressed={view === "cards"}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  view === "cards"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <LayoutGrid size={13} />
                {t.engagement.cardView}
              </button>
              <button
                type="button"
                onClick={() => setView("table")}
                aria-pressed={view === "table"}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                  view === "table"
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                <Table2 size={13} />
                {t.engagement.tableView}
              </button>
            </div>
            <PeriodSelect value={period} onChange={setPeriod} />
          </div>
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

        {view === "cards" ? (
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
        ) : (
          !loading && (
            <EngagementSummaryTable summaries={summaries} errors={errors} platforms={ENGAGEMENT_PLATFORMS} />
          )
        )}

        {!loading && hasAnySummary && <EngagementCompositionChart summaries={summaries} />}

        {!loading && <EngagementTrendGrid trends={trends} dateFrom={range.date_from} dateTo={range.date_to} />}

        {loading && (
          <div className="flex items-center justify-center py-10">
            <Loader2 size={22} className="animate-spin text-indigo-500" />
          </div>
        )}
      </div>
      </MetricSourceProvider>
    </DashboardLayout>
  );
}
