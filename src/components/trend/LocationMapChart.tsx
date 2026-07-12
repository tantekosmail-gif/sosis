"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

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

export default function LocationMapChart({ data }: Props) {
  const { t } = useTranslation();
  const isEmpty = data.places.length === 0;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
            <MapPin size={17} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-slate-100">{t.overviewWidgets.geoDistribution.title}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {t.overviewWidgets.geoDistribution.descLine
                .replace("{matched}", String(data.total_places_matched))
                .replace("{checked}", String(data.total_places_checked))}
            </p>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <p className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.overviewWidgets.geoDistribution.empty}</p>
      ) : (
        <div className="h-96 w-full">
          <LocationMapLeaflet places={data.places} />
        </div>
      )}
    </div>
  );
}
