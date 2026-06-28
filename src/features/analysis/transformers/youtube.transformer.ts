import { DashboardData } from "@/types/dashboard.type";

export function transformYoutube(response: any): DashboardData {
  const videos = response?.data?.videos ?? [];
  const comments = response?.data?.comments ?? [];

  // SUMMARY
  const totalPosts = videos.length;

  const totalComments = comments.length;

  const reach = videos.reduce(
    (sum: number, item: any) => sum + (Number(item.view_count) || 0),
    0,
  );

  const engagement = videos.reduce(
    (sum: number, item: any) =>
      sum + (Number(item.like_count) || 0) + (Number(item.comment_count) || 0),
    0,
  );

  // SENTIMENT
  const sentiment = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

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
      total: totalPosts,
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

  // TIMELINE
  const timelineMap = new Map<string, number>();

  videos.forEach((video: any) => {
    if (!video.published_at) return;

    const date = new Date(video.published_at).toISOString().substring(0, 10);

    timelineMap.set(date, (timelineMap.get(date) || 0) + 1);
  });

  const timeline = Array.from(timelineMap.entries())
    .map(([date, total]) => ({
      date,
      total,
    }))
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

  return {
    summary: {
      totalPosts,
      totalComments,
      engagement,
      reach,
    },

    sentiment,

    timeline,

    wordCloud,

    topPosts,

    platformDistribution,
  };
}
