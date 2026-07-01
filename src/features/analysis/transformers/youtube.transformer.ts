import { DashboardData, DashboardComment } from "@/types/dashboard.type";

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

  // TODO: Belum ambil data sentiment, tapi comment
  comments.forEach((item: any) => {
    switch (String(item.sentiment).toLowerCase()) {
      case "positif":
      case "positive":
        sentiment.positive++;
        break;

      case "negatif":
      case "negative":
        sentiment.negative++;
        break;

      default:
        sentiment.neutral++;
    }
  });

  // PLATFORM
  const platformDistribution = [
    {
      platform: "Youtube",
      total: total_videos,
    },
  ];

  // TOP POSTS
  const topPosts = videos
    .sort((a: any, b: any) => b.view_count - a.view_count)
    .slice(0, 10)
    .map((video: any) => {
      const totalComments = comments.filter(
        (comment: any) => comment.video_url === video.url,
      ).length;

      return {
        id: video.id,
        title: video.title,
        author: video.channel,
        publishedAt: video.published_at,
        thumbnail: video.thumbnail_url,
        views: video.view_count,
        likes: 0,
        comments: totalComments,
        sentiment: "neutral",
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
  const dashboardComments: DashboardComment[] = comments.map((c: any) => {
    const s = String(c.sentiment ?? "").toLowerCase();
    const sentiment =
      s === "positif" || s === "positive" ? "positive" :
      s === "negatif" || s === "negative" ? "negative" : "neutral";
    return {
      id: c.id ?? crypto.randomUUID(),
      author: c.author ?? "Anonim",
      content: c.content ?? "",
      sentiment,
      publishedAt: c.published_at ?? "",
      videoUrl: c.video_url ?? "",
      likes: Number(c.like_count) || 0,
    };
  });

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
