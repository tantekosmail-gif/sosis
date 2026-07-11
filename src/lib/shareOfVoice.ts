export interface ShareOfVoiceItem {
  keywordId: string;
  keyword: string;
  mentions: number;
  percentage: number;
}

// Bentuk response GET /metrics/sov terverifikasi dari network tab:
// { success, data: { items: [{ keyword_id, keyword, mentions, sov_pct }], total_mentions, period } }
export function normalizeShareOfVoice(raw: any, keywordNameById: Record<string, string> = {}): ShareOfVoiceItem[] {
  const body = raw?.data ?? raw;
  const list = body?.items ?? (Array.isArray(body) ? body : []);
  if (!Array.isArray(list)) return [];

  const items = list.map((item: any) => {
    const keywordId = item.keyword_id ?? item.id ?? "";
    return {
      keywordId,
      keyword: item.keyword ?? item.name ?? keywordNameById[keywordId] ?? "-",
      mentions: item.mentions ?? item.total_mentions ?? item.count ?? item.total ?? 0,
      percentage: item.sov_pct ?? item.percentage ?? item.share ?? 0,
    };
  });

  const totalMentions = items.reduce((sum: number, i: ShareOfVoiceItem) => sum + i.mentions, 0);
  return items
    .map((i: ShareOfVoiceItem) => ({
      ...i,
      percentage: i.percentage || (totalMentions > 0 ? (i.mentions / totalMentions) * 100 : 0),
    }))
    .sort((a: ShareOfVoiceItem, b: ShareOfVoiceItem) => b.percentage - a.percentage);
}
