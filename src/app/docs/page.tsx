"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Compass,
  Globe,
  Home,
  Lightbulb,
  MessageCircle,
  Newspaper,
  Rocket,
  Settings,
} from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import IntroSection from "@/features/docs/sections/IntroSection";
import GettingStartedSection from "@/features/docs/sections/GettingStartedSection";
import OverviewSection from "@/features/docs/sections/OverviewSection";
import PlatformsSection from "@/features/docs/sections/PlatformsSection";
import NewsSection from "@/features/docs/sections/NewsSection";
import CompareSection from "@/features/docs/sections/CompareSection";
import AIChatSection from "@/features/docs/sections/AIChatSection";
import SettingsSection from "@/features/docs/sections/SettingsSection";
import TipsSection from "@/features/docs/sections/TipsSection";

const TABS = [
  { key: "intro", label: "Pengenalan", icon: BookOpen, description: "Apa itu MediaWatch" },
  { key: "start", label: "Mulai Menggunakan", icon: Rocket, description: "Login & navigasi" },
  { key: "overview", label: "Dashboard Overview", icon: Home, description: "Ringkasan lintas platform" },
  { key: "platforms", label: "Monitoring Media Sosial", icon: Compass, description: "YouTube, Instagram, dll." },
  { key: "news", label: "Berita", icon: Newspaper, description: "Trending & pencarian berita" },
  { key: "compare", label: "Bandingkan Platform", icon: Globe, description: "Satu topik, banyak platform" },
  { key: "ai", label: "Cari Topik AI", icon: MessageCircle, description: "Asisten chat trending" },
  { key: "settings", label: "Pengaturan", icon: Settings, description: "Akun, AI, & analisis" },
  { key: "tips", label: "Tips & Catatan", icon: Lightbulb, description: "Hal penting yang perlu diketahui" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const SECTION_COMPONENTS: Record<TabKey, React.ComponentType> = {
  intro: IntroSection,
  start: GettingStartedSection,
  overview: OverviewSection,
  platforms: PlatformsSection,
  news: NewsSection,
  compare: CompareSection,
  ai: AIChatSection,
  settings: SettingsSection,
  tips: TipsSection,
};

export default function DocsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("intro");
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  if (!authChecked) return null;

  const active = TABS.find((t) => t.key === activeTab)!;
  const ActiveSection = SECTION_COMPONENTS[activeTab];

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dokumentasi</h1>
        <p className="mt-0.5 text-sm text-slate-400">Panduan lengkap penggunaan MediaWatch</p>
      </div>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside className="w-full lg:w-64 lg:shrink-0">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-sm lg:flex-col lg:space-y-1 lg:overflow-visible">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all lg:w-full ${
                    isActive ? "bg-indigo-600 text-white shadow shadow-indigo-500/30" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                  <div className="min-w-0">
                    <p className="whitespace-nowrap text-sm font-medium leading-none">{tab.label}</p>
                    <p className={`mt-1 hidden whitespace-nowrap text-[11px] leading-none lg:block ${isActive ? "text-indigo-100" : "text-slate-400"}`}>
                      {tab.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 space-y-6">
          <div>
            <h2 className="font-semibold text-slate-900">{active.label}</h2>
            <p className="mt-0.5 text-xs text-slate-400">{active.description}</p>
          </div>
          <ActiveSection />
        </div>
      </div>
    </DashboardLayout>
  );
}
