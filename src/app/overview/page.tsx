"use client";

import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";

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
import GlobalShareOfVoiceSection from "@/features/dashboard/components/GlobalShareOfVoiceSection";
import TopicGrowthSection from "@/features/dashboard/components/TopicGrowthSection";
import GlobalEntityRadarSection from "@/features/dashboard/components/GlobalEntityRadarSection";
import NeedsAttentionSection from "@/features/dashboard/components/NeedsAttentionSection";
import DataHealthSection from "@/features/dashboard/components/DataHealthSection";
import ExportReportButton from "@/features/dashboard/components/ExportReportButton";
import {
  getSettings,
  setOverviewWidgetVisibility,
  type OverviewWidgetKey,
  type OverviewWidgetVisibility,
} from "@/features/settings/hooks/useSettings";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function RemovableWidget({
  onClose,
  className,
  children,
  ariaLabel,
}: {
  onClose: () => void;
  className?: string;
  children: ReactNode;
  ariaLabel: string;
}) {
  return (
    <div className={`group relative flex h-full flex-col${className ? ` ${className}` : ""}`}>
      <button
        onClick={onClose}
        aria-label={ariaLabel}
        className="absolute right-3 top-3 z-10 rounded-lg bg-white/90 p-1.5 text-slate-400 opacity-0 shadow-sm backdrop-blur transition hover:bg-slate-100 hover:text-red-500 group-hover:opacity-100 focus-visible:opacity-100 dark:bg-slate-900/90 dark:hover:bg-slate-800"
      >
        <X size={14} />
      </button>
      {children}
    </div>
  );
}

const WIDGET_COMPONENTS: Record<OverviewWidgetKey, (onClose: () => void, ariaLabel: string) => React.ReactNode> = {
  sentiment: (onClose, ariaLabel) => (
    <RemovableWidget onClose={onClose} ariaLabel={ariaLabel} className="lg:col-span-3">
      <OverallSentimentSection />
    </RemovableWidget>
  ),
  platformVolume: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><PlatformVolumeSection /></RemovableWidget>,
  trendingSearches: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendingSearchesSection /></RemovableWidget>,
  youtubeVisuals: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><VisualsSection /></RemovableWidget>,
  trendDiscovery: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendDiscoverySection /></RemovableWidget>,
  trendDiscoveryTwitter: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendDiscoveryBySourceSection source="twitter" /></RemovableWidget>,
  trendDiscoveryTiktok: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendDiscoveryBySourceSection source="tiktok" /></RemovableWidget>,
  trendDiscoveryInstagram: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendDiscoveryBySourceSection source="instagram" /></RemovableWidget>,
  trendWordCount: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendWordCountSection /></RemovableWidget>,
  trendTimeline: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendTimelineSection /></RemovableWidget>,
  trendNumberPerSearch: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendNumberPerSearchSection /></RemovableWidget>,
  geoDistribution: (onClose, ariaLabel) => (
    <RemovableWidget onClose={onClose} ariaLabel={ariaLabel} className="lg:col-span-3">
      <GeoDistributionSection />
    </RemovableWidget>
  ),
  trendVisuals: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendVisualsSection /></RemovableWidget>,
  trendFeed: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TrendFeedSection /></RemovableWidget>,
  shareOfVoiceGlobal: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><GlobalShareOfVoiceSection /></RemovableWidget>,
  topicGrowth: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><TopicGrowthSection /></RemovableWidget>,
  entityRadar: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><GlobalEntityRadarSection /></RemovableWidget>,
  needsAttention: (onClose, ariaLabel) => <RemovableWidget onClose={onClose} ariaLabel={ariaLabel}><NeedsAttentionSection /></RemovableWidget>,
  dataHealth: (onClose, ariaLabel) => (
    <RemovableWidget onClose={onClose} ariaLabel={ariaLabel} className="lg:col-span-3">
      <DataHealthSection />
    </RemovableWidget>
  ),
};

export default function OverviewPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [widgets, setWidgets] = useState<OverviewWidgetVisibility | null>(null);
  const [order, setOrder] = useState<OverviewWidgetKey[]>([]);
  const [pendingRemoveKey, setPendingRemoveKey] = useState<OverviewWidgetKey | null>(null);

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
    setPendingRemoveKey(key);
  }

  function confirmRemoveWidget() {
    if (!pendingRemoveKey) return;
    const key = pendingRemoveKey;
    setWidgets((prev) => (prev ? { ...prev, [key]: false } : prev));
    setOverviewWidgetVisibility(key, false);
    setPendingRemoveKey(null);
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t.overview.title}</h1>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">{t.overview.subtitle}</p>
          </div>
          <ExportReportButton />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:grid-flow-dense">
          {order.map((key) => {
            if (!widgets[key]) return null;
            const render = WIDGET_COMPONENTS[key];
            if (!render) return null;
            return (
              <Fragment key={key}>
                {render(() => handleRemoveWidget(key), t.overview.removeWidgetAria)}
              </Fragment>
            );
          })}
        </div>
      </div>

      <Dialog open={!!pendingRemoveKey} onOpenChange={(open) => !open && setPendingRemoveKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.overview.removeWidgetConfirmTitle}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500 dark:text-slate-400">{t.overview.removeWidgetConfirmDesc}</p>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPendingRemoveKey(null)}
              className="h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 text-sm font-medium text-slate-600 dark:text-slate-300 transition hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t.overview.removeWidgetConfirmNo}
            </button>
            <button
              type="button"
              onClick={confirmRemoveWidget}
              className="h-9 rounded-lg bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700"
            >
              {t.overview.removeWidgetConfirmYes}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
