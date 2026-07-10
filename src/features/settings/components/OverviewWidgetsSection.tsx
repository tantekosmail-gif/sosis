"use client";

import { CheckCircle2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { AppSettings, OverviewWidgetKey } from "../hooks/useSettings";

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
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
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

function WidgetRow({
  title, description, checked, onChange, onMoveUp, onMoveDown, disableUp, disableDown,
}: {
  title: string; description: string; checked: boolean; onChange: (v: boolean) => void;
  onMoveUp: () => void; onMoveDown: () => void; disableUp: boolean; disableDown: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <GripVertical size={16} className="shrink-0 text-slate-300" />

      <div className="flex shrink-0 flex-col">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={disableUp}
          aria-label="Pindah ke atas"
          className="rounded p-0.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronUp size={15} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={disableDown}
          aria-label="Pindah ke bawah"
          className="rounded p-0.5 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronDown size={15} />
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{title}</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{description}</p>
      </div>

      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const WIDGET_META: Record<OverviewWidgetKey, { title: string; description: string }> = {
  sentiment: { title: "Sentimen Publik Gabungan", description: "Sentiment bar agregat dari semua platform" },
  platformVolume: { title: "Volume Post & Komentar per Platform", description: "Grafik volume post & komentar per platform" },
  trendingSearches: { title: "Pencarian Trending (Google Trends)", description: "Top pencarian Google Trends (YouTube)" },
  trendDiscovery: { title: "Trend Discovery (Gabungan)", description: "Topik tervalidasi lintas semua sumber" },
  trendDiscoveryTwitter: { title: "Twitter/X Trends", description: "Topik trending native Twitter/X" },
  trendDiscoveryTiktok: { title: "TikTok Trends", description: "Topik hasil sapuan akun TikTok" },
  trendDiscoveryInstagram: { title: "Instagram Trends", description: "Topik hasil sapuan akun Instagram" },
  youtubeVisuals: { title: "Video Viral (YouTube)", description: "Preview video viral dengan thumbnail besar & rail navigasi" },
  trendTimeline: { title: "Timeline Mentions per Jam", description: "Grafik mentions per jam untuk keyword trending teratas" },
  trendWordCount: { title: "Ranking Keyword Trending", description: "Ranking total mentions per keyword trending" },
  trendNumberPerSearch: { title: "Mentions per Keyword (7 Hari)", description: "Bar chart total mentions per keyword, rolling 7 hari terakhir" },
  geoDistribution: { title: "Peta Lokasi Mentions", description: "Peta sebaran lokasi mentions 24 jam terakhir" },
  trendVisuals: { title: "Postingan Visual (Lintas Platform)", description: "Postingan visual lintas platform untuk keyword trending, bisa pindah keyword" },
  trendFeed: { title: "Feed Post & Komentar", description: "Feed post & komentar lintas platform, keyword mengikuti ranking Keyword Trending" },
};

export default function OverviewWidgetsSection({ settings, update, onSave, saved }: Props) {
  const order = settings.overviewWidgetOrder;

  function setWidget(key: OverviewWidgetKey, value: boolean) {
    update("overviewWidgets", { ...settings.overviewWidgets, [key]: value });
  }

  function moveWidget(key: OverviewWidgetKey, direction: -1 | 1) {
    const index = order.indexOf(key);
    const nextIndex = index + direction;
    if (index === -1 || nextIndex < 0 || nextIndex >= order.length) return;

    const next = [...order];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    update("overviewWidgetOrder", next);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Widget Overview</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Atur widget mana saja yang tampil, dan urutannya, di halaman Overview</p>
        </div>

        <div className="px-6">
          {order.map((key, index) => {
            const meta = WIDGET_META[key];
            if (!meta) return null;

            return (
              <WidgetRow
                key={key}
                title={meta.title}
                description={meta.description}
                checked={settings.overviewWidgets[key]}
                onChange={(v) => setWidget(key, v)}
                onMoveUp={() => moveWidget(key, -1)}
                onMoveDown={() => moveWidget(key, 1)}
                disableUp={index === 0}
                disableDown={index === order.length - 1}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
        >
          {saved ? <><CheckCircle2 size={15} /> Tersimpan!</> : "Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}
