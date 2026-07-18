export function matchesDateRange(publishedAt: string | undefined, dateFrom: string, dateTo: string): boolean {
  if (!dateFrom && !dateTo) return true;
  if (!publishedAt) return false;

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return false;

  if (dateFrom) {
    const from = new Date(dateFrom);
    from.setHours(0, 0, 0, 0);
    if (date < from) return false;
  }

  if (dateTo) {
    const to = new Date(dateTo);
    to.setHours(23, 59, 59, 999);
    if (date > to) return false;
  }

  return true;
}
