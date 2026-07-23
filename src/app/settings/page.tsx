"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Bell, Flame, Info, LayoutGrid, Users } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import AccountSection from "@/features/settings/components/AccountSection";
import NotificationSection from "@/features/settings/components/NotificationSection";
import OverviewWidgetsSection from "@/features/settings/components/OverviewWidgetsSection";
import KeywordRecommendationsSection from "@/features/settings/components/KeywordRecommendationsSection";
import AboutSection from "@/features/settings/components/AboutSection";
import UsersSection from "@/features/users/components/UsersSection";
import { useSettings } from "@/features/settings/hooks/useSettings";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TABS = [
  { key: "account",      icon: User },
  { key: "notification", icon: Bell },
  { key: "widgets",      icon: LayoutGrid },
  { key: "keywordRecs",  icon: Flame },
  { key: "users",        icon: Users },
  { key: "about",        icon: Info },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabKey>("account");
  const [authChecked, setAuthChecked] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);
  const { settings, update, save, saved, dirty } = useSettings();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { router.replace("/login"); return; }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [dirty]);

  if (!authChecked) return null;

  const active = TABS.find((tab) => tab.key === activeTab)!;
  const activeLabels = t.settings.tabs[active.key];

  function handleTabClick(tab: TabKey) {
    if (tab === activeTab) return;
    if (dirty) {
      setPendingTab(tab);
      return;
    }
    setActiveTab(tab);
  }

  function confirmTabSwitch() {
    if (pendingTab) setActiveTab(pendingTab);
    setPendingTab(null);
  }

  return (
    <DashboardLayout>
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.settings.title}</h1>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Sidebar nav */}
        <aside className="w-full lg:w-56 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 shadow-sm lg:flex-col lg:space-y-1 lg:overflow-visible">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const labels = t.settings.tabs[tab.key];
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:w-full ${
                    isActive
                      ? "bg-indigo-600 text-white shadow shadow-indigo-500/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400 dark:text-slate-500"} />
                  <div>
                    <p className="whitespace-nowrap text-sm font-medium leading-none">{labels.label}</p>
                    <p className={`mt-0.5 hidden whitespace-nowrap text-[11px] leading-none lg:block ${isActive ? "text-indigo-200" : "text-slate-400 dark:text-slate-500"}`}>
                      {labels.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Section header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40">
              <active.icon size={18} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-900 dark:text-slate-100">{activeLabels.label}</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500">{activeLabels.description}</p>
            </div>
          </div>

          {activeTab === "account" && <AccountSection />}
          {activeTab === "notification" && (
            <NotificationSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "widgets" && (
            <OverviewWidgetsSection settings={settings} update={update} onSave={save} saved={saved} />
          )}
          {activeTab === "keywordRecs" && <KeywordRecommendationsSection />}
          {activeTab === "users" && <UsersSection />}
          {activeTab === "about" && <AboutSection />}
        </div>
      </div>

      <Dialog open={!!pendingTab} onOpenChange={(open) => !open && setPendingTab(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.settings.unsavedConfirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.settings.unsavedConfirmDesc}</p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPendingTab(null)}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.settings.unsavedConfirmNo}
            </button>
            <button
              type="button"
              onClick={confirmTabSwitch}
              className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {t.settings.unsavedConfirmYes}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
