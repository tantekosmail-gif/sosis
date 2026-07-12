"use client";

import { AlertTriangle, HeartPulse, Loader2 } from "lucide-react";

import { useDataHealth } from "../hooks/useDataHealth";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function DataHealthSection() {
  const { items, loading } = useDataHealth();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center gap-2">
        <HeartPulse size={16} className="text-indigo-600" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.dataHealth.title}</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
        {t.overviewWidgets.dataHealth.desc}
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const pct = item.totalItems > 0 ? (item.totalAnalyzed / item.totalItems) * 100 : 0;
          return (
            <div key={item.platform} className="rounded-xl border border-slate-100 dark:border-slate-800 p-3.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.platform}</span>
                {!item.fullyAnalyzed && <AlertTriangle size={13} className="text-amber-500" />}
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-full rounded-full ${item.fullyAnalyzed ? "bg-emerald-500" : "bg-amber-400"}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                {t.overviewWidgets.dataHealth.analyzedLine
                  .replace("{analyzed}", item.totalAnalyzed.toLocaleString("id-ID"))
                  .replace("{total}", item.totalItems.toLocaleString("id-ID"))
                  .replace("{pct}", pct.toFixed(0))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
