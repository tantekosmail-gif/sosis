"use client";

import { SmilePlus, Frown, MessageCircle, Eye } from "lucide-react";
import DashboardCard from "./DashboardCard";

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
  const total = (sentiment.positive ?? 0) + (sentiment.neutral ?? 0) + (sentiment.negative ?? 0);
  const posPct = pct(sentiment.positive ?? 0, total);
  const negPct = pct(sentiment.negative ?? 0, total);
  const negAlert = negPct > 30;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Sentimen Positif"
        value={`${posPct}%`}
        subtitle={`${(sentiment.positive ?? 0).toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")} komentar`}
        icon={SmilePlus}
        color="emerald"
        progress={posPct}
      />
      <DashboardCard
        title="Sentimen Negatif"
        value={`${negPct}%`}
        subtitle={`${(sentiment.negative ?? 0).toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")} komentar`}
        icon={Frown}
        color="red"
        progress={negPct}
        alert={negAlert}
      />
      <DashboardCard
        title="Total Komentar"
        value={(summary.totalComments ?? 0).toLocaleString("id-ID")}
        subtitle="komentar terkumpul"
        icon={MessageCircle}
        color="indigo"
      />
      <DashboardCard
        title="Total Reach"
        value={formatReach(summary.reach ?? 0)}
        subtitle="estimasi jangkauan views"
        icon={Eye}
        color="violet"
      />
    </div>
  );
}
