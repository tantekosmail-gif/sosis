"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, Globe2, Info, Newspaper, PieChart, Tags } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

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
// jumlah per tipe, chip entitas, dan bar chart di bawah supaya satu tipe
// entitas selalu punya warna yang sama di seluruh widget ini. DATE (metadata
// NER, bukan topik) sengaja netral/abu-abu, bukan warna palet.
const ENTITY_TYPE_COLOR: Record<string, { bg: string; text: string; hex: string }> = {
  PERSON: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700", hex: CATEGORICAL_PALETTE[0] },
  ORGANIZATION: { bg: "bg-sky-50 dark:bg-sky-950/40", text: "text-sky-700", hex: CATEGORICAL_PALETTE[1] },
  LOCATION: { bg: "bg-teal-50 dark:bg-teal-950/40", text: "text-teal-700", hex: CATEGORICAL_PALETTE[2] },
  EVENT: { bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-700", hex: CATEGORICAL_PALETTE[3] },
  DATE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", hex: OTHER_COLOR },
};

function entityColor(type: string) {
  return ENTITY_TYPE_COLOR[type] ?? { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400", hex: OTHER_COLOR };
}

const MAX_ENTITY_BARS = 8;

function EntityTooltip({ active, payload }: any) {
  const { t } = useTranslation();
  if (!active || !payload?.length) return null;
  const entity = payload[0]?.payload;
  if (!entity) return null;
  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-slate-700 dark:text-slate-300">{entity.text}</p>
      <p className="mt-0.5 text-slate-400 dark:text-slate-500">{entity.type}</p>
      <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200">{entity.mentions} {t.newsSummary.mentionsUnit}</p>
    </div>
  );
}

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
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
        {tooltip && (
          <span title={tooltip} className="shrink-0 cursor-help">
            <Info size={11} />
          </span>
        )}
      </div>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
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

  // Bar chart cuma nyaman utk beberapa entitas teratas — sisanya (kalau ada)
  // tetap tampil sebagai chip compact di bawah chart, bukan dibuang.
  const sortedEntities = [...trending_entities.top].sort((a, b) => b.mentions - a.mentions);
  const chartEntities = sortedEntities.slice(0, MAX_ENTITY_BARS);
  const remainingEntities = sortedEntities.slice(MAX_ENTITY_BARS);

  return (
    <div className="space-y-6">
      {/* Ringkasan Artikel */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <SectionHeader icon={BarChart3} title={t.newsSummary.articleSummaryTitle} subtitle={t.newsSummary.articleSummarySubtitle} />
        <div className="space-y-4 p-6">
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
        </div>
      </div>

      {/* Sentimen Berita */}
      {total_analyzed > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
          <SectionHeader icon={PieChart} title={t.newsSummary.sentimentTitle} subtitle={t.newsSummary.sentimentSubtitle} />
          <div className="p-6">
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
            <div className="mt-2 flex flex-wrap gap-2">
              {(["positif", "netral", "negatif"] as const).map((key) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[key].bg} ${SENTIMENT_COLOR[key].text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[key].bar}`} />
                  {SENTIMENT_LABEL[key]} {sentiment[key].percentage.toFixed(1)}% ({sentiment[key].count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Entitas Trending */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <SectionHeader icon={Tags} title={t.newsSummary.entitiesTitle} subtitle={t.newsSummary.entitiesSubtitle} />
        <div className="p-6">
          {byType.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {byType.map(([type, count]) => (
                <span key={type} className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${entityColor(type).bg} ${entityColor(type).text}`}>
                  {type} {count}
                </span>
              ))}
            </div>
          )}
          {trending_entities.top.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">{t.newsSummary.noEntities}</p>
          ) : (
            <>
              <div style={{ height: Math.max(140, chartEntities.length * 32 + 16) }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartEntities} layout="vertical" margin={{ top: 4, right: 16, left: 4, bottom: 0 }} barSize={16}>
                    <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                    <YAxis
                      type="category"
                      dataKey="text"
                      width={110}
                      interval={0}
                      tick={{ fontSize: 11, fill: "#94a3b8" }}
                      tickFormatter={(value: string) => (value.length > 15 ? `${value.slice(0, 15)}…` : value)}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<EntityTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.15)" }} />
                    <Bar dataKey="mentions" radius={[0, 4, 4, 0]}>
                      {chartEntities.map((entity, i) => (
                        <Cell key={i} fill={entityColor(entity.type).hex} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {remainingEntities.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {remainingEntities.map((entity) => (
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
            </>
          )}
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
