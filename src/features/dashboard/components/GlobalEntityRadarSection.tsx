"use client";

import { Loader2 } from "lucide-react";

import TopicEntitiesCard from "@/components/topic/TopicEntitiesCard";
import { useGlobalEntities } from "../hooks/useGlobalEntities";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function GlobalEntityRadarSection() {
  const { entities, loading } = useGlobalEntities();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <TopicEntitiesCard
      entities={entities}
      title={t.overviewWidgets.entityRadar.globalTitle}
      description={t.overviewWidgets.entityRadar.globalDesc}
    />
  );
}
