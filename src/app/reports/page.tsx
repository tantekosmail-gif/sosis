"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileDown, Loader2 } from "lucide-react";
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
  { key: "pdf", label: "PDF" },
  { key: "docx", label: "DOCX" },
  { key: "json", label: "JSON" },
] as const;

type Format = (typeof FORMAT_OPTIONS)[number]["key"];

export default function ReportsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { topics } = useTopics();

  const [authChecked, setAuthChecked] = useState(false);
  const [activePeriod, setActivePeriod] = useState<PeriodKey>("daily");
  const [topicId, setTopicId] = useState("");
  const [format, setFormat] = useState<Format>("pdf");
  const [submitting, setSubmitting] = useState(false);
  const [pollingReportId, setPollingReportId] = useState<string | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      if (job.downloadUrl) {
        window.open(job.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        const blob = await downloadReportFile(job.id);
        triggerBlobDownload(blob, `laporan-${activePeriod}-${topicId}.${format}`);
      }
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.reports.pageTitle}</h1>

        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
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

        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900 space-y-4">
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
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
              {FORMAT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setFormat(opt.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    format === opt.key ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={submitting || !!pollingReportId || !topicId}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {(submitting || pollingReportId) && <Loader2 size={15} className="animate-spin" />}
            {!submitting && !pollingReportId && <FileDown size={15} />}
            {submitting ? t.reports.generating : pollingReportId ? t.reports.waitingForReport : t.reports.generateButton}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
