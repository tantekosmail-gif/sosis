"use client";

import { usePlatformOverviewData } from "../hooks/usePlatformOverviewData";
import OverallSentimentWidget from "./OverallSentimentWidget";

export default function OverallSentimentSection() {
  const { data: cards, isLoading } = usePlatformOverviewData();

  if (isLoading) {
    return <div className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800" />;
  }

  if (!cards || cards.length === 0) return null;

  const overallSentiment = cards.reduce(
    (acc, c) => ({
      positif: acc.positif + c.sentiment.positif,
      netral: acc.netral + c.sentiment.netral,
      negatif: acc.negatif + c.sentiment.negatif,
    }),
    { positif: 0, netral: 0, negatif: 0 }
  );

  return <OverallSentimentWidget {...overallSentiment} platformCount={cards.length} />;
}
