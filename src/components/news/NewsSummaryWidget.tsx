"use client";

import type { LucideIcon } from "lucide-react";
import { AlertTriangle, BarChart3, Globe2, Newspaper, Tags } from "lucide-react";

import type { NewsAnalysisSummary } from "@/features/news/types/summary.types";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", bar: "bg-red-500" },
};

const ENTITY_TYPE_COLOR: Record<string, { bg: string; text: string }> = {
  PERSON: { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700" },
  ORGANIZATION: { bg: "bg-violet-50 dark:bg-violet-950/40", text: "text-violet-700" },
  LOCATION: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700" },
  DATE: { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" },
  EVENT: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700" },
};

function entityColor(type: string) {
  return ENTITY_TYPE_COLOR[type] ?? { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-600 dark:text-slate-400" };
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

interface Props {
  data: NewsAnalysisSummary;
}

export default function NewsSummaryWidget({ data }: Props) {
  const { total_articles, total_analyzed, fully_analyzed, sentiment, trending_entities, sources } = data;
  const byType = Object.entries(trending_entities.by_type).sort((a, b) => b[1] - a[1]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
          <BarChart3 size={17} className="text-indigo-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Ringkasan Analisis Berita</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Sentimen, entitas, dan sumber dari artikel yang terkumpul</p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Newspaper} label="Total Artikel" value={total_articles.toLocaleString("id-ID")} />
          <StatCard icon={BarChart3} label="Dianalisis" value={total_analyzed.toLocaleString("id-ID")} />
          <StatCard icon={Tags} label="Entitas" value={String(trending_entities.top.length)} />
          <StatCard icon={Globe2} label="Sumber" value={String(sources.length)} />
        </div>

        {!fully_analyzed && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/40 px-3.5 py-2.5 text-xs text-amber-700">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            <span>
              Baru {total_analyzed} dari {total_articles} artikel yang dianalisis, hasil di bawah ini masih parsial.
            </span>
          </div>
        )}

        {total_analyzed > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sentimen Berita</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{total_analyzed} artikel dianalisis</span>
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
            {sentiment.caveat && <p className="mt-2 text-[11px] leading-relaxed text-slate-400 dark:text-slate-500">{sentiment.caveat}</p>}
          </div>
        )}

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Entitas Trending</span>
            <div className="flex flex-wrap gap-1.5">
              {byType.map(([type, count]) => (
                <span key={type} className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${entityColor(type).bg} ${entityColor(type).text}`}>
                  {type} {count}
                </span>
              ))}
            </div>
          </div>
          {trending_entities.top.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada entitas yang terdeteksi</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {trending_entities.top.map((entity) => (
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

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sumber Media</p>
          {sources.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada sumber tercatat</p>
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
