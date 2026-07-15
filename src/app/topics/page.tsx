"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ChevronRight, Eye, Loader2, Plus, Search, Tags, Trash2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TopicForm, { type TopicFormData } from "@/features/topic/components/TopicForm";
import { useTopics, needsConfirmation, isQueued, type Topic } from "@/features/topic/hooks/useTopics";
import { apiErrorMessage } from "@/features/topic/lib/apiError";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TopTopicsLeaderboard from "@/components/topic/TopTopicsLeaderboard";

function ScheduleToggle({
  topic,
  onChange,
  disabled,
  labels,
}: {
  topic: Topic;
  onChange: (enabled: boolean, durationDays?: number) => void;
  disabled: boolean;
  labels: { on: string; off: string; unit: string };
}) {
  const [days, setDays] = useState(topic.scheduleDurationDays ?? 7);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={topic.recurring}
        disabled={disabled}
        onClick={() => onChange(!topic.recurring, days)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
          topic.recurring ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            topic.recurring ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>

      {topic.recurring ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {labels.on} · {topic.scheduleDurationDays ?? days} {labels.unit}
        </span>
      ) : (
        <>
          <input
            type="number"
            min={1}
            max={90}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            disabled={disabled}
            className="h-6 w-14 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1.5 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-50"
          />
          <span className="text-xs text-slate-400 dark:text-slate-500">{labels.unit}</span>
        </>
      )}
    </div>
  );
}

