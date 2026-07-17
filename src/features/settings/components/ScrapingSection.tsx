"use client";

import { CheckCircle2, Info } from "lucide-react";
import { AppSettings } from "../hooks/useSettings";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  settings: AppSettings;
  update: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onSave: () => void;
  saved: boolean;
}

const PLATFORMS = [
  { value: "youtube",   label: "YouTube",   color: "bg-red-500" },
  { value: "tiktok",   label: "TikTok",    color: "bg-black" },
  { value: "instagram", label: "Instagram", color: "bg-pink-500" },
  { value: "facebook",  label: "Facebook",  color: "bg-blue-600" },
];

function NumberInput({
  label, hint, value, min, max, onChange,
}: {
  label: string; hint: string; value: number;
  min: number; max: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value))))}
          className="h-10 w-24 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 text-sm font-mono text-slate-800 dark:text-slate-200 focus:border-indigo-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition text-center"
        />
        <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>
      </div>
    </div>
  );
}

export default function ScrapingSection({ settings, update, onSave, saved }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      {/* Default platform */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.scraping.defaultPlatformTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.settings.scraping.defaultPlatformDesc}</p>
        </div>
        <div className="px-6 py-6 flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() => update("defaultPlatform", p.value)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
                settings.defaultPlatform === p.value
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${p.color}`} />
              {p.label}
              {settings.defaultPlatform === p.value && (
                <CheckCircle2 size={13} className="text-indigo-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Data collection params */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.scraping.scrapingParamsTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Nilai default yang dipakai saat mengumpulkan data baru. Semakin besar = semakin banyak data & waktu lebih lama.
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <NumberInput
              label={t.settings.scraping.maxPages}
              hint="halaman hasil pencarian"
              value={settings.maxPages}
              min={1}
              max={50}
              onChange={(v) => update("maxPages", v)}
            />
            <NumberInput
              label={t.settings.scraping.maxCommentsPerVideo}
              hint="komentar per konten"
              value={settings.maxCommentsPerVideo}
              min={10}
              max={1000}
              onChange={(v) => update("maxCommentsPerVideo", v)}
            />
            <NumberInput
              label={t.settings.scraping.maxCommentPages}
              hint="halaman komentar"
              value={settings.maxCommentPages}
              min={1}
              max={20}
              onChange={(v) => update("maxCommentPages", v)}
            />
          </div>

          {/* Estimasi */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-4">
            <div className="flex items-start gap-2">
              <Info size={14} className="mt-0.5 shrink-0 text-indigo-500" />
              <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed space-y-1">
                <p>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Estimasi data:</span>{" "}
                  ~{settings.maxPages * 10} video ×{" "}
                  {settings.maxCommentsPerVideo} komentar ={" "}
                  <span className="font-semibold text-indigo-600">
                    ~{(settings.maxPages * 10 * settings.maxCommentsPerVideo).toLocaleString()} komentar
                  </span>
                </p>
                <p>
                  Waktu pengumpulan data: <span className="font-semibold text-slate-700 dark:text-slate-300">
                    ~{Math.ceil((settings.maxPages * settings.maxCommentsPerVideo) / 60)} menit
                  </span> (tergantung koneksi dan platform)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search / trend fetch params */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-800 px-6 py-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">{t.settings.scraping.dataParamsTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Jumlah hasil & rentang waktu default untuk pencarian, trend, dan discover
          </p>
        </div>

        <div className="px-6 py-6 space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <NumberInput
              label={t.settings.scraping.searchResultLimit}
              hint="analyze, compare, feed"
              value={settings.searchResultLimit}
              min={1}
              max={100}
              onChange={(v) => update("searchResultLimit", v)}
            />
            <NumberInput
              label={t.settings.scraping.trendVisualsLimit}
              hint="postingan visual lintas platform"
              value={settings.trendVisualsLimit}
              min={1}
              max={50}
              onChange={(v) => update("trendVisualsLimit", v)}
            />
            <NumberInput
              label={t.settings.scraping.discoverMaxResults}
              hint="akun per pencarian discover"
              value={settings.discoverMaxResults}
              min={1}
              max={50}
              onChange={(v) => update("discoverMaxResults", v)}
            />
            <NumberInput
              label={t.settings.scraping.trendWindowHours}
              hint="jam ke belakang"
              value={settings.trendWindowHours}
              min={1}
              max={168}
              onChange={(v) => update("trendWindowHours", v)}
            />
            <NumberInput
              label={t.settings.scraping.trendTopN}
              hint="keyword dilacak di feed/visuals"
              value={settings.trendTopN}
              min={1}
              max={30}
              onChange={(v) => update("trendTopN", v)}
            />
            <NumberInput
              label={t.settings.scraping.trendRankingTopN}
              hint="Number per Search/Filter"
              value={settings.trendRankingTopN}
              min={1}
              max={50}
              onChange={(v) => update("trendRankingTopN", v)}
            />
            <NumberInput
              label={t.settings.scraping.trendRankingDays}
              hint="rolling window (hari)"
              value={settings.trendRankingDays}
              min={1}
              max={30}
              onChange={(v) => update("trendRankingDays", v)}
            />
            <NumberInput
              label={t.settings.scraping.newsSummaryTopN}
              hint="ringkasan analisis berita"
              value={settings.newsSummaryTopN}
              min={1}
              max={50}
              onChange={(v) => update("newsSummaryTopN", v)}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow shadow-indigo-500/20 hover:from-indigo-700 hover:to-violet-700 transition"
        >
          {saved ? <><CheckCircle2 size={15} /> {t.common.saved}</> : t.settings.scraping.saveButton}
        </button>
      </div>
    </div>
  );
}
