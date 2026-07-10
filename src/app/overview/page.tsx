"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
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
import { getSettings, type OverviewWidgetKey, type OverviewWidgetVisibility } from "@/features/settings/hooks/useSettings";

const WIDGET_COMPONENTS: Record<OverviewWidgetKey, () => React.ReactNode> = {
  sentiment: () => <OverallSentimentSection />,
  platformVolume: () => <PlatformVolumeSection />,
  trendingSearches: () => <TrendingSearchesSection />,
  youtubeVisuals: () => <VisualsSection />,
  trendDiscovery: () => <TrendDiscoverySection />,
  trendDiscoveryTwitter: () => <TrendDiscoveryBySourceSection source="twitter" />,
  trendDiscoveryTiktok: () => <TrendDiscoveryBySourceSection source="tiktok" />,
  trendDiscoveryInstagram: () => <TrendDiscoveryBySourceSection source="instagram" />,
  trendWordCount: () => <TrendWordCountSection />,
  trendTimeline: () => <TrendTimelineSection />,
  trendNumberPerSearch: () => <TrendNumberPerSearchSection />,
  geoDistribution: () => (
    <div className="lg:col-span-3">
      <GeoDistributionSection />
    </div>
  ),
  trendVisuals: () => <TrendVisualsSection />,
  trendFeed: () => <TrendFeedSection />,
};

export default function OverviewPage() {
  const router = useRouter();
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
          <p className="text-sm text-slate-500 dark:text-slate-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Overview</h1>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
            Ringkasan aktivitas & sentimen dari seluruh platform yang dipantau
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {order.map((key) => {
            if (!widgets[key]) return null;
            const render = WIDGET_COMPONENTS[key];
            if (!render) return null;
            return <Fragment key={key}>{render()}</Fragment>;
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
