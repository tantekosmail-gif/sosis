"use client";

import { useCallback, useRef, useState } from "react";

import {
  fetchCrossPlatformDetail,
  fetchCrossPlatformPage,
  type CrossPlatformSource,
  type CrossPlatformVideoDetail,
  type CrossPlatformVideoItem,
} from "../services/videoSearch.service";

export type VideoSearchSort = "relevance" | "newest" | "popular";

const SORT_PARAMS: Record<VideoSearchSort, { sortBy: "trend_score" | "views" | "published_at"; order: "asc" | "desc" }> = {
  relevance: { sortBy: "trend_score", order: "desc" },
  newest: { sortBy: "published_at", order: "desc" },
  popular: { sortBy: "views", order: "desc" },
};

export const PAGE_SIZE = 10;

function sortItems(items: CrossPlatformVideoItem[], sort: VideoSearchSort): CrossPlatformVideoItem[] {
  const sorted = [...items];
  if (sort === "newest") return sorted.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  if (sort === "popular") return sorted.sort((a, b) => b.metrics.views - a.metrics.views);
  return sorted.sort((a, b) => b.scores.trend_score - a.scores.trend_score);
}

export function useCrossPlatformVideoSearch() {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<VideoSearchSort>("relevance");
  const [items, setItems] = useState<CrossPlatformVideoItem[] | null>(null);
  const [youtubeTotal, setYoutubeTotal] = useState(0);
  const [tiktokTotal, setTiktokTotal] = useState(0);
  const [youtubePage, setYoutubePage] = useState(1);
  const [tiktokPage, setTiktokPage] = useState(1);
  const [youtubeTotalPages, setYoutubeTotalPages] = useState(1);
  const [tiktokTotalPages, setTiktokTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState<{ platform: CrossPlatformSource; id: string } | null>(null);
  const [videoDetail, setVideoDetail] = useState<CrossPlatformVideoDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Dipakai loadMore()/changeSort() supaya tahu keyword & sort aktif tanpa
  // ikut jadi dependency callback (menghindari stale closure kalau berubah
  // di antara render tanpa perlu bikin ulang fungsi tsb).
  const activeQuery = useRef({ keyword: "", sortBy: "relevance" as VideoSearchSort });

  const runSearch = useCallback(async (q: string, sort: VideoSearchSort) => {
    const trimmed = q.trim();
    setKeyword(trimmed);
    activeQuery.current = { keyword: trimmed, sortBy: sort };

    if (!trimmed) {
      setItems(null);
      setYoutubeTotal(0);
      setTiktokTotal(0);
      setYoutubePage(1);
      setTiktokPage(1);
      setYoutubeTotalPages(1);
      setTiktokTotalPages(1);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await fetchCrossPlatformPage({
        search: trimmed,
        page: 1,
        pageSize: PAGE_SIZE,
        ...SORT_PARAMS[sort],
      });
      setItems(sortItems(data.items, sort));
      setYoutubeTotal(data.youtubeTotal);
      setTiktokTotal(data.tiktokTotal);
      setYoutubePage(1);
      setTiktokPage(1);
      setYoutubeTotalPages(data.youtubeTotalPages);
      setTiktokTotalPages(data.tiktokTotalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari video");
      setItems(null);
      setYoutubeTotal(0);
      setTiktokTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback((q: string) => runSearch(q, activeQuery.current.sortBy), [runSearch]);

  const changeSort = useCallback(
    (sort: VideoSearchSort) => {
      setSortBy(sort);
      if (activeQuery.current.keyword) void runSearch(activeQuery.current.keyword, sort);
    },
    [runSearch],
  );

  const hasMore = youtubePage < youtubeTotalPages || tiktokPage < tiktokTotalPages;

  // Halaman berikutnya diambil dari MASING-MASING platform yang masih punya
  // sisa halaman (bisa cuma satu platform kalau yang lain sudah habis), lalu
  // digabung ke items yang sudah ada dan diurutkan ULANG dari awal -- item
  // baru bisa saja punya trend_score/views lebih tinggi dari sebagian item
  // yang sudah tampil, jadi urutan gabungannya tidak boleh cuma di-append.
  const loadMore = useCallback(async () => {
    const { keyword: activeKeyword, sortBy: activeSort } = activeQuery.current;
    if (!activeKeyword || loadingMore) return;

    const nextYoutubePage = youtubePage < youtubeTotalPages ? youtubePage + 1 : youtubePage;
    const nextTiktokPage = tiktokPage < tiktokTotalPages ? tiktokPage + 1 : tiktokPage;
    if (nextYoutubePage === youtubePage && nextTiktokPage === tiktokPage) return;

    setLoadingMore(true);
    try {
      const requests: Promise<void>[] = [];
      let newItems: CrossPlatformVideoItem[] = [];

      if (nextYoutubePage !== youtubePage) {
        requests.push(
          fetchCrossPlatformPage({
            search: activeKeyword,
            page: nextYoutubePage,
            pageSize: PAGE_SIZE,
            ...SORT_PARAMS[activeSort],
          }).then((data) => {
            newItems = newItems.concat(data.items.filter((item) => item.platform === "youtube"));
            setYoutubeTotal(data.youtubeTotal);
            setYoutubeTotalPages(data.youtubeTotalPages);
            setYoutubePage(nextYoutubePage);
          }),
        );
      }

      if (nextTiktokPage !== tiktokPage) {
        requests.push(
          fetchCrossPlatformPage({
            search: activeKeyword,
            page: nextTiktokPage,
            pageSize: PAGE_SIZE,
            ...SORT_PARAMS[activeSort],
          }).then((data) => {
            newItems = newItems.concat(data.items.filter((item) => item.platform === "tiktok"));
            setTiktokTotal(data.tiktokTotal);
            setTiktokTotalPages(data.tiktokTotalPages);
            setTiktokPage(nextTiktokPage);
          }),
        );
      }

      await Promise.all(requests);
      setItems((prev) => sortItems([...(prev ?? []), ...newItems], activeSort));
    } catch {
      // Gagal load more tidak boleh menghapus hasil yang sudah tampil --
      // biarkan user coba klik "muat lebih banyak" lagi.
    } finally {
      setLoadingMore(false);
    }
  }, [youtubePage, tiktokPage, youtubeTotalPages, tiktokTotalPages, loadingMore]);

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

  const closeVideoDetail = useCallback(() => {
    setSelected(null);
    setVideoDetail(null);
    setDetailError("");
  }, []);

  return {
    keyword,
    items,
    total: youtubeTotal + tiktokTotal,
    loading,
    loadingMore,
    error,
    search,
    sortBy,
    changeSort,
    loadMore,
    hasMore,
    selectedVideoId: selected ? `${selected.platform}:${selected.id}` : null,
    videoDetail,
    detailLoading,
    detailError,
    openVideoDetail,
    closeVideoDetail,
  };
}
