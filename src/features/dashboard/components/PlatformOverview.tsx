"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { AtSign, Feather, Flame, MessageSquare, Music2, SquareUser } from "lucide-react";

import { getInstagramAnalysisSummary } from "@/features/instagram/services/summary.service";
import { getFacebookAnalysisSummary } from "@/features/facebook/services/summary.service";
import { getTwitterAnalysisSummary } from "@/features/twitter/services/summary.service";
import { getTikTokAnalysisSummary } from "@/features/tiktok/services/summary.service";
import { getViralVideos } from "@/features/youtube/services/viral.service";
import OverallSentimentWidget from "./OverallSentimentWidget";

interface PlatformCard {
  key: string;
  label: string;
  href: string;
  icon: LucideIcon;
  chip: string;
  totalPosts: number;
  totalComments: number;
  sentiment: { positif: number; negatif: number; netral: number };
  accountsMonitored?: number;
}

const SENTIMENT_COLOR = {
  positif: "bg-emerald-500",
  netral: "bg-amber-400",
  negatif: "bg-red-500",
};

function MiniSentimentBar({ positif, negatif, netral }: { positif: number; negatif: number; netral: number }) {
  const total = positif + negatif + netral;
  if (total === 0) {
    return <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100" />;
  }

  return (
    <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={SENTIMENT_COLOR.positif} style={{ width: `${(positif / total) * 100}%` }} />
      <div className={SENTIMENT_COLOR.netral} style={{ width: `${(netral / total) * 100}%` }} />
      <div className={SENTIMENT_COLOR.negatif} style={{ width: `${(negatif / total) * 100}%` }} />
    </div>
  );
}

export default function PlatformOverview() {
  const [cards, setCards] = useState<PlatformCard[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [ig, fb, tw, tt, yt] = await Promise.allSettled([
        getInstagramAnalysisSummary(),
        getFacebookAnalysisSummary(),
        getTwitterAnalysisSummary(),
        getTikTokAnalysisSummary(),
        getViralVideos({ limit: 1 }),
      ]);

      const next: PlatformCard[] = [];

      if (ig.status === "fulfilled") {
        const { overall, per_account } = ig.value;
        next.push({
          key: "instagram", label: "Instagram", href: "/instagram", icon: AtSign, chip: "bg-indigo-50 text-indigo-600",
          totalPosts: overall.total_posts,
          totalComments: overall.total_comments,
          sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
          accountsMonitored: per_account.length,
        });
      }

      if (fb.status === "fulfilled") {
        const { overall, per_account } = fb.value;
        next.push({
          key: "facebook", label: "Facebook", href: "/facebook", icon: SquareUser, chip: "bg-blue-50 text-blue-600",
          totalPosts: overall.total_posts,
          totalComments: overall.total_comments,
          sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
          accountsMonitored: per_account.length,
        });
      }

      if (tw.status === "fulfilled") {
        const { overall, per_account } = tw.value;
        next.push({
          key: "twitter", label: "Twitter/X", href: "/twitter", icon: Feather, chip: "bg-sky-50 text-sky-600",
          totalPosts: overall.total_posts,
          totalComments: overall.total_comments,
          sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
          accountsMonitored: per_account.length,
        });
      }

      if (tt.status === "fulfilled") {
        const { overall, per_account } = tt.value;
        next.push({
          key: "tiktok", label: "TikTok", href: "/tiktok", icon: Music2, chip: "bg-rose-50 text-rose-600",
          totalPosts: overall.total_posts,
          totalComments: overall.total_comments,
          sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
          accountsMonitored: per_account.length,
        });
      }

      if (yt.status === "fulfilled") {
        const { stats, sentiment } = yt.value;
        next.push({
          key: "youtube", label: "YouTube", href: "/youtube", icon: Flame, chip: "bg-red-50 text-red-600",
          totalPosts: stats.total_videos,
          totalComments: stats.total_comments,
          sentiment: { positif: sentiment.positif.count, negatif: sentiment.negatif.count, netral: sentiment.netral.count },
        });
      }

      if (!cancelled) {
        setCards(next);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
        ))}
      </div>
    );
  }

  if (!cards || cards.length === 0) return null;

  const totals = cards.reduce(
    (acc, c) => ({
      posts: acc.posts + c.totalPosts,
      comments: acc.comments + c.totalComments,
    }),
    { posts: 0, comments: 0 }
  );

  const overallSentiment = cards.reduce(
    (acc, c) => ({
      positif: acc.positif + c.sentiment.positif,
      netral: acc.netral + c.sentiment.netral,
      negatif: acc.negatif + c.sentiment.negatif,
    }),
    { positif: 0, netral: 0, negatif: 0 }
  );

  return (
    <div className="space-y-6">
      <OverallSentimentWidget {...overallSentiment} platformCount={cards.length} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Ringkasan Lintas Platform</h2>
            <p className="text-xs text-slate-400">Overview data yang sudah dipantau di semua platform</p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <span className="font-semibold text-slate-700">{totals.posts.toLocaleString("id-ID")}</span> post ·{" "}
            <span className="font-semibold text-slate-700">{totals.comments.toLocaleString("id-ID")}</span> komentar
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
              >
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.chip}`}>
                  <Icon size={17} />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-900 group-hover:text-indigo-600">{card.label}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{card.totalPosts.toLocaleString("id-ID")}</p>
                <p className="text-[11px] text-slate-400">post dipantau</p>

                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <MessageSquare size={11} />
                  {card.totalComments.toLocaleString("id-ID")} komentar
                </div>

                <MiniSentimentBar {...card.sentiment} />

                {card.accountsMonitored !== undefined && (
                  <p className="mt-2 text-[11px] text-slate-400">{card.accountsMonitored} akun dipantau</p>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
