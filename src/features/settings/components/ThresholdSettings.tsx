"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
import {
  getNotificationThresholds,
  updateNotificationThreshold,
  type NotificationThresholds,
} from "@/features/notifications/services/notification.service";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { formatCompactNumber } from "@/lib/utils";

const PLATFORM_META: Record<string, { label: string; icon: typeof FaYoutube; color: string }> = {
  youtube: { label: "YouTube", icon: FaYoutube, color: "text-red-500" },
  tiktok: { label: "TikTok", icon: FaTiktok, color: "text-slate-900 dark:text-slate-100" },
  twitter: { label: "Twitter/X", icon: FaXTwitter, color: "text-slate-900 dark:text-slate-100" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "text-blue-600" },
  instagram: { label: "Instagram", icon: FaInstagram, color: "text-pink-500" },
};

const PLATFORM_ORDER = ["youtube", "tiktok", "twitter", "facebook", "instagram"];

export default function ThresholdSettings() {
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
