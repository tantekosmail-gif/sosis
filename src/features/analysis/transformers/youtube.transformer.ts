import { DashboardData, DashboardComment } from "@/types/dashboard.type";

function normalizeSentiment(raw: unknown): "positive" | "negative" | "neutral" {
  const s = String(raw ?? "").toLowerCase();
  if (s === "positif" || s === "positive") return "positive";
  if (s === "negatif" || s === "negative") return "negative";
  return "neutral";
}

// Terapkan filter rentang tanggal di sisi client pada response smart-search
// YouTube (endpoint date-search tidak dipakai untuk YouTube — lihat
// analysis.service). Video di luar rentang dibuang beserta komentarnya supaya
// seluruh dashboard (summary, sentimen, channel distribution) konsisten dengan
// filter. dateFrom/dateTo berformat YYYY-MM-DD; batas akhir inklusif sampai
// akhir hari.
type RawSmartSearchResponse = {
  data?: {
    videos?: Array<Record<string, unknown> & { published_at?: string; url?: string }>;
    comments?: Array<Record<string, unknown> & { video_url?: string }>;
    stats?: Record<string, unknown>;
  };
} & Record<string, unknown>;

export function filterYoutubeResponseByDate(
  response: RawSmartSearchResponse,
  dateFrom: string,
  dateTo: string,
): RawSmartSearchResponse {
  const videos = response?.data?.videos ?? [];
  const comments = response?.data?.comments ?? [];
  const from = new Date(dateFrom).getTime();
  const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1;
  if (isNaN(from) || isNaN(to)) return response;

  const keptVideos = videos.filter((v) => {
    const ts = new Date(String(v.published_at ?? "")).getTime();
    return !isNaN(ts) && ts >= from && ts <= to;
  });
  const keptUrls = new Set(keptVideos.map((v) => v.url));
  const keptComments = comments.filter((c) => keptUrls.has(c.video_url));

  return {
    ...response,
    data: {
      ...response?.data,
      videos: keptVideos,
      comments: keptComments,
      stats: {
        ...response?.data?.stats,
        total_videos: keptVideos.length,
        total_comments: keptComments.length,
      },
    },
  };
}

export function transformYoutube(response: any, keyword = ""): DashboardData {
  const videos = response?.data?.videos ?? [];
  const comments = response?.data?.comments ?? [];

  const { total_videos, total_comments, total_like } =
    response?.data?.stats ?? {};

  // SUMMARY

  const reach = videos.reduce(
    (sum: number, item: any) => sum + (Number(item.view_count) || 0),
    0,
  );

  // const engagement = videos.reduce(
  //   (sum: number, item: any) =>
  //     sum + (Number(item.like_count) || 0) + (Number(item.comment_count) || 0),
  //   0,
  // );

  const totalLike = total_like ?? 0;

  const engagement = total_comments + totalLike;

  // SENTIMENT
  const sentiment = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  comments.forEach((item: any) => {
    sentiment[normalizeSentiment(item.sentiment)]++;
  });

  // CHANNEL DISTRIBUTION — jumlah video per channel (top 8)
  // Field ini bernama "platformDistribution"/"platform" di shared type (dipakai juga oleh
  // transformer platform lain), tapi untuk YouTube kita isi dengan breakdown channel karena
  // "distribusi platform" satu-entry (selalu "Youtube") tidak informatif di halaman yang
  // memang sudah spesifik YouTube.
  const channelMap = new Map<string, number>();
  videos.forEach((video: any) => {
    const channel = video.channel || "Tidak diketahui";
    channelMap.set(channel, (channelMap.get(channel) ?? 0) + 1);
  });
  const platformDistribution = Array.from(channelMap.entries())
    .map(([platform, total]) => ({ platform, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // TOP POSTS
  const topPosts = videos
    .sort((a: any, b: any) => b.view_count - a.view_count)
    .slice(0, 10)
    .map((video: any) => {
      const videoComments = comments.filter(
        (comment: any) => comment.video_url === video.url,
      );

      const videoSentiment = { positive: 0, neutral: 0, negative: 0 };
      videoComments.forEach((comment: any) => {
        videoSentiment[normalizeSentiment(comment.sentiment)]++;
      });
      const dominantSentiment = videoComments.length === 0
        ? null
        : (["positive", "negative", "neutral"] as const).reduce((a, b) =>
            videoSentiment[b] > videoSentiment[a] ? b : a
          );

      return {
        id: video.id,
        title: video.title,
        author: video.channel,
        publishedAt: video.published_at,
        thumbnail: video.thumbnail_url,
        views: video.view_count,
        likes: 0,
        comments: videoComments.length,
        sentiment: dominantSentiment,
        url: video.url,
      };
    });

  // TIMELINE with sentiment per day
  const timelineMap = new Map<string, { total: number; positive: number; neutral: number; negative: number }>();

  videos.forEach((video: any) => {
    if (!video.published_at) return;
    const date = new Date(video.published_at).toISOString().substring(0, 10);
    const cur = timelineMap.get(date) ?? { total: 0, positive: 0, neutral: 0, negative: 0 };
    timelineMap.set(date, { ...cur, total: cur.total + 1 });
  });

  comments.forEach((comment: any) => {
    const date = comment.published_at
      ? new Date(comment.published_at).toISOString().substring(0, 10)
      : null;
    if (!date) return;
    const cur = timelineMap.get(date) ?? { total: 0, positive: 0, neutral: 0, negative: 0 };
    const s = String(comment.sentiment ?? "").toLowerCase();
    if (s === "positif" || s === "positive") cur.positive++;
    else if (s === "negatif" || s === "negative") cur.negative++;
    else cur.neutral++;
    timelineMap.set(date, cur);
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // WORD CLOUD
  const wordMap = new Map<string, number>();

  comments.forEach((item: any) => {
    String(item.content || "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .forEach((word: string) => {
        if (word.length < 4) return;

        wordMap.set(word, (wordMap.get(word) || 0) + 1);
      });
  });

  const wordCloud = Array.from(wordMap.entries())
    .map(([keyword, total]) => ({
      keyword,
      total,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  // COMMENTS
  const dashboardComments: DashboardComment[] = comments.map((c: any) => ({
    id: c.id ?? crypto.randomUUID(),
    author: c.author ?? "Anonim",
    content: c.content ?? "",
    sentiment: normalizeSentiment(c.sentiment),
    publishedAt: c.published_at ?? "",
    videoUrl: c.video_url ?? "",
    likes: Number(c.like_count) || 0,
  }));

  return {
    platform: "youtube",
    keyword,
    summary: {
      totalPosts: total_videos,
      totalComments: total_comments,
      engagement,
      reach,
    },
    sentiment,
    timeline,
    wordCloud,
    topPosts,
    platformDistribution,
    comments: dashboardComments,
    videos,
    stats: response?.data?.stats ?? {},
  };
}
