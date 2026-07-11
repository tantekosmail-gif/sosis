export interface NormalizedEntity {
  type: string;
  text: string;
  mentions: number;
}

// Bentuk response GET /entities/top/{keyword_id} terverifikasi (wrapper +
// nama field top_entities), tapi isi tiap entity di dalamnya belum pernah
// ketemu contoh terisi. Prioritas nama field ikut konvensi yang sudah
// terkonfirmasi dipakai backend ini di /news/analysis/summary (NewsEntity:
// {text, type, mentions}) — kemungkinan besar konsisten, tapi tetap toleran
// terhadap nama alternatif sebagai jaring pengaman.
export function normalizeEntities(raw: any): NormalizedEntity[] {
  const body = raw?.data ?? raw;
  const list = body?.top_entities ?? body?.items ?? body?.entities ?? (Array.isArray(body) ? body : []);
  if (!Array.isArray(list)) return [];

  return list.map((e: any) => ({
    type: e.type ?? e.entity_type ?? "OTHER",
    text: e.text ?? e.name ?? e.entity ?? "-",
    mentions: e.mentions ?? e.count ?? e.total ?? 0,
  }));
}

export function mergeEntities(lists: NormalizedEntity[][], maxItems = 20): NormalizedEntity[] {
  const merged = new Map<string, NormalizedEntity>();
  for (const list of lists) {
    for (const entity of list) {
      const key = `${entity.type}::${entity.text}`;
      const existing = merged.get(key);
      merged.set(key, existing ? { ...existing, mentions: existing.mentions + entity.mentions } : entity);
    }
  }
  return Array.from(merged.values())
    .sort((a, b) => b.mentions - a.mentions)
    .slice(0, maxItems);
}
