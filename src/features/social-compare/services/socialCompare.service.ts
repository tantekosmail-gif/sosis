import { searchFacebookPosts } from "@/features/facebook/services/search.service";
import type { FacebookPostItem, FacebookPostsSearchData } from "@/features/facebook/types/posts.types";
import { searchInstagramPosts } from "@/features/instagram/services/search.service";
import type { InstagramPostItem, InstagramPostsSearchData } from "@/features/instagram/types/posts.types";
import { searchTwitterPosts } from "@/features/twitter/services/search.service";
import type { TwitterPostItem, TwitterPostsSearchData } from "@/features/twitter/types/posts.types";
import { searchTikTokPosts } from "@/features/tiktok/services/search.service";
import type { TikTokPostItem, TikTokPostsSearchData } from "@/features/tiktok/types/posts.types";

import type { ComparablePlatform, PlatformSearchResult, PlatformTopItem } from "../types/socialCompare.types";

function toTopItems(items: (FacebookPostItem | InstagramPostItem | TwitterPostItem | TikTokPostItem)[]): PlatformTopItem[] {
  return [...items]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
    .map((item) => ({
      postId: item.post_id,
      url: item.url,
      caption: item.caption,
      likes: item.likes,
      commentCount: item.comment_count,
      publishedAt: item.published_at,
    }));
}

function normalize(
  platform: ComparablePlatform,
  keyword: string,
  data: FacebookPostsSearchData | InstagramPostsSearchData | TwitterPostsSearchData | TikTokPostsSearchData
): PlatformSearchResult {
  const totalComments = data.items.reduce((sum, item) => sum + (item.comment_count ?? 0), 0);

  return {
    platform,
    keyword,
    totalPosts: data.total ?? data.items.length,
    totalComments,
    totalAnalyzed: data.sentiment?.total_analyzed ?? 0,
    sentiment: {
      positif: data.sentiment?.positif?.count ?? 0,
      netral: data.sentiment?.netral?.count ?? 0,
      negatif: data.sentiment?.negatif?.count ?? 0,
    },
    topItems: toTopItems(data.items),
  };
}

export async function fetchPlatformSearchResult(
  platform: ComparablePlatform,
  params: { keyword: string; dateFrom?: string; dateTo?: string; limit?: number }
): Promise<PlatformSearchResult> {
  const { keyword, dateFrom, dateTo, limit } = params;

  if (platform === "facebook") {
    const data = await searchFacebookPosts({ q: keyword, dateFrom, dateTo, limit });
    return normalize("facebook", keyword, data);
  }

  if (platform === "twitter") {
    const data = await searchTwitterPosts({ q: keyword, dateFrom, dateTo, limit });
    return normalize("twitter", keyword, data);
  }

  if (platform === "tiktok") {
    const data = await searchTikTokPosts({ q: keyword, dateFrom, dateTo, limit });
    return normalize("tiktok", keyword, data);
  }

  const data = await searchInstagramPosts({ q: keyword, dateFrom, dateTo, limit });
  return normalize("instagram", keyword, data);
}
