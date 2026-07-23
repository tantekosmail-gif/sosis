"use client";

import { useCallback, useState } from "react";
import { Star } from "lucide-react";

import VideoSearchGrid from "@/components/crossPlatform/VideoSearchGrid";
import VideoDetailPanel from "@/components/crossPlatform/VideoDetailPanel";
import { useFavoriteVideos } from "../hooks/useFavoriteVideos";
import {
  fetchCrossPlatformDetail,
  type CrossPlatformSource,
  type CrossPlatformVideoDetail,
  type CrossPlatformVideoItem,
} from "../services/videoSearch.service";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

export default function FavoritesTab() {
  const { t } = useTranslation();
  const { favorites, isFavorite, toggleFavorite } = useFavoriteVideos();

  const [selected, setSelected] = useState<{ platform: CrossPlatformSource; id: string } | null>(null);
  const [videoDetail, setVideoDetail] = useState<CrossPlatformVideoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const selectedVideoId = selected ? `${selected.platform}:${selected.id}` : null;

  const openVideoDetail = useCallback(async (item: CrossPlatformVideoItem) => {
    setSelected({ platform: item.platform, id: item.id });
    setVideoDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      setVideoDetail(await fetchCrossPlatformDetail(item.platform, item.id));
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Gagal memuat detail video");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center dark:border-slate-700 dark:bg-slate-900">
        <Star size={28} className="text-slate-300 dark:text-slate-600" />
        <p className="text-sm text-slate-400 dark:text-slate-500">{t.crossPlatformSearchTab.noFavorites}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_minmax(0,1fr)] xl:items-start">
      <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="scrollbar-thin max-h-[70vh] overflow-y-auto pr-1">
          <VideoSearchGrid
            items={favorites}
            onSelectVideo={openVideoDetail}
            selectedVideoId={selectedVideoId}
            isFavorite={(item) => isFavorite(item.platform, item.id)}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>

      <div className="scrollbar-thin rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 xl:sticky xl:top-4 xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
        <VideoDetailPanel
          detail={videoDetail}
          loading={detailLoading}
          error={detailError}
          isFavorite={selected ? isFavorite(selected.platform, selected.id) : false}
          onToggleFavorite={videoDetail ? () => toggleFavorite(videoDetail) : undefined}
        />
      </div>
    </div>
  );
}
