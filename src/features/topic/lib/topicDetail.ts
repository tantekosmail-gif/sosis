import { Globe, Newspaper } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

export interface TopicPost {
  id: string;
  platform: string;
  title: string;
  author: string | null;
  url: string;
  view_count?: number;
  likes?: number;
  published_at?: string | null;
  thumbnail_url?: string;
}

export interface KeywordGroup {
  keyword: string;
  keywordId: string;
  totalPosts: number;
  posts: TopicPost[];
}

export interface TopicDetail {
  id: string;
  name: string;
  description?: string | null;
  totalPosts: number;
  keywordGroups: KeywordGroup[];
}

export const PLATFORM_META: Record<
  string,
  { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string }
> = {
  youtube: { label: "YouTube", icon: FaYoutube, color: "text-red-500" },
  instagram: { label: "Instagram", icon: FaInstagram, color: "text-pink-500" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "text-blue-600" },
  twitter: { label: "Twitter/X", icon: FaXTwitter, color: "text-sky-500" },
  tiktok: { label: "TikTok", icon: FaTiktok, color: "text-slate-900 dark:text-white" },
  news: { label: "Berita", icon: Newspaper, color: "text-amber-500" },
};

export function platformMeta(platform: string) {
  return PLATFORM_META[platform] ?? { label: platform, icon: Globe, color: "text-slate-400" };
}

// GET /search/topics/{id} mengembalikan postingan dikelompokkan per keyword
// (keyword_details[].posts), berbeda dari response POST /search/topics yang
// pakai array "results" flat + status/sentimen per keyword.
export function normalizeTopicDetail(raw: any): TopicDetail {
  const body = raw?.data ?? raw;
  const groups = body.keyword_details ?? [];
  return {
    id: body.id ?? body.topic_id,
    name: body.name ?? body.topic,
    description: body.description ?? null,
    totalPosts: body.total_posts ?? 0,
    keywordGroups: Array.isArray(groups)
      ? groups.map((g: any) => ({
          keyword: g.keyword,
          keywordId: g.keyword_id,
          totalPosts: g.total_posts ?? g.posts?.length ?? 0,
          posts: g.posts ?? [],
        }))
      : [],
  };
}
