"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import SmartSearchForm from "@/features/search/components/SmartSearchForm";
import SearchResultsSection from "@/features/dashboard/sections/SearchResultsSection";
import OverallSentimentSection from "@/features/dashboard/components/OverallSentimentSection";
import PlatformVolumeSection from "@/features/dashboard/components/PlatformVolumeSection";
import TrendingSearchesSection from "@/features/youtube/components/TrendingSearchesSection";
import VisualsSection from "@/features/youtube/components/VisualsSection";
import TrendDiscoverySection from "@/features/trends/components/TrendDiscoverySection";
import TrendDiscoveryBySourceSection from "@/features/trends/components/TrendDiscoveryBySourceSection";
import TrendTimelineSection from "@/features/trends/components/TrendTimelineSection";
import TrendWordCountSection from "@/features/trends/components/TrendWordCountSection";
import TrendNumberPerSearchSection from "@/features/trends/components/TrendNumberPerSearchSection";
import GeoDistributionSection from "@/features/trends/components/GeoDistributionSection";
import TrendVisualsSection from "@/features/trends/components/TrendVisualsSection";
import TrendFeedSection from "@/features/trends/components/TrendFeedSection";
import {
  getSettings,
  setOverviewWidgetVisibility,
  type OverviewWidgetKey,
  type OverviewWidgetVisibility,
} from "@/features/settings/hooks/useSettings";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

function RemovableWidget({ onClose, className, children }: { onClose: () => void; className?: string; children: ReactNode }) {
  return (
    <div className={`group relative${className ? ` ${className}` : ""}`}>
      <button
        onClick={onClose}
        aria-label="Tutup widget"
        className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-1.5 text-slate-400 opacity-0 shadow-sm backdrop-blur transition hover:bg-slate-100 hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100 dark:bg-slate-900/90 dark:hover:bg-slate-800"
      >
        <X size={14} />
      </button>
      {children}
    </div>
  );
}

const WIDGET_COMPONENTS: Record<OverviewWidgetKey, (onClose: () => void) => React.ReactNode> = {
  sentiment: (onClose) => (
    <RemovableWidget onClose={onClose} className="lg:col-span-3">
      <OverallSentimentSection />
    </RemovableWidget>
  ),
  platformVolume: (onClose) => <RemovableWidget onClose={onClose}><PlatformVolumeSection /></RemovableWidget>,
  trendingSearches: (onClose) => <RemovableWidget onClose={onClose}><TrendingSearchesSection /></RemovableWidget>,
  youtubeVisuals: (onClose) => <RemovableWidget onClose={onClose}><VisualsSection /></RemovableWidget>,
  trendDiscovery: (onClose) => <RemovableWidget onClose={onClose}><TrendDiscoverySection /></RemovableWidget>,
  trendDiscoveryTwitter: (onClose) => <RemovableWidget onClose={onClose}><TrendDiscoveryBySourceSection source="twitter" /></RemovableWidget>,
  trendDiscoveryTiktok: (onClose) => <RemovableWidget onClose={onClose}><TrendDiscoveryBySourceSection source="tiktok" /></RemovableWidget>,
  trendDiscoveryInstagram: (onClose) => <RemovableWidget onClose={onClose}><TrendDiscoveryBySourceSection source="instagram" /></RemovableWidget>,
  trendWordCount: (onClose) => <RemovableWidget onClose={onClose}><TrendWordCountSection /></RemovableWidget>,
  trendTimeline: (onClose) => <RemovableWidget onClose={onClose}><TrendTimelineSection /></RemovableWidget>,
  trendNumberPerSearch: (onClose) => <RemovableWidget onClose={onClose}><TrendNumberPerSearchSection /></RemovableWidget>,
  geoDistribution: (onClose) => (
    <RemovableWidget onClose={onClose} className="lg:col-span-3">
      <GeoDistributionSection />
    </RemovableWidget>
  ),
  trendVisuals: (onClose) => <RemovableWidget onClose={onClose}><TrendVisualsSection /></RemovableWidget>,
  trendFeed: (onClose) => <RemovableWidget onClose={onClose}><TrendFeedSection /></RemovableWidget>,
};

export default function OverviewPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [widgets, setWidgets] = useState<OverviewWidgetVisibility | null>(null);
  const [order, setOrder] = useState<OverviewWidgetKey[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    const settings = getSettings();
    setWidgets(settings.overviewWidgets);
    setOrder(settings.overviewWidgetOrder);
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth || !widgets) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.common.checkingAuth}</p>
        </div>
      </div>
    );
  }

  function handleRemoveWidget(key: OverviewWidgetKey) {
    setWidgets((prev) => (prev ? { ...prev, [key]: false } : prev));
    setOverviewWidgetVisibility(key, false);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.overview.title}</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.overview.subtitle}</p>
        </div>

        <SmartSearchForm />

        <SearchResultsSection />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {order.map((key) => {
            if (!widgets[key]) return null;
            const render = WIDGET_COMPONENTS[key];
            if (!render) return null;
            return <Fragment key={key}>{render(() => handleRemoveWidget(key))}</Fragment>;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
