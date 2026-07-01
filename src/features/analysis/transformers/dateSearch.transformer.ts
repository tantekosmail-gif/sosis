import { DashboardData } from "@/types/dashboard.type";

export function transformDateSearch(response: any, platform: string, keyword: string): DashboardData {
  const d = response?.data ?? response ?? {};

  const items: any[] = d.items ?? [];
  const sentiment = d.sentiment ?? {};
  const breakdown: any[] = d.daily_breakdown ?? [];

  // SUMMARY
  const reach = items.reduce((sum: number, v: any) => sum + (Number(v.view_count) || 0), 0);
  const totalAnalyzed = sentiment.total_analyzed ?? 0;

  // SENTIMENT
  const sentimentData = {
    positive: sentiment.positif?.count ?? 0,
    neutral:  sentiment.netral?.count  ?? 0,
    negative: sentiment.negatif?.count ?? 0,
  };

  // TIMELINE dari daily_breakdown — tambah estimasi sentimen per hari (proporsional)
  const total = sentimentData.positive + sentimentData.neutral + sentimentData.negative || 1;
  const posPct = sentimentData.positive / total;
  const neuPct = sentimentData.neutral  / total;
  const negPct = sentimentData.negative / total;

  const timeline = breakdown.map((b: any) => ({
    date:     b.date,
    total:    b.video_count ?? 0,
    positive: Math.round((b.video_count ?? 0) * posPct),
    neutral:  Math.round((b.video_count ?? 0) * neuPct),
    negative: Math.round((b.video_count ?? 0) * negPct),
  }));

  // TOP POSTS
  const topPosts = items
    .sort((a: any, b: any) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 15)
    .map((v: any) => ({
      id:          v.id ?? v.video_id,
      title:       v.title ?? "",
      author:      v.channel ?? "",
      publishedAt: v.published_at ?? "",
      thumbnail:   v.thumbnail_url ?? "",
      views:       Number(v.view_count) || 0,
      likes:       Number(v.like_count) || 0,
      comments:    Number(v.comment_count) || 0,
      sentiment:   "neutral" as const,
      url:         v.url ?? "",
    }));

  // COMMENTS — coba dari d.comments (top-level) atau nested di tiap item
  const rawComments: any[] = d.comments ?? items.flatMap((v: any) => v.comments ?? []);
  const dashboardComments = rawComments.map((c: any) => {
    const s = String(c.sentiment ?? "").toLowerCase();
    const sentimentLabel =
      s === "positif" || s === "positive" ? "positive" :
      s === "negatif" || s === "negative" ? "negative" : "neutral";
    return {
      id:          c.id ?? crypto.randomUUID(),
      author:      c.author ?? c.username ?? "Anonim",
      content:     c.content ?? c.text ?? "",
      sentiment:   sentimentLabel as "positive" | "neutral" | "negative",
      publishedAt: c.published_at ?? c.created_at ?? "",
      videoUrl:    c.video_url ?? c.url ?? "",
      likes:       Number(c.like_count ?? c.likes) || 0,
    };
  });

  // WORD CLOUD — dari komentar jika ada, fallback ke judul video
  const wordMap = new Map<string, number>();
  const wordSource = rawComments.length > 0
    ? rawComments.map((c: any) => c.content ?? c.text ?? "")
    : items.map((v: any) => v.title ?? "");
  wordSource.forEach((text: string) => {
    String(text)
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .forEach((word: string) => {
        if (word.length < 4) return;
        wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
      });
  });
  const wordCloud = Array.from(wordMap.entries())
    .map(([kw, total]) => ({ keyword: kw, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 50);

  return {
    platform,
    keyword,
    summary: {
      totalPosts:    d.total ?? items.length,
      totalComments: totalAnalyzed,
      engagement:    totalAnalyzed,
      reach,
    },
    sentiment: sentimentData,
    timeline,
    topPosts,
    wordCloud,
    platformDistribution: [{ platform, total: d.total ?? items.length }],
    comments: dashboardComments,
    videos:   items,
    stats:    d,
  };
}
