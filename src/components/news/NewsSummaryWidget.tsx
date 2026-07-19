"use client";

import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { BarChart3, Globe2, Info, Newspaper, PieChart, Tags } from "lucide-react";

import type { NewsAnalysisSummary } from "@/features/news/types/summary.types";
import { CATEGORICAL_PALETTE, OTHER_COLOR } from "@/lib/chartColors";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", bar: "bg-red-500" },
};

// PERSON/ORGANIZATION/LOCATION/EVENT dipetakan ke slot pertama
// CATEGORICAL_PALETTE (indigo/sky/teal/pink) — dipakai konsisten di badge
// filter tipe & bar entitas supaya satu tipe entitas selalu punya warna yang
// sama di seluruh widget ini. DATE (metadata NER, bukan topik) sengaja
// netral/abu-abu, bukan warna palet.
const ENTITY_TYPE_COLOR: Record<string, { bg: string; text: string; activeBg: string; activeText: string; hex: string }> = {
  PERSON: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-400", activeBg: "bg-indigo-600", activeText: "text-white", hex: CATEGORICAL_PALETTE[0] },
  ORGANIZATION: { bg: "bg-sky-50 dark:bg-sky-950/40", text: "text-sky-700 dark:text-sky-400", activeBg: "bg-sky-600", activeText: "text-white", hex: CATEGORICAL_PALETTE[1] },
  LOCATION: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700 dark:text-teal-400", activeBg: "bg-teal-600", activeText: "text-white", hex: CATEGORICAL_PALETTE[2] },
  EVENT: { bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-700 dark:text-pink-400", activeBg: "bg-pink-600", activeText: "text-white", hex: CATEGORICAL_PALETTE[3] },
  DATE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", activeBg: "bg-slate-600", activeText: "text-white", hex: OTHER_COLOR },
};

function entityColor(type: string) {
  return ENTITY_TYPE_COLOR[type] ?? { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", activeBg: "bg-slate-600", activeText: "text-white", hex: OTHER_COLOR };
}

const MAX_ENTITY_ROWS = 8;

function SectionHeader({ icon: Icon, title, subtitle }: { icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
        <Icon size={17} className="text-indigo-600" />
      </div>
      <div>
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tooltip }: { icon: LucideIcon; label: string; value: string; tooltip?: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        <Icon size={16} className="text-indigo-600" />
      </div>
      <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
        {tooltip && (
          <span title={tooltip} className="shrink-0 cursor-help">
            <Info size={11} />
          </span>
        )}
      </div>
      <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

interface Props {
  data: NewsAnalysisSummary;
}

export default function NewsSummaryWidget({ data }: Props) {
  const { t, language } = useTranslation();
  const SENTIMENT_LABEL: Record<string, string> = {
    positif: t.sentimentPie.positive,
    netral: t.sentimentPie.neutral,
    negatif: t.sentimentPie.negative,
  };
  const locale = language === "id" ? "id-ID" : "en-US";
  const { total_articles, total_analyzed, sentiment, trending_entities, sources } = data;
  const byType = Object.entries(trending_entities.by_type).sort((a, b) => b[1] - a[1]);

  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filteredEntities = useMemo(() => {
    const sorted = [...trending_entities.top].sort((a, b) => b.mentions - a.mentions);
    return typeFilter ? sorted.filter((e) => e.type === typeFilter) : sorted;
  }, [trending_entities.top, typeFilter]);

  const shownEntities = filteredEntities.slice(0, MAX_ENTITY_ROWS);
  const maxMentions = Math.max(...shownEntities.map((e) => e.mentions), 1);

  return (
    <div className="space-y-6">
      {/* Ringkasan Artikel */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Newspaper} label={t.newsSummary.totalArticles} value={total_articles.toLocaleString(locale)} />
        <StatCard
          icon={BarChart3}
          label={t.newsSummary.analyzed}
          value={total_analyzed.toLocaleString(locale)}
          tooltip={t.newsSummary.analyzedTooltip}
        />
        <StatCard
          icon={Tags}
          label={t.newsSummary.entities}
          value={String(trending_entities.top.length)}
          tooltip={t.newsSummary.entitiesTooltip}
        />
        <StatCard
          icon={Globe2}
          label={t.newsSummary.sources}
          value={String(sources.length)}
          tooltip={t.newsSummary.sourcesTooltip}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sentimen Berita */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm lg:col-span-1">
          <SectionHeader icon={PieChart} title={t.newsSummary.sentimentTitle} subtitle={t.newsSummary.sentimentSubtitle} />
          <div className="p-6">
            {total_analyzed > 0 ? (
              <>
                <div className="mb-2 flex items-center justify-end">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t.newsSummary.articlesAnalyzed.replace("{count}", String(total_analyzed))}
                  </span>
                </div>
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  {(["positif", "netral", "negatif"] as const).map((key) => (
                    <div key={key} className={SENTIMENT_COLOR[key].bar} style={{ width: `${sentiment[key].percentage}%` }} />
                  ))}
                </div>
                <div className="mt-3 space-y-2">
                  {(["positif", "netral", "negatif"] as const).map((key) => (
                    <div key={key} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-400">
                        <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[key].bar}`} />
                        {SENTIMENT_LABEL[key]}
                      </span>
                      <span className={`font-semibold ${SENTIMENT_COLOR[key].text}`}>
                        {sentiment[key].percentage.toFixed(1)}% ({sentiment[key].count})
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t.newsSummary.noEntities}</p>
            )}
          </div>
        </div>

        {/* Entitas Trending */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm lg:col-span-2">
          <SectionHeader icon={Tags} title={t.newsSummary.entitiesTitle} subtitle={t.newsSummary.entitiesSubtitle} />
          <div className="p-6">
            {byType.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setTypeFilter(null)}
                  className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                    typeFilter === null ? "bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {t.newsTrendingTab.filterAll}
                </button>
                {byType.map(([type, count]) => {
                  const active = typeFilter === type;
                  const c = entityColor(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTypeFilter(active ? null : type)}
                      className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${active ? `${c.activeBg} ${c.activeText}` : `${c.bg} ${c.text} hover:opacity-80`}`}
                    >
                      {type} {count}
                    </button>
                  );
                })}
              </div>
            )}

            {shownEntities.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t.newsSummary.noEntities}</p>
            ) : (
              <div className="space-y-3">
                {shownEntities.map((entity) => {
                  const c = entityColor(entity.type);
                  const pct = Math.round((entity.mentions / maxMentions) * 100);
                  return (
                    <div key={`${entity.type}-${entity.text}`}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-800 dark:text-slate-200">{entity.text}</span>
                        <span className="shrink-0 text-slate-500 dark:text-slate-400">
                          {entity.mentions} {t.newsSummary.mentionsUnit}
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: c.hex }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sumber Media */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <SectionHeader icon={Globe2} title={t.newsSummary.sourcesTitle} subtitle={t.newsSummary.sourcesSubtitle} />
        <div className="p-6">
          {sources.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">{t.newsSummary.noSources}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sources
                .slice()
                .sort((a, b) => b.articles - a.articles)
                .map((source) => (
                  <span
                    key={source.domain}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    {source.domain}
                    <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {source.articles}
                    </span>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