export default function TopicsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [authChecked, setAuthChecked] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null);
  const [searchBusyId, setSearchBusyId] = useState<string | null>(null);
  const [pollingId, setPollingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<{ topic: Topic; keywords: string[] } | null>(null);
  const { topics, loading, error, refresh, addTopic, removeTopic, searchTopic, pollTopicResult, updateSchedule } =
    useTopics();
  const cancelPollRef = useRef<Map<string, () => void>>(new Map());

  useEffect(() => {
    const cancels = cancelPollRef.current;
    return () => {
      cancels.forEach((cancel) => cancel());
      cancels.clear();
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  async function handleSubmit(data: TopicFormData) {
    setSubmitting(true);
    try {
      await addTopic(data);
      setCreateOpen(false);
      toast.success(t.topics.createSuccess);
    } catch (err) {
      console.error("createTopic failed:", err);
      toast.error(apiErrorMessage(err, t.topics.createError));
    } finally {
      setSubmitting(false);
    }
  }

  function handleDelete(topic: Topic) {
    setDeleteTarget(topic);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const topic = deleteTarget;
    setBusyId(topic.id);
    try {
      await removeTopic(topic.id);
      toast.success(t.topics.deleteSuccess);
    } catch (err) {
      console.error("deleteTopic failed:", err);
      toast.error(apiErrorMessage(err, t.topics.deleteError));
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  }

  function handleView(topic: Topic) {
    router.push(`/topics/${topic.id}`);
  }

  // confirmThirdParty HARUS false di percobaan pertama (lihat FLOW.md section 1).
  // Kalau backend balas needs_confirmation, tampilkan dialog persetujuan dan
  // TUNGGU user klik "Ya" sebelum memanggil ulang dengan confirmThirdParty=true.
  async function handleSearch(topic: Topic, confirmThirdParty: boolean) {
    setSearchBusyId(topic.id);
    try {
      const result = await searchTopic(topic.id, confirmThirdParty);

      if (needsConfirmation(result)) {
        setConfirmTarget({ topic, keywords: result?.needs_confirmation_keywords ?? [] });
        return;
      }
      setConfirmTarget(null);

      if (isQueued(result)) {
        toast.info(t.topics.searchQueued);
        setPollingId(topic.id);
        const cancel = pollTopicResult(topic.id, topic.totalPosts ?? 0, (found, latestTotal) => {
          cancelPollRef.current.delete(topic.id);
          setPollingId((cur) => (cur === topic.id ? null : cur));
          if (found) {
            toast.success(t.topics.searchFoundToast.replace("{count}", String(latestTotal - (topic.totalPosts ?? 0))));
          } else {
            toast.info(t.topics.searchTimeout);
          }
          refresh();
        });
        cancelPollRef.current.set(topic.id, cancel);
      } else {
        toast.success(t.topics.searchFoundImmediate);
        await refresh();
      }
    } catch (err) {
      console.error("searchTopic failed:", err);
      toast.error(apiErrorMessage(err, t.topics.searchError));
    } finally {
      setSearchBusyId(null);
    }
  }

  async function handleScheduleChange(topic: Topic, enabled: boolean, durationDays?: number) {
    setBusyId(topic.id);
    try {
      await updateSchedule(topic.id, enabled, enabled ? durationDays : null);
      toast.success(t.topics.scheduleSuccess);
    } catch (err) {
      console.error("updateSchedule failed:", err);
      toast.error(apiErrorMessage(err, t.topics.scheduleError));
    } finally {
      setBusyId(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.topics.pageTitle}</h1>
          {/* <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.topics.pageSubtitle}</p> */}
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:from-indigo-700 hover:to-violet-700 hover:shadow-lg"
        >
          <Plus size={16} /> {t.topics.addButton}
        </button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.topics.addButton}</DialogTitle>
          </DialogHeader>
          <TopicForm onSubmit={handleSubmit} loading={submitting} bare />
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmTarget} onOpenChange={(open) => !open && setConfirmTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.topics.confirmDialogTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.topics.confirmDialogDesc.replace("{keywords}", confirmTarget?.keywords.join(", ") ?? "")}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setConfirmTarget(null)}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.topics.confirmDialogNo}
            </button>
            <button
              type="button"
              onClick={() => {
                if (!confirmTarget) return;
                const target = confirmTarget.topic;
                setConfirmTarget(null);
                handleSearch(target, true);
              }}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white transition hover:bg-indigo-700"
            >
              {t.topics.confirmDialogYes}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.topics.deleteConfirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t.topics.deleteConfirmDesc.replace("{name}", deleteTarget?.name ?? "")}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDeleteTarget(null)}
              disabled={busyId === deleteTarget?.id}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              {t.topics.deleteConfirmNo}
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={busyId === deleteTarget?.id}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {busyId === deleteTarget?.id && <Loader2 size={14} className="animate-spin" />}
              {t.topics.deleteConfirmYes}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {!loading && !error && <TopTopicsLeaderboard topics={topics} />}

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.topics.listTitle}</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">{topics.length} {t.topics.topicsSaved}</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-14">
            <Loader2 size={22} className="animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <div className="py-14 text-center text-sm text-red-500">{error}</div>
        ) : topics.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
              <Tags size={22} className="text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-medium text-slate-600 dark:text-slate-300">{t.topics.emptyTitle}</p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.topics.emptyDesc}</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {topics.map((topic) => {
              const isBusy = busyId === topic.id;
              return (
                <li key={topic.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/topics/${topic.id}`}
                        className="group inline-flex items-center gap-0.5 font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {topic.name}
                        <ChevronRight
                          size={14}
                          className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                        />
                      </Link>
                      {(topic.totalPosts !== undefined || topic.totalComments !== undefined) && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {topic.totalPosts ?? 0} {t.topics.postsUnit} · {topic.totalComments ?? 0} {t.topics.commentsUnit}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {topic.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                      <span className="font-medium text-slate-500 dark:text-slate-400">{t.topics.recurringLabel}</span>
                      <ScheduleToggle
                        topic={topic}
                        disabled={isBusy}
                        onChange={(enabled, days) => handleScheduleChange(topic, enabled, days)}
                        labels={{
                          on: t.topics.recurringOn,
                          off: t.topics.recurringOff,
                          unit: t.topics.durationDaysUnit,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => handleSearch(topic, false)}
                      disabled={searchBusyId === topic.id || pollingId === topic.id}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                    >
                      {searchBusyId === topic.id || pollingId === topic.id ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Search size={13} />
                      )}
                      {pollingId === topic.id
                        ? t.topics.polling
                        : searchBusyId === topic.id
                          ? t.topics.searching
                          : t.topics.searchButton}
                    </button>
                    <button
                      onClick={() => handleView(topic)}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs font-medium text-slate-600 dark:text-slate-400 transition hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Eye size={13} />
                      {t.topics.viewButton}
                    </button>
                    <button
                      onClick={() => handleDelete(topic)}
                      disabled={isBusy}
                      aria-label={`${t.topics.deleteAria} ${topic.name}`}
                      className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
