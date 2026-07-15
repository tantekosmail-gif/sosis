import { CATEGORICAL_PALETTE } from "@/lib/chartColors";
import { ENGAGEMENT_PLATFORMS } from "../hooks/useEngagementDashboard";
import type { EngagementPlatform } from "../types/engagement.types";

// Fixed order/hue per platform — identity, never re-cycled when a platform errors out.
export const PLATFORM_COLOR: Record<EngagementPlatform, string> = Object.fromEntries(
  ENGAGEMENT_PLATFORMS.map((platform, i) => [platform, CATEGORICAL_PALETTE[i % CATEGORICAL_PALETTE.length]])
) as Record<EngagementPlatform, string>;

export const PLATFORM_LABEL: Record<EngagementPlatform, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
};

export const BREAKDOWN_KEYS = ["likes", "comments", "shares", "saves"] as const;
export type BreakdownKey = (typeof BREAKDOWN_KEYS)[number];

export const BREAKDOWN_LABEL: Record<BreakdownKey, string> = {
  likes: "Likes",
  comments: "Komentar",
  shares: "Share",
  saves: "Save",
};

export const BREAKDOWN_COLOR: Record<BreakdownKey, string> = {
  likes: CATEGORICAL_PALETTE[0],
  comments: CATEGORICAL_PALETTE[1],
  shares: CATEGORICAL_PALETTE[2],
  saves: CATEGORICAL_PALETTE[3],
};
