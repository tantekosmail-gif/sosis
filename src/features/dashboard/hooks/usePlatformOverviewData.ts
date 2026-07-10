"use client";

import { useQuery } from "@tanstack/react-query";

import { getInstagramAnalysisSummary } from "@/features/instagram/services/summary.service";
import { getFacebookAnalysisSummary } from "@/features/facebook/services/summary.service";
import { getTwitterAnalysisSummary } from "@/features/twitter/services/summary.service";
import { getTikTokAnalysisSummary } from "@/features/tiktok/services/summary.service";
import { getViralVideos } from "@/features/youtube/services/viral.service";

export interface PlatformCard {
  key: string;
  label: string;
  totalPosts: number;
  totalComments: number;
  sentiment: { positif: number; negatif: number; netral: number };
}

async function fetchPlatformCards(): Promise<PlatformCard[]> {
  const [ig, fb, tw, tt, yt] = await Promise.allSettled([
    getInstagramAnalysisSummary(),
    getFacebookAnalysisSummary(),
    getTwitterAnalysisSummary(),
    getTikTokAnalysisSummary(),
    getViralVideos({ limit: 1 }),
  ]);

  const next: PlatformCard[] = [];

  if (ig.status === "fulfilled") {
    const { overall } = ig.value;
    next.push({
      key: "instagram", label: "Instagram",
      totalPosts: overall.total_posts,
      totalComments: overall.total_comments,
      sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
    });
  }

  if (fb.status === "fulfilled") {
    const { overall } = fb.value;
    next.push({
      key: "facebook", label: "Facebook",
      totalPosts: overall.total_posts,
      totalComments: overall.total_comments,
      sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
    });
  }

  if (tw.status === "fulfilled") {
    const { overall } = tw.value;
    next.push({
      key: "twitter", label: "Twitter/X",
      totalPosts: overall.total_posts,
      totalComments: overall.total_comments,
      sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
    });
  }

  if (tt.status === "fulfilled") {
    const { overall } = tt.value;
    next.push({
      key: "tiktok", label: "TikTok",
      totalPosts: overall.total_posts,
      totalComments: overall.total_comments,
      sentiment: { positif: overall.sentiment.positif.count, negatif: overall.sentiment.negatif.count, netral: overall.sentiment.netral.count },
    });
  }

  if (yt.status === "fulfilled") {
    const { stats, sentiment } = yt.value;
    next.push({
      key: "youtube", label: "YouTube",
      totalPosts: stats.total_videos,
      totalComments: stats.total_comments,
      sentiment: { positif: sentiment.positif.count, negatif: sentiment.negatif.count, netral: sentiment.netral.count },
    });
  }

  return next;
}

/**
 * Shared across OverallSentimentSection & PlatformVolumeSection so both widgets
 * can be reordered/toggled independently while react-query dedupes the fetch.
 */
export function usePlatformOverviewData() {
  return useQuery({
    queryKey: ["platform-overview"],
    queryFn: fetchPlatformCards,
  });
}
