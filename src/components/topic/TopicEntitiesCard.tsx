"use client";

import { Tags } from "lucide-react";

import { useTranslation } from "@/lib/i18n/LanguageProvider";

export interface TopicEntity {
  type: string;
  text: string;
  mentions: number;
}

const ENTITY_TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  PERSON: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-300" },
  ORGANIZATION: { bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700 dark:text-violet-300" },
  LOCATION: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300" },
  DATE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  EVENT: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300" },
};

function entityColor(type: string) {
  return ENTITY_TYPE_COLOR[type] ?? { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" };
}

export default function TopicEntitiesCard({
  entities,
  title,
  description,
}: {
  entities: TopicEntity[];
  title?: string;
  description?: string;
}) {
  const { t } = useTranslation();
  const resolvedTitle = title ?? t.overviewWidgets.entityRadar.defaultTitle;
  const resolvedDescription = description ?? t.overviewWidgets.entityRadar.defaultDesc;

  return (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center gap-2">
        <Tags size={16} className="text-indigo-600" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{resolvedTitle}</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">{resolvedDescription}</p>

      {entities.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-6 text-center text-sm text-slate-400 dark:text-slate-500">
          {t.overviewWidgets.entityRadar.empty}
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {entities.map((entity) => (
            <span
              key={`${entity.type}-${entity.text}`}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${entityColor(entity.type).bg} ${entityColor(entity.type).text}`}
            >
              {entity.text}
              <span className="text-[10px] opacity-70">×{entity.mentions}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
