import { DashboardData, DashboardComment } from "@/types/dashboard.type";

function normalizeSentiment(raw: unknown): "positive" | "negative" | "neutral" {
  const s = String(raw ?? "").toLowerCase();
  if (s === "positif" || s === "positive") return "positive";
  if (s === "negatif" || s === "negative") return "negative";
  return "neutral";
}

function toDashboardComment(c: any): DashboardComment {
  return {
    id: c.id ?? crypto.randomUUID(),
    author: c.author ?? "Anonim",
    content: c.content ?? "",
    sentiment: normalizeSentiment(c.sentiment),
    publishedAt: c.published_at ?? "",
    videoUrl: c.video_url ?? "",
    likes: Number(c.like_count) || 0,
  };
}

// Terapkan filter rentang tanggal di sisi client pada response smart-search
// YouTube (endpoint date-search tidak dipakai untuk YouTube — lihat
// analysis.service). Video di luar rentang dibuang beserta komentarnya supaya
// seluruh dashboard (summary, sentimen, channel distribution) konsisten dengan
// filter. dateFrom/dateTo berformat YYYY-MM-DD; batas akhir inklusif sampai
// akhir hari.
//
// Backend sekarang nest komentar di tiap video (video.comments), bukan array
// flat terpisah (response.data.comments) lagi -- comments di sini dukung
// keduanya (fallback ke flatten dari video.comments) supaya tetap kompatibel
// kalau bentuknya berubah lagi nanti.
type RawSmartSearchResponse = {
  data?: {
    videos?: Array<Record<string, unknown> & { published_at?: string; url?: string; comments?: unknown[] }>;
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
  const from = new Date(dateFrom).getTime();
  const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1;
  if (isNaN(from) || isNaN(to)) return response;

  const keptVideos = videos.filter((v) => {
    const ts = new Date(String(v.published_at ?? "")).getTime();
    return !isNaN(ts) && ts >= from && ts <= to;
  });
  const keptUrls = new Set(keptVideos.map((v) => v.url));

  // Bentuk lama (response.data.comments flat) -- filter kalau masih ada,
  // supaya tidak lolos stale/tidak terfilter kalau backend suatu saat balik
  // ke bentuk itu lagi.
  const rawComments = response?.data?.comments;
  const keptComments = rawComments?.filter((c) => keptUrls.has(c.video_url));
  const keptCommentsCount = keptComments
    ? keptComments.length
    : keptVideos.reduce((sum, v) => sum + (v.comments?.length ?? 0), 0);

  // Agregat sentimen resmi backend (response.data.sentiment) dihitung dari
  // SELURUH histori keyword, tidak ikut mempertimbangkan filter tanggal ini --
  // kalau filter ini benar-benar membuang video (bukan cuma no-op karena semua
  // video kebetulan masuk rentang), buang juga agregatnya supaya
  // transformYoutube fallback menghitung ulang dari sample comments yang
  // SUDAH ikut terfilter, biar persentase sentimen konsisten dengan kartu lain.
  const droppedSomeVideos = keptVideos.length !== videos.length;
  const nextData: Record<string, unknown> = { ...response?.data };
  if (droppedSomeVideos) delete nextData.sentiment;

  return {
    ...response,
    data: {
      ...nextData,
      videos: keptVideos,
      ...(keptComments ? { comments: keptComments } : {}),
      stats: {
        ...response?.data?.stats,
        total_videos: keptVideos.length,
        total_comments: keptCommentsCount,
      },
    },
  };
}

export function transformYoutube(response: any, keyword = ""): DashboardData {
  const videos = response?.data?.videos ?? [];
  // Backend sekarang nest komentar di tiap video (video.comments) dan sudah
  // tidak lagi mengirim response.data.comments sebagai array flat terpisah --
  // flatten di sini supaya seluruh logika di bawah (sentimen per video,
  // timeline, word cloud, tabel komentar) tetap dapat comments-nya.
  const comments = response?.data?.comments ?? videos.flatMap((v: any) => v.comments ?? []);

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

  // SENTIMENT — pakai agregat resmi dari backend kalau ada (dihitung dari
  // SELURUH komentar yang dianalisis, mis. 10.505), bukan cuma dari sample
  // comments yang ikut terkirim di response ini (dibatasi limit_comments,
  // mis. cuma 200) — sample itu tidak representatif utk persentase sentimen.
  const rawSentimentAgg = response?.data?.sentiment;
  const sentiment = rawSentimentAgg
    ? {
        positive: rawSentimentAgg.positif?.count ?? 0,
        neutral: rawSentimentAgg.netral?.count ?? 0,
        negative: rawSentimentAgg.negatif?.count ?? 0,
      }
    : { positive: 0, neutral: 0, negative: 0 };

  if (!rawSentimentAgg) {
    comments.forEach((item: any) => {
      sentiment[normalizeSentiment(item.sentiment)]++;
    });
  }

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

  // TOP POSTS — seluruh video (tidak dibatasi 10), diurutkan berdasarkan views;
  // UI menampilkan semuanya dalam grid kartu yang dipaginasi.
  const topPosts = [...videos]
    .sort((a: any, b: any) => b.view_count - a.view_count)
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

      const total = videoComments.length;
      const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);

      return {
        id: video.id,
        title: video.title,
        author: video.channel,
        publishedAt: video.published_at,
        thumbnail: video.thumbnail_url,
        views: video.view_count,
        likes: 0,
        comments: total,
        sentiment: dominantSentiment,
        sentimentBreakdown: {
          positif: { count: videoSentiment.positive, percentage: pct(videoSentiment.positive) },
          netral: { count: videoSentiment.neutral, percentage: pct(videoSentiment.neutral) },
          negatif: { count: videoSentiment.negative, percentage: pct(videoSentiment.negative) },
        },
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
  const dashboardComments: DashboardComment[] = comments.map(toDashboardComment);

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
