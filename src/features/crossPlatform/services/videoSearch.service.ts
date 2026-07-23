import { getVideoDetail, getVideoMetadata } from "@/features/youtube/services/search.service";
import { getTikTokVideoDetail, getTikTokVideoMetadata } from "@/features/tiktok/services/videoMetadata.service";

export type CrossPlatformSource = "youtube" | "tiktok";

export interface CrossPlatformVideoItem {
  platform: CrossPlatformSource;
  id: string;
  title: string;
  content: string;
  author: string;
  /** Cuma ada di item TikTok. */
  author_fans?: number;
  url: string;
  thumbnail: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  scores: {
    trend_score: number | null;
    engagement_score: number | null;
    freshness_score: number | null;
    authority_score: number | null;
  };
  ai_summary: string | null;
  ai_tags: string[];
  source_topic: string | null;
  source_topics: string[];
  published_at: string;
  collected_at: string;
  saved_comment_count: number;
}

export interface CrossPlatformVideoComment {
  author: string;
  content: string;
  likes: number;
  published_at: string | null;
}

export interface CrossPlatformVideoDetail extends CrossPlatformVideoItem {
  comments: CrossPlatformVideoComment[];
}

export type CrossPlatformSortBy = "trend_score" | "views" | "published_at";

export interface CrossPlatformPageParams {
  search: string;
  page: number;
  pageSize: number;
  sortBy: CrossPlatformSortBy;
  order: "asc" | "desc";
}

export interface CrossPlatformPageResult {
  items: CrossPlatformVideoItem[];
  youtubeTotal: number;
  youtubeTotalPages: number;
  tiktokTotal: number;
  tiktokTotalPages: number;
}

// Menggabungkan /youtube/metadata & /tiktok/metadata jadi satu list -- kedua
// endpoint punya bentuk & parameter yang identik (search/sort_by/order/page/
// page_size), jadi tinggal dipanggil paralel lalu ditandai per-item asal
// platform-nya. "Total" masing-masing platform tetap dilacak terpisah (dua
// sumber paginasi independen), tapi item digabung+diurutkan ulang di client
// (lihat useCrossPlatformVideoSearch) supaya rangking trend/newest/populer-nya
// benar-benar lintas platform, bukan cuma disusun berurutan per sumber.
export async function fetchCrossPlatformPage(params: CrossPlatformPageParams): Promise<CrossPlatformPageResult> {
  const [yt, tt] = await Promise.all([
    getVideoMetadata({
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      order: params.order,
    }),
    getTikTokVideoMetadata({
      search: params.search,
      page: params.page,
      pageSize: params.pageSize,
      sortBy: params.sortBy,
      order: params.order,
    }),
  ]);

  const items: CrossPlatformVideoItem[] = [
    ...yt.items.map((item): CrossPlatformVideoItem => ({ ...item, platform: "youtube" })),
    ...tt.items.map((item): CrossPlatformVideoItem => ({ ...item, platform: "tiktok" })),
  ];

  return {
    items,
    youtubeTotal: yt.total,
    youtubeTotalPages: yt.total_pages,
    tiktokTotal: tt.total,
    tiktokTotalPages: tt.total_pages,
  };
}

export async function fetchCrossPlatformDetail(
  platform: CrossPlatformSource,
  id: string,
): Promise<CrossPlatformVideoDetail> {
  if (platform === "youtube") {
    const detail = await getVideoDetail(id);
    return { ...detail, platform: "youtube" };
  }
  const detail = await getTikTokVideoDetail(id);
  return { ...detail, platform: "tiktok" };
}
