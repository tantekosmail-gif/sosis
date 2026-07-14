export interface TopicTrendSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface TopicTrendDay {
  date: string;
  platforms: Record<string, number>;
  totalPosts: number;
  sentiment: TopicTrendSentiment;
  newSubTopics: string[];
}

export interface TopicTrendGraph {
  days: TopicTrendDay[];
  platformKeys: string[];
}

// Urutan tetap supaya warna platform konsisten antar render, bukan di-generate
// dari data (lihat dataviz skill: "assign categorical hues in fixed order").
export const PLATFORM_ORDER = ["youtube", "instagram", "facebook", "twitter", "tiktok", "news"];

function sortPlatformKeys(keys: Set<string>): string[] {
  const known = PLATFORM_ORDER.filter((p) => keys.has(p));
  const unknown = Array.from(keys)
    .filter((p) => !PLATFORM_ORDER.includes(p))
    .sort();
  return [...known, ...unknown];
}

// Skema response GET /search/topics/{id}/trend-graph belum diverifikasi lewat
// network tap nyata -- di OpenAPI, response-nya "additionalProperties: true"
// (bentuk bebas). Dinormalisasi defensif berdasarkan deskripsi endpoint: array
// "days" berisi volume post per platform, sentimen komentar (lexicon_analyses),
// dan sub-topik baru hasil AI-context discovery, masing-masing per hari, dengan
// hari kosong tetap muncul (angka 0 / list kosong) supaya jumlah titik selalu
// genap `days`.
export function normalizeTopicTrendGraph(raw: any): TopicTrendGraph {
  const body = raw?.data ?? raw;
  const list = body?.days ?? body?.timeline ?? body?.data_points ?? [];
  const platformSet = new Set<string>();

  const days: TopicTrendDay[] = (Array.isArray(list) ? list : []).map((d: any) => {
    const platforms: Record<string, number> = d.platforms ?? d.platform_counts ?? d.by_platform ?? d.counts ?? {};
    Object.keys(platforms).forEach((p) => platformSet.add(p));

    const sentimentRaw = d.sentiment ?? d.sentiments ?? {};
    const totalFromPlatforms = Object.values(platforms).reduce((sum: number, n) => sum + (Number(n) || 0), 0);

    return {
      date: d.date ?? d.day ?? d.bucket ?? "",
      platforms,
      totalPosts: d.total_posts ?? d.total ?? totalFromPlatforms,
      sentiment: {
        positive: sentimentRaw.positive ?? 0,
        neutral: sentimentRaw.neutral ?? 0,
        negative: sentimentRaw.negative ?? 0,
      },
      newSubTopics: d.new_sub_topics ?? d.sub_topics ?? d.subtopics ?? [],
    };
  });

  return { days, platformKeys: sortPlatformKeys(platformSet) };
}
