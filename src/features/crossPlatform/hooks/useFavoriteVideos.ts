"use client";

import { useCallback, useEffect, useState } from "react";

import type { CrossPlatformSource, CrossPlatformVideoItem } from "../services/videoSearch.service";

const STORAGE_KEY = "cross_platform_favorites";

export interface FavoriteVideo extends CrossPlatformVideoItem {
  favorited_at: string;
}

function readStorage(): FavoriteVideo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteVideo[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(items: FavoriteVideo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Backend belum punya endpoint favorit, jadi disimpan sebagai snapshot item
// lengkap di localStorage (bukan cuma id) supaya tab Favorit tetap bisa
// menampilkan judul/metrik/skor tanpa perlu API tambahan untuk "get by ids".
export function useFavoriteVideos() {
  const [favorites, setFavorites] = useState<FavoriteVideo[]>([]);

  useEffect(() => {
    setFavorites(readStorage());
  }, []);

  const isFavorite = useCallback(
    (platform: CrossPlatformSource, id: string) => favorites.some((f) => f.platform === platform && f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((item: CrossPlatformVideoItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.platform === item.platform && f.id === item.id);
      const next = exists
        ? prev.filter((f) => !(f.platform === item.platform && f.id === item.id))
        : [{ ...item, favorited_at: new Date().toISOString() }, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const removeFavorite = useCallback((platform: CrossPlatformSource, id: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => !(f.platform === platform && f.id === id));
      writeStorage(next);
      return next;
    });
  }, []);

  return { favorites, isFavorite, toggleFavorite, removeFavorite };
}
