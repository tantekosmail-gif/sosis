export type VideoAgeFilter = "all" | "today" | "week" | "month";

export function matchesAgeFilter(publishedAt: string | undefined, age: VideoAgeFilter): boolean {
  if (age === "all") return true;
  if (!publishedAt) return false;

  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return false;

  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (age === "today") return diffDays <= 1;
  if (age === "week") return diffDays <= 7;
  return diffDays <= 30;
}
