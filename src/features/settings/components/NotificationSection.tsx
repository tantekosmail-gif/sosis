"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import { AppSettings } from "../hooks/useSettings";
import {
  getNotificationThresholds,
  updateNotificationThreshold,
  type NotificationThresholds,
} from "@/features/notifications/services/notification.service";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatCompactNumber } from "@/lib/utils";

interface Props {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onSave: () => void;
  saved: boolean;
}

function Toggle({
  checked, onChange,
}: {
  checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
        checked ? "bg-indigo-600" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white dark:bg-slate-900 shadow-sm transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

function NotifRow({
  title, description, checked, onChange,
}: {
  title: string; description: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const PLATFORM_META: Record<string, { label: string; icon: typeof FaYoutube; color: string }> = {
  youtube: { label: "YouTube", icon: FaYoutube, color: "text-red-500" },
  tiktok: { label: "TikTok", icon: FaTiktok, color: "text-slate-900 dark:text-slate-100" },
  twitter: { label: "Twitter/X", icon: FaXTwitter, color: "text-slate-900 dark:text-slate-100" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "text-blue-600" },
  instagram: { label: "Instagram", icon: FaInstagram, color: "text-pink-500" },
};

const PLATFORM_ORDER = ["youtube", "tiktok", "twitter", "facebook", "instagram"];

function ThresholdSettings() {
  const { t } = useTranslation();
  const [thresholds, setThresholds] = useState<NotificationThresholds>({});
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [savingPlatform, setSavingPlatform] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getNotificationThresholds();
        if (cancelled) return;
        setThresholds(data);
        setValues(Object.fromEntries(Object.entries(data).map(([platform, v]) => [platform, String(v.value)])));
      } catch (err) {
        console.error("getNotificationThresholds failed:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSave(platform: string) {
    const meta = thresholds[platform];
    if (!meta) return;
    const value = Number(values[platform]);
    if (!Number.isFinite(value) || value <= 0) {
      toast.error(t.settings.notification.thresholdInvalidValue);
      return;
    }
    setSavingPlatform(platform);
    try {
      await updateNotificationThreshold({ platform, metric: meta.metric, value });
      setThresholds((prev) => ({ ...prev, [platform]: { ...prev[platform], value } }));
      toast.success(t.settings.notification.thresholdSaveSuccess.replace("{platform}", PLATFORM_META[platform]?.label ?? platform));
    } catch (err: any) {
      toast.error(err?.response?.data?.error?.message || err?.message || t.settings.notification.thresholdSaveError);
    } finally {
      setSavingPlatform(null);
    }
  }

  const platforms = PLATFORM_ORDER.filter((p) => thresholds[p]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.notification.thresholdsTitle}</h3>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.notification.thresholdsDesc}</p>
      </div>

      <div className="px-6">
        {loading ? (
          <div className="flex items-center justify-center py-8 text-slate-400 dark:text-slate-500">
            <Loader2 size={18} className="animate-spin" />
          </div>
        ) : platforms.length === 0 ? (
          <p className="py-6 text-sm text-slate-400 dark:text-slate-500">{t.settings.notification.thresholdsEmpty}</p>
        ) : (
          platforms.map((platform) => {
            const meta = thresholds[platform];
            const info = PLATFORM_META[platform];
            const Icon = info?.icon;
            const dirty = Number(values[platform]) !== meta.value;
            return (
              <div
                key={platform}
                className="flex flex-col gap-3 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  {Icon && <Icon size={18} className={info.color} />}
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{info?.label ?? platform}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {t.settings.notification.metricLabel}: {meta.metric === "views" ? t.settings.notification.metricViews : t.settings.notification.metricLikes}
                      {" · "}
                      {t.settings.notification.thresholdCurrentPrefix} {formatCompactNumber(meta.value)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={values[platform] ?? ""}
                      onChange={(e) => setValues((prev) => ({ ...prev, [platform]: e.target.value }))}
                      className="h-9 w-32 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-right text-sm text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
                    />
                    <button
                      type="button"
                      onClick={() => handleSave(platform)}
                      disabled={savingPlatform === platform || !dirty}
                      className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 transition"
                    >
                      {savingPlatform === platform && <Loader2 size={13} className="animate-spin" />}
                      {t.settings.notification.thresholdSave}
                    </button>
                  </div>
                  {values[platform] && Number.isFinite(Number(values[platform])) && (
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      &asymp; {formatCompactNumber(Number(values[platform]))}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default function NotificationSection({ settings, update, onSave, saved }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.notification.title}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.notification.desc}</p>
        </div>

        <div className="px-6">
          <NotifRow
            title={t.settings.notification.analysisDone}
            description="Tampilkan notifikasi ketika proses pengumpulan data dan analisis selesai"
            checked={settings.notifyOnAnalysisDone}
            onChange={(v) => update("notifyOnAnalysisDone", v)}
          />
          <NotifRow
            title={t.settings.notification.aiSummaryDone}
            description="Tampilkan notifikasi ketika ringkasan eksekutif berhasil dibuat otomatis"
            checked={settings.notifyOnAISummaryDone}
            onChange={(v) => update("notifyOnAISummaryDone", v)}
          />
          <NotifRow
            title={t.settings.notification.errorNotif}
            description="Tampilkan peringatan ketika terjadi kegagalan koneksi atau error pengumpulan data"
            checked={settings.notifyOnError}
            onChange={(v) => update("notifyOnError", v)}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
        >
          {saved ? <><CheckCircle2 size={15} /> {t.common.saved}</> : t.settings.notification.saveButton}
        </button>
      </div>

      <ThresholdSettings />
    </div>
  );
}
