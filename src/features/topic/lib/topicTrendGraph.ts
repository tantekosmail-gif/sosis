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

// Bentuk response GET /search/topics/{id}/trend-graph terverifikasi dari
// network tap nyata: { success, data: { topic_id, name, days: [{ date,
// total_posts, by_platform, sentiment: { positif, netral, negatif },
// new_subtopics_found }] } }. Hari tanpa data tetap muncul dengan
// by_platform/sentiment berupa object kosong `{}`, bukan hilang dari array.
// Total hitungan sentiment bisa lebih besar dari total_posts karena dihitung
// per komentar (lexicon_analyses), bukan per post.
export function normalizeTopicTrendGraph(raw: any): TopicTrendGraph {
  const body = raw?.data ?? raw;
  const list = body?.days ?? [];
  const platformSet = new Set<string>();

  const days: TopicTrendDay[] = (Array.isArray(list) ? list : []).map((d: any) => {
    const platforms: Record<string, number> = d.by_platform ?? {};
    Object.keys(platforms).forEach((p) => platformSet.add(p));

    const sentimentRaw = d.sentiment ?? {};

    return {
      date: d.date ?? "",
      platforms,
      totalPosts: d.total_posts ?? 0,
      sentiment: {
        positive: sentimentRaw.positif ?? 0,
        neutral: sentimentRaw.netral ?? 0,
        negative: sentimentRaw.negatif ?? 0,
      },
      newSubTopics: d.new_subtopics_found ?? [],
    };
  });

  return { days, platformKeys: sortPlatformKeys(platformSet) };
}
