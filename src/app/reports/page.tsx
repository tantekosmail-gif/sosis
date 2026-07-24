"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart3, Braces, File, FileDown, FileText, History, Loader2 } from "lucide-react";
import { toast } from "sonner";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTopics } from "@/features/topic/hooks/useTopics";
import {
  downloadReportFile,
  generateReport,
  getReportStatus,
  isReportDone,
  isReportFailed,
  type ReportJob,
} from "@/features/topic/services/topic.service";
import { apiErrorMessage } from "@/features/topic/lib/apiError";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const POLL_INTERVAL_MS = 4000;
const POLL_TIMEOUT_MS = 5 * 60 * 1000;

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const PERIODS = [
  { key: "daily", labelKey: "periodDaily" },
  { key: "weekly", labelKey: "periodWeekly" },
  { key: "monthly", labelKey: "periodMonthly" },
  { key: "yearly", labelKey: "periodYearly" },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

const FORMAT_OPTIONS = [
  { key: "pdf", label: "PDF", icon: FileText },
  { key: "docx", label: "DOCX", icon: File },
  { key: "json", label: "JSON", icon: Braces },
] as const;

type Format = (typeof FORMAT_OPTIONS)[number]["key"];

interface RecentReport {
  id: string;
  label: string;
  format: Format;
  generatedAt: Date;
}

export default function ReportsPage() {
  const router = useRouter();
  const { t, language } = useTranslation();
  const { topics } = useTopics();

  const [authChecked, setAuthChecked] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("daily");
  const [topicId, setTopicId] = useState("");
  const [format, setFormat] = useState<Format>("pdf");
  const [submitting, setSubmitting] = useState(false);
  const [pollingReportId, setPollingReportId] = useState<string | null>(null);
  const [recentReports, setRecentReports] = useState<RecentReport[]>([]);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedTopic = topics.find((topic) => topic.id === topicId);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    return () => {
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
    };
  }, []);

  async function handleReportDone(job: ReportJob) {
    try {
      const filename = `laporan-${activePeriod}-${selectedTopic?.name ?? topicId}.${format}`;
      if (job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        const blob = await downloadReportFile(job.id);
        triggerBlobDownload(blob, filename);
      }
      setRecentReports((prev) => [{ id: job.id, label: filename, format, generatedAt: new Date() }, ...prev].slice(0, 8));
      toast.success(t.reports.generateSuccess);
    } catch (err) {
      console.error("downloadReportFile failed:", err);
      toast.error(apiErrorMessage(err, t.reports.downloadError));
    }
  }

  function pollReportStatus(reportId: string) {
    const startedAt = Date.now();
    setPollingReportId(reportId);

    const tick = async () => {
      try {
        const job = await getReportStatus(reportId);
        if (isReportDone(job.status)) {
          pollTimerRef.current = null;
          setPollingReportId(null);
          await handleReportDone(job);
          return;
        }
        if (isReportFailed(job.status)) {
          pollTimerRef.current = null;
          setPollingReportId(null);
          toast.error(job.error || t.reports.generateError);
          return;
        }
      } catch (err) {
        console.error("getReportStatus failed:", err);
      }

      if (Date.now() - startedAt >= POLL_TIMEOUT_MS) {
        pollTimerRef.current = null;
        setPollingReportId(null);
        toast.info(t.reports.generateTimeout);
        return;
      }

      pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
    };

    pollTimerRef.current = setTimeout(tick, POLL_INTERVAL_MS);
  }

  async function handleGenerate() {
    if (!topicId) {
      toast.error(t.reports.selectTopicFirst);
      return;
    }
    setSubmitting(true);
    try {
      const job = await generateReport({ topic_id: topicId, format, period: activePeriod });
      if (isReportDone(job.status)) {
        await handleReportDone(job);
      } else if (isReportFailed(job.status)) {
        toast.error(job.error || t.reports.generateError);
      } else {
        toast.info(t.reports.generateQueued);
        pollReportStatus(job.id);
      }
    } catch (err) {
      console.error("generateReport failed:", err);
      toast.error(apiErrorMessage(err, t.reports.generateError));
    } finally {
      setSubmitting(false);
    }
  }

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const periodLabel = t.reports[PERIODS.find((p) => p.key === activePeriod)!.labelKey].toLowerCase();
  const insightDesc = selectedTopic
    ? t.reports.insightDescWithTopic.replace("{period}", periodLabel).replace("{topic}", selectedTopic.name)
    : t.reports.insightDescNoTopic;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.reports.pageTitle}</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.reports.pageSubtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm lg:col-span-3">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                <BarChart3 size={17} className="text-indigo-600" />
              </div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.reports.configTitle}</h2>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.reports.timeRangeLabel}
                </label>
                <div className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                  {PERIODS.map((period) => (
                    <button
                      key={period.key}
                      type="button"
                      onClick={() => setActivePeriod(period.key)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                        activePeriod === period.key
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                    >
                      {t.reports[period.labelKey]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.reports.topicLabel}
                </label>
                {topics.length === 0 ? (
                  <p className="text-sm text-slate-400 dark:text-slate-500">{t.reports.emptyTopics}</p>
                ) : (
                  <select
                    value={topicId}
                    onChange={(e) => setTopicId(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                  >
                    <option value="">{t.reports.topicPlaceholder}</option>
                    {topics.map((topic) => (
                      <option key={topic.id} value={topic.id}>{topic.name}</option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t.reports.formatLabel}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {FORMAT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setFormat(opt.key)}
                      className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition ${
                        format === opt.key
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800"
                      }`}
                    >
                      <opt.icon size={15} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={submitting || !!pollingReportId || !topicId}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {(submitting || pollingReportId) && <Loader2 size={15} className="animate-spin" />}
                {!submitting && !pollingReportId && <FileDown size={15} />}
                {submitting ? t.reports.generating : pollingReportId ? t.reports.waitingForReport : t.reports.generateButton}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-6 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-950/60">
                <BarChart3 size={24} className="text-indigo-600" />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900 dark:text-slate-100">{t.reports.insightTitle}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{insightDesc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span className="hidden">{t.header.liveStatus}</span>
              </span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
                  <History size={15} className="text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.reports.recentReportsTitle}</h2>
              </div>

              {recentReports.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.reports.recentReportsEmpty}</p>
              ) : (
                <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                  {recentReports.map((report) => {
                    const Icon = FORMAT_OPTIONS.find((opt) => opt.key === report.format)?.icon ?? FileText;
                    return (
                      <li key={report.id} className="flex items-start gap-3 px-5 py-3">
                        <Icon size={15} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{report.label}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {formatRelativeTime(report.generatedAt.toISOString(), language)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
