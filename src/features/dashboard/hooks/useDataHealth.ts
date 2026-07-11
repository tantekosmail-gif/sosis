"use client";

import { useInstagramSummary } from "@/features/instagram/hooks/useInstagramSummary";
import { useFacebookSummary } from "@/features/facebook/hooks/useFacebookSummary";
import { useTwitterSummary } from "@/features/twitter/hooks/useTwitterSummary";
import { useTikTokSummary } from "@/features/tiktok/hooks/useTikTokSummary";
import { useNewsSummary } from "@/features/news/hooks/useNewsSummary";

export interface PlatformHealth {
  platform: string;
  totalItems: number;
  totalAnalyzed: number;
  fullyAnalyzed: boolean;
}

export function useDataHealth() {
  const ig = useInstagramSummary();
  const fb = useFacebookSummary();
  const tw = useTwitterSummary();
  const tt = useTikTokSummary();
  const news = useNewsSummary();

  const loading = ig.loading || fb.loading || tw.loading || tt.loading || news.loading;

  const items: PlatformHealth[] = [
    ig.data && {
      platform: "Instagram",
      totalItems: ig.data.overall.total_posts,
      totalAnalyzed: ig.data.overall.total_analyzed,
      fullyAnalyzed: ig.data.overall.fully_analyzed,
    },
    fb.data && {
      platform: "Facebook",
      totalItems: fb.data.overall.total_posts,
      totalAnalyzed: fb.data.overall.total_analyzed,
      fullyAnalyzed: fb.data.overall.fully_analyzed,
    },
    tw.data && {
      platform: "Twitter/X",
      totalItems: tw.data.overall.total_posts,
      totalAnalyzed: tw.data.overall.total_analyzed,
      fullyAnalyzed: tw.data.overall.fully_analyzed,
    },
    tt.data && {
      platform: "TikTok",
      totalItems: tt.data.overall.total_posts,
      totalAnalyzed: tt.data.overall.total_analyzed,
      fullyAnalyzed: tt.data.overall.fully_analyzed,
    },
    news.data && {
      platform: "News",
      totalItems: news.data.total_articles,
      totalAnalyzed: news.data.total_analyzed,
      fullyAnalyzed: news.data.fully_analyzed,
    },
  ].filter((x): x is PlatformHealth => Boolean(x));

  return { items, loading };
}
