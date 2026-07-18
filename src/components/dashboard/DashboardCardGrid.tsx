"use client";

import { SmilePlus, Frown, MessageCircle, Eye } from "lucide-react";
import DashboardCard from "./DashboardCard";
import { INFO_HINT, useInfoSource } from "@/components/common/InfoSource";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const ANALYSIS_SOURCE =
  "Konten dan komentar publik yang dikumpulkan langsung dari platform saat analisis keyword dijalankan pada halaman ini.";

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
  const { explain } = useInfoSource();
  const total = (sentiment.positive ?? 0) + (sentiment.neutral ?? 0) + (sentiment.negative ?? 0);
  const posPct = pct(sentiment.positive ?? 0, total);
  const negPct = pct(sentiment.negative ?? 0, total);
  const negAlert = negPct > 30;

  const cards = [
    {
      card: (
        <DashboardCard
          title={t.exposureCards.positiveSentiment}
          value={`${posPct}%`}
          subtitle={`${(sentiment.positive ?? 0).toLocaleString("id-ID")} ${t.exposureCards.ofPrefix} ${total.toLocaleString("id-ID")} ${t.exposureCards.commentsUnit}`}
          icon={SmilePlus}
          color="emerald"
          progress={posPct}
        />
      ),
      info: {
        title: t.exposureCards.positiveSentiment,
        value: `${posPct}%`,
        sentiment: "positive" as const,
        meaning: `Porsi komentar bernada positif — ${(sentiment.positive ?? 0).toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")} komentar yang dianalisis mendukung, memuji, atau menyambut baik topik ini.`,
        source: ANALYSIS_SOURCE,
      },
    },
    {
      card: (
        <DashboardCard
          title={t.exposureCards.negativeSentiment}
          value={`${negPct}%`}
          subtitle={`${(sentiment.negative ?? 0).toLocaleString("id-ID")} ${t.exposureCards.ofPrefix} ${total.toLocaleString("id-ID")} ${t.exposureCards.commentsUnit}`}
          icon={Frown}
          color="red"
          progress={negPct}
          alert={negAlert}
        />
      ),
      info: {
        title: t.exposureCards.negativeSentiment,
        value: `${negPct}%`,
        sentiment: "negative" as const,
        meaning: `Porsi komentar bernada negatif — ${(sentiment.negative ?? 0).toLocaleString("id-ID")} dari ${total.toLocaleString("id-ID")} komentar yang dianalisis mengkritik, menolak, atau kecewa terhadap topik ini.`,
        source: ANALYSIS_SOURCE,
        note: negAlert ? "Porsi negatif di atas 30% — ditandai “Perlu Perhatian” agar segera ditindaklanjuti." : undefined,
      },
    },
    {
      card: (
        <DashboardCard
          title={t.exposureCards.totalComments}
          value={(summary.totalComments ?? 0).toLocaleString("id-ID")}
          subtitle={t.exposureCards.commentsCollected}
          icon={MessageCircle}
          color="indigo"
        />
      ),
      info: {
        title: t.exposureCards.totalComments,
        value: (summary.totalComments ?? 0).toLocaleString("id-ID"),
        meaning: "Jumlah seluruh komentar publik yang berhasil dikumpulkan dan dianalisis sentimennya untuk topik ini.",
        source: ANALYSIS_SOURCE,
      },
    },
    {
      card: (
        <DashboardCard
          title={t.exposureCards.totalReach}
          value={formatReach(summary.reach ?? 0)}
          subtitle={t.exposureCards.reachEstimate}
          icon={Eye}
          color="violet"
        />
      ),
      info: {
        title: t.exposureCards.totalReach,
        value: formatReach(summary.reach ?? 0),
        meaning: "Perkiraan total tayangan (views) dari seluruh konten yang dianalisis — gambaran seberapa luas topik ini dilihat publik.",
        source: ANALYSIS_SOURCE,
      },
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ card, info }) => (
        <button
          key={info.title}
          type="button"
          onClick={() => explain(info)}
          title={INFO_HINT}
          className="block w-full cursor-pointer text-left"
        >
          {card}
        </button>
      ))}
    </div>
  );
}
