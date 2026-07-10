import { AtSign, Feather, Flame, Music2, Newspaper, SquareUser, type LucideIcon } from "lucide-react";

export const PLATFORM_ICON: Record<string, LucideIcon> = {
  youtube: Flame,
  instagram: AtSign,
  facebook: SquareUser,
  twitter: Feather,
  tiktok: Music2,
  news: Newspaper,
};

export function getPlatformIcon(platform: string): LucideIcon {
  return PLATFORM_ICON[platform] ?? Newspaper;
}
