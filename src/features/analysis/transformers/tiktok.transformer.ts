import { DashboardData } from "@/types/dashboard.type";

export function transformTikTok(response: any, keyword = ""): DashboardData {
  return {
    platform: "tiktok",
    keyword,
    summary: { totalPosts: 0, totalComments: 0, engagement: 0, reach: 0 },
    sentiment: { positive: 0, neutral: 0, negative: 0 },
    timeline: [],
    wordCloud: [],
    topPosts: [],
    platformDistribution: [{ platform: "TikTok", total: 0 }],
    comments: [],
    videos: [],
    stats: {},
  };
}
