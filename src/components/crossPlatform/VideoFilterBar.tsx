"use client";

import { Search } from "lucide-react";

import { useTranslation } from "@/lib/i18n/LanguageProvider";
import type { VideoAgeFilter } from "@/lib/videoAgeFilter";

const SELECT_CLASS =
  "h-10 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:bg-slate-900 transition sm:min-w-[160px]";

const DATE_INPUT_CLASS =
  "h-10 shrink-0 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:focus:bg-slate-900 dark:[color-scheme:dark] transition";

// Input date native tidak mendukung placeholder — browser selalu menampilkan
// format lokal (dd/mm/yyyy) saat kosong. Trik: saat kosong dan tidak fokus,
// teks format itu dibuat transparan dan label placeholder ("dari"/"sampai")
// ditampilkan di atasnya; saat fokus atau sudah terisi, kembali normal.
function DateInput({
  value,
  onChange,
  placeholder,
  ariaLabel,
  min,
  max,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel: string;
  min?: string;
  max?: string;
}) {
  return (
    <div className="relative shrink-0">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        min={min}
        max={max}
        aria-label={ariaLabel}
        className={`peer ${DATE_INPUT_CLASS} ${
          value
            ? "text-slate-800 dark:text-slate-200"
            : "text-transparent focus:text-slate-800 dark:focus:text-slate-200"
        }`}
      />
      {!value && (
        <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-400 peer-focus:hidden dark:text-slate-500">
          {placeholder}
        </span>
      )}
    </div>
  );
}

export default function VideoFilterBar({
  query,
  onQueryChange,
  channels,
  channel,
  onChannelChange,
  topics,
  topic,
  onTopicChange,
  age,
  onAgeChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: {
  query?: string;
  onQueryChange?: (value: string) => void;
  channels?: string[];
  channel?: string;
  onChannelChange?: (value: string) => void;
  topics?: string[];
  topic?: string;
  onTopicChange?: (value: string) => void;
  age?: VideoAgeFilter;
  onAgeChange?: (value: VideoAgeFilter) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const vf = t.videoFilterBar;

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      {onQueryChange && (
        <div className="relative min-w-[180px] flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={vf.searchPlaceholder}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900 transition"
          />
        </div>
      )}

      {channels && onChannelChange && (
        <select value={channel} onChange={(e) => onChannelChange(e.target.value)} className={SELECT_CLASS}>
          <option value="">{vf.allChannels}</option>
          {channels.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      )}

      {topics && onTopicChange && (
        <select value={topic} onChange={(e) => onTopicChange(e.target.value)} className={SELECT_CLASS}>
          <option value="">{vf.allTopics}</option>
          {topics.map((tp) => (
            <option key={tp} value={tp}>{tp}</option>
          ))}
        </select>
      )}

      {onAgeChange && (
        <select value={age} onChange={(e) => onAgeChange(e.target.value as VideoAgeFilter)} className={SELECT_CLASS}>
          <option value="all">{vf.allAges}</option>
          <option value="today">{vf.ageToday}</option>
          <option value="week">{vf.ageWeek}</option>
          <option value="month">{vf.ageMonth}</option>
        </select>
      )}

      <div className="flex shrink-0 items-center gap-2">
        <DateInput
          value={dateFrom}
          onChange={onDateFromChange}
          max={dateTo || undefined}
          placeholder={vf.dateFromPlaceholder}
          ariaLabel={vf.dateFromLabel}
        />
        <span className="text-xs text-slate-400 dark:text-slate-500">{vf.dateRangeSeparator}</span>
        <DateInput
          value={dateTo}
          onChange={onDateToChange}
          min={dateFrom || undefined}
          placeholder={vf.dateToPlaceholder}
          ariaLabel={vf.dateToLabel}
        />
      </div>
    </div>
  );
}
