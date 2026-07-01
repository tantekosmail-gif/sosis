"use client";

import { useEffect, useState } from "react";

export interface AppSettings {
  // AI
  anthropicApiKey: string;

  // Scraping defaults
  maxPages: number;
  maxCommentsPerVideo: number;
  maxCommentPages: number;

  // Notifications
  notifyOnAnalysisDone: boolean;
  notifyOnAISummaryDone: boolean;
  notifyOnError: boolean;

  // Platform default
  defaultPlatform: string;
}

const DEFAULTS: AppSettings = {
  anthropicApiKey: "",
  maxPages: 5,
  maxCommentsPerVideo: 100,
  maxCommentPages: 3,
  notifyOnAnalysisDone: true,
  notifyOnAISummaryDone: true,
  notifyOnError: true,
  defaultPlatform: "youtube",
};

const STORAGE_KEY = "app_settings";

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULTS, ...JSON.parse(stored) });
      }
    } catch {}
  }, []);

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
    if (stored) return { ...DEFAULTS, ...JSON.parse(stored) };
  } catch {}
  return DEFAULTS;
}
