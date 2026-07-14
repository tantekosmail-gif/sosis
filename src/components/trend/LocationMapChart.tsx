"use client";

import dynamic from "next/dynamic";
import { Info, MapPin } from "lucide-react";
import { format, type Locale } from "date-fns";
import { id as idLocale, enUS } from "date-fns/locale";

import type { GeoDistributionData } from "@/features/trends/types/geoDistribution.types";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

function MapLoadingFallback() {
  const { t } = useTranslation();
  return (
    <div className="flex h-full w-full items-center justify-center bg-slate-50 dark:bg-slate-950 text-sm text-slate-400 dark:text-slate-500">
      {t.overviewWidgets.geoDistribution.loadingMap}
    </div>
  );
}

const LocationMapLeaflet = dynamic(() => import("./LocationMapLeaflet"), {
  ssr: false,
  loading: MapLoadingFallback,
});

interface Props {
  data: GeoDistributionData;
}

function formatDateTime(value: string, locale: Locale) {
  try {
    return format(new Date(value), "d MMM HH:mm", { locale });
  } catch {
    return value;
  }
}

export default function LocationMapChart({ data }: Props) {
  const { t, language } = useTranslation();
  const locale = language === "en" ? enUS : idLocale;
  const labels = t.overviewWidgets.geoDistribution;
  const isEmpty = data.places.length === 0;

  const topPlaces = [...data.places].sort((a, b) => b.total_mentions - a.total_mentions).slice(0, 5);
  const totalMentions = data.places.reduce((sum, p) => sum + p.total_mentions, 0);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
            <MapPin size={17} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{labels.title}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {labels.descLine
                .replace("{matched}", String(data.total_places_matched))
                .replace("{checked}", String(data.total_places_checked))}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-5">
        <div className="flex items-start gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-3">
          <Info size={14} className="mt-0.5 shrink-0 text-indigo-500" />
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {labels.infoBanner
              .replace("{from}", formatDateTime(data.date_from, locale))
              .replace("{to}", formatDateTime(data.date_to, locale))}
          </p>
        </div>
      </div>

      {isEmpty ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{labels.empty}</p>
      ) : (
        <>
          <div className="h-96 w-full px-6 pt-4">
            <div className="h-full w-full overflow-hidden rounded-xl">
              <LocationMapLeaflet places={data.places} />
            </div>
          </div>
          <p className="px-6 pt-2 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-indigo-500/45 ring-1 ring-indigo-500 align-middle" />
            {labels.legendLabel}
          </p>

          <div className="px-6 py-5">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {labels.topLocationsTitle}
            </h3>
            <div className="space-y-2">
              {topPlaces.map((place, i) => {
                const pct = totalMentions > 0 ? (place.total_mentions / totalMentions) * 100 : 0;
                return (
                  <div key={place.place} className="flex items-center gap-3">
                    <span className="w-4 shrink-0 text-xs font-semibold text-slate-400 dark:text-slate-500">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-medium text-slate-700 dark:text-slate-300">{place.place}</span>
                        <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                          {place.total_mentions} {labels.mentionsUnit} · {place.from_posts} {labels.postsUnit} ·{" "}
                          {place.from_comments} {labels.commentsUnit}
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${Math.max(pct, 2)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
