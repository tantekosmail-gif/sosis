import { DashboardData, DashboardTimeline, DashboardWord } from "@/types/dashboard.type";

export function mergeGlobalDashboard(results: DashboardData[], keyword: string): DashboardData {
  const valid = results.filter(Boolean);

  // Summary — jumlahkan semua platform
  const summary = valid.reduce(
    (acc, d) => ({
      totalPosts:    acc.totalPosts    + (d.summary.totalPosts    ?? 0),
      totalComments: acc.totalComments + (d.summary.totalComments ?? 0),
      engagement:    acc.engagement    + (d.summary.engagement    ?? 0),
      reach:         acc.reach         + (d.summary.reach         ?? 0),
    }),
    { totalPosts: 0, totalComments: 0, engagement: 0, reach: 0 }
  );

  // Sentiment — jumlahkan
  const sentiment = valid.reduce(
    (acc, d) => ({
      positive: acc.positive + (d.sentiment.positive ?? 0),
      neutral:  acc.neutral  + (d.sentiment.neutral  ?? 0),
      negative: acc.negative + (d.sentiment.negative ?? 0),
    }),
    { positive: 0, neutral: 0, negative: 0 }
  );

  // Timeline — merge per tanggal
  const timelineMap = new Map<string, DashboardTimeline>();
  valid.forEach((d) => {
    d.timeline.forEach((t) => {
      const cur = timelineMap.get(t.date) ?? { date: t.date, total: 0, positive: 0, neutral: 0, negative: 0 };
      timelineMap.set(t.date, {
        date:     t.date,
        total:    cur.total    + (t.total    ?? 0),
        positive: (cur.positive ?? 0) + (t.positive ?? 0),
        neutral:  (cur.neutral  ?? 0) + (t.neutral  ?? 0),
        negative: (cur.negative ?? 0) + (t.negative ?? 0),
      });
    });
  });
  const timeline = Array.from(timelineMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  // Top Posts — gabung semua, sort by views, ambil 15 teratas
  const topPosts = valid
    .flatMap((d) => d.topPosts)
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 15);

  // Word Cloud — gabung dan sum
  const wordMap = new Map<string, number>();
  valid.forEach((d) => {
    d.wordCloud.forEach((w) => {
      wordMap.set(w.keyword, (wordMap.get(w.keyword) ?? 0) + w.total);
    });
  });
  const wordCloud: DashboardWord[] = Array.from(wordMap.entries())
    .map(([keyword, total]) => ({ keyword, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  // Platform distribution — satu entry per platform
  const platformDistribution = valid.flatMap((d) => d.platformDistribution);

  // Comments — gabung semua
  const comments = valid.flatMap((d) => d.comments ?? []);

  return {
    platform: "global",
    keyword,
    summary,
    sentiment,
    timeline,
    topPosts,
    wordCloud,
    platformDistribution,
    comments,
    videos: valid.flatMap((d) => d.videos ?? []),
    stats: {},
  };
}
