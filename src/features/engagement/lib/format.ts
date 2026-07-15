export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("id-ID");
}

// /metrics/trend hanya mengirim tanggal yang mention-nya > 0 — sumbu waktu
// harus diisi sendiri di frontend supaya garis grafik tidak melompat.
export function fillDailySeries(
  series: { period: string; mentions: number }[],
  dateFrom: string,
  dateTo: string
): { date: string; mentions: number }[] {
  const byDay = new Map<string, number>();
  for (const point of series) {
    byDay.set(point.period.slice(0, 10), point.mentions);
  }

  const result: { date: string; mentions: number }[] = [];
  const cursor = new Date(dateFrom);
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(dateTo);
  end.setUTCHours(0, 0, 0, 0);

  while (cursor.getTime() <= end.getTime()) {
    const key = cursor.toISOString().slice(0, 10);
    result.push({ date: key, mentions: byDay.get(key) ?? 0 });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return result;
}
