"use client";

import { SmilePlus, Frown, MessageCircle, Eye } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

interface Props {
  summary: {
    totalComments: number;
    reach: number;
  };
  sentiment: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

function pct(part: number, total: number) {
  if (!total) return 0;
  return Math.round((part / total) * 100);
}

function formatReach(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "K";
  return (n ?? 0).toLocaleString("id-ID");
}

export default function DashboardCardGrid({ summary, sentiment }: Props) {
  const { t } = useTranslation();
  const total = (sentiment.positive ?? 0) + (sentiment.neutral ?? 0) + (sentiment.negative ?? 0);
  const posPct = pct(sentiment.positive ?? 0, total);
  const negPct = pct(sentiment.negative ?? 0, total);
  const negAlert = negPct > 30;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title={t.exposureCards.positiveSentiment}
        value={`${posPct}%`}
        subtitle={`${(sentiment.positive ?? 0).toLocaleString("id-ID")} ${t.exposureCards.ofPrefix} ${total.toLocaleString("id-ID")} ${t.exposureCards.commentsUnit}`}
        icon={SmilePlus}
        color="emerald"
        progress={posPct}
      />
      <DashboardCard
        title={t.exposureCards.negativeSentiment}
        value={`${negPct}%`}
        subtitle={`${(sentiment.negative ?? 0).toLocaleString("id-ID")} ${t.exposureCards.ofPrefix} ${total.toLocaleString("id-ID")} ${t.exposureCards.commentsUnit}`}
        icon={Frown}
        color="red"
        progress={negPct}
        alert={negAlert}
      />
      <DashboardCard
        title={t.exposureCards.totalComments}
        value={(summary.totalComments ?? 0).toLocaleString("id-ID")}
        subtitle={t.exposureCards.commentsCollected}
        icon={MessageCircle}
        color="indigo"
      />
      <DashboardCard
        title={t.exposureCards.totalReach}
        value={formatReach(summary.reach ?? 0)}
        subtitle={t.exposureCards.reachEstimate}
        icon={Eye}
        color="violet"
      />
    </div>
  );
}
