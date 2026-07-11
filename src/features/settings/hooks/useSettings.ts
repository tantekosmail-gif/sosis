"use client";

import { useState } from "react";

export interface OverviewWidgetVisibility {
  sentiment: boolean;
  platformVolume: boolean;
  trendingSearches: boolean;
  trendDiscovery: boolean;
  trendDiscoveryTwitter: boolean;
  trendDiscoveryTiktok: boolean;
  trendDiscoveryInstagram: boolean;
  youtubeVisuals: boolean;
  trendTimeline: boolean;
  trendWordCount: boolean;
  trendNumberPerSearch: boolean;
  geoDistribution: boolean;
  trendVisuals: boolean;
  trendFeed: boolean;
}

export type OverviewWidgetKey = keyof OverviewWidgetVisibility;

export type Theme = "light" | "dark";
export type Language = "id" | "en";

export interface AppSettings {
  // Appearance
  theme: Theme;
  language: Language;

  // AI
  anthropicApiKey: string;

  // Scraping defaults
  maxPages: number;
  maxCommentsPerVideo: number;
  maxCommentPages: number;

  // Search / trend fetch defaults
  searchResultLimit: number;
  trendVisualsLimit: number;
  discoverMaxResults: number;
  trendWindowHours: number;
  trendTopN: number;
  trendRankingTopN: number;
  trendRankingDays: number;
  newsSummaryTopN: number;

  // Notifications
  notifyOnAnalysisDone: boolean;
  notifyOnAISummaryDone: boolean;
  notifyOnError: boolean;

  // Platform default
  defaultPlatform: string;

  // Overview widget visibility
  overviewWidgets: OverviewWidgetVisibility;

  // Overview widget order (drives render order on the Overview page)
  overviewWidgetOrder: OverviewWidgetKey[];
}

const DEFAULT_OVERVIEW_WIDGETS: OverviewWidgetVisibility = {
  trendTimeline: true,
  trendWordCount: true,
  sentiment: true,
  platformVolume: true,
  trendingSearches: true,
  trendDiscovery: true,
  trendDiscoveryTwitter: true,
  trendDiscoveryTiktok: true,
  trendDiscoveryInstagram: true,
  youtubeVisuals: true,
  trendNumberPerSearch: true,
  geoDistribution: true,
  trendVisuals: true,
  trendFeed: true,
};

const DEFAULT_OVERVIEW_WIDGET_ORDER: OverviewWidgetKey[] = [
  "sentiment",
  "trendWordCount",
  "trendTimeline",
  "trendingSearches",
  "trendVisuals",
  "platformVolume",
  "youtubeVisuals",
  "trendDiscovery",
  "trendDiscoveryTwitter",
  "trendDiscoveryTiktok",
  "trendDiscoveryInstagram",
  "trendNumberPerSearch",
  "trendFeed",
  "geoDistribution",
];

function reconcileOrder(stored: unknown): OverviewWidgetKey[] {
  const known = new Set<string>(DEFAULT_OVERVIEW_WIDGET_ORDER);
  const storedArr = Array.isArray(stored) ? (stored as string[]).filter((k) => known.has(k)) : [];
  const missing = DEFAULT_OVERVIEW_WIDGET_ORDER.filter((k) => !storedArr.includes(k));
  return [...storedArr, ...missing] as OverviewWidgetKey[];
}

const DEFAULTS: AppSettings = {
  theme: "light",
  language: "id",
  anthropicApiKey: "",
  maxPages: 5,
  maxCommentsPerVideo: 100,
  maxCommentPages: 3,
  searchResultLimit: 20,
  trendVisualsLimit: 12,
  discoverMaxResults: 10,
  trendWindowHours: 24,
  trendTopN: 6,
  trendRankingTopN: 15,
  trendRankingDays: 7,
  newsSummaryTopN: 15,
  notifyOnAnalysisDone: true,
  notifyOnAISummaryDone: true,
  notifyOnError: true,
  defaultPlatform: "youtube",
  overviewWidgets: DEFAULT_OVERVIEW_WIDGETS,
  overviewWidgetOrder: DEFAULT_OVERVIEW_WIDGET_ORDER,
};

const STORAGE_KEY = "app_settings";

function mergeWithDefaults(stored: Partial<AppSettings>): AppSettings {
  return {
    ...DEFAULTS,
    ...stored,
    overviewWidgets: { ...DEFAULT_OVERVIEW_WIDGETS, ...stored.overviewWidgets },
    overviewWidgetOrder: reconcileOrder(stored.overviewWidgetOrder),
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(getSettings);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {}
  }

  function reset() {
    setSettings(DEFAULTS);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  return { settings, update, save, reset, saved };
}

export function getSettings(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return mergeWithDefaults(JSON.parse(stored));
  } catch {}
  return DEFAULTS;
}

// Persists just the theme immediately, independent of the settings form's
// explicit Save flow — a theme toggle is expected to apply instantly.
export function setThemeSetting(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getSettings(), theme }));
  } catch {}
}

// Persists just the language immediately — a language switch is expected to
// apply instantly, same as the theme toggle.
export function setLanguageSetting(language: Language) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getSettings(), language }));
  } catch {}
}

// Persists a single widget's visibility immediately — closing a widget from
// the Overview page is expected to stick without visiting Settings > Save.
export function setOverviewWidgetVisibility(key: OverviewWidgetKey, visible: boolean) {
  try {
    const current = getSettings();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...current,
        overviewWidgets: { ...current.overviewWidgets, [key]: visible },
      })
    );
  } catch {}
}
