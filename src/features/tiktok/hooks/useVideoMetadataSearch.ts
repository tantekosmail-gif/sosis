"use client";

import { useCallback, useRef, useState } from "react";

import {
  getTikTokVideoDetail,
  getTikTokVideoMetadata,
  type TikTokVideoMetadataDetail,
  type TikTokVideoMetadataItem,
  type TikTokVideoMetadataParams,
} from "../services/videoMetadata.service";

export type { TikTokVideoMetadataDetail, TikTokVideoMetadataItem };

export type VideoSearchSort = "relevance" | "newest" | "popular";

const SORT_PARAMS: Record<VideoSearchSort, Pick<TikTokVideoMetadataParams, "sortBy" | "order">> = {
  relevance: { sortBy: "trend_score", order: "desc" },
  newest: { sortBy: "published_at", order: "desc" },
  popular: { sortBy: "views", order: "desc" },
};

export const PAGE_SIZE = 10;

// Backend /tiktok/metadata cuma punya parameter topic/search/sort_by/order/
// page/page_size -- tidak ada filter tanggal/usia/akun server-side. Jadi
// begitu akun/topik/rentang-tanggal difilter di client, paginasi server
// (dihitung dari total TANPA filter) jadi tidak sesuai lagi dengan hasil yang
// sebenarnya ditampilkan. fetchAll() menarik semua halaman (dibatasi
// MAX_BULK_ITEMS) supaya paginasi bisa dihitung ulang dari hasil yang SUDAH
// difilter di client (lihat VideoSearchTab).
const BULK_PAGE_SIZE = 100;
const MAX_BULK_ITEMS = 1000;

export function useVideoMetadataSearch() {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<VideoSearchSort>("newest");
  const [items, setItems] = useState<TikTokVideoMetadataItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [allItems, setAllItems] = useState<TikTokVideoMetadataItem[] | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);
  const [videoDetail, setVideoDetail] = useState<TikTokVideoMetadataDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  // Dipakai loadMore()/changeSort()/fetchAll() supaya tahu keyword & sort
  // aktif tanpa ikut jadi dependency callback (menghindari stale closure
  // kalau berubah di antara render tanpa perlu bikin ulang fungsi tsb).
  const activeQuery = useRef({ keyword: "", sortBy: "newest" as VideoSearchSort });

  const fetchPage = useCallback(async (q: string, sort: VideoSearchSort, targetPage: number) => {
    const trimmed = q.trim();
    setKeyword(trimmed);
    activeQuery.current = { keyword: trimmed, sortBy: sort };
    // Batch lama dari mode "semua hasil" (kalau ada) sudah tidak valid lagi
    // begitu keyword/sort ganti -- fetchAll() dipanggil ulang kalau perlu.
    setAllItems(null);

    if (!trimmed) {
      setItems(null);
      setTotal(0);
      setPage(1);
      setTotalPages(1);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const data = await getTikTokVideoMetadata({
        search: trimmed,
        page: targetPage,
        pageSize: PAGE_SIZE,
        ...SORT_PARAMS[sort],
      });
      setItems(data.items);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari video");
      setItems(null);
      setTotal(0);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback((q: string) => fetchPage(q, activeQuery.current.sortBy, 1), [fetchPage]);

  const searchKeywords = useCallback(
    (keywords: string[]) => fetchPage(keywords.join(', '), activeQuery.current.sortBy, 1),
    [fetchPage],
  );

  // Ganti urutan mengubah parameter sort_by/order di server, jadi halaman
  // di-fetch ulang dari halaman 1 dengan urutan server yang baru.
  const changeSort = useCallback(
    (sort: VideoSearchSort) => {
      setSortBy(sort);
      if (activeQuery.current.keyword) void fetchPage(activeQuery.current.keyword, sort, 1);
    },
    [fetchPage],
  );

  // Load more menambah (append) halaman berikutnya ke items yang sudah ada --
  // beda dari fetchPage yang mengganti seluruh isi items (dipakai search()/
  // changeSort() saat mulai dari halaman 1).
  const loadMore = useCallback(async () => {
    const { keyword: activeKeyword, sortBy: activeSort } = activeQuery.current;
    if (!activeKeyword || loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    try {
      const data = await getTikTokVideoMetadata({
        search: activeKeyword,
        page: page + 1,
        pageSize: PAGE_SIZE,
        ...SORT_PARAMS[activeSort],
      });
      setItems((prev) => [...(prev ?? []), ...data.items]);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.total_pages);
    } catch {
      // Gagal load more tidak boleh menghapus hasil yang sudah tampil --
      // biarkan user coba klik "muat lebih banyak" lagi.
    } finally {
      setLoadingMore(false);
    }
  }, [page, totalPages, loadingMore]);

  const fetchAll = useCallback(async () => {
    const { keyword: activeKeyword, sortBy: activeSort } = activeQuery.current;
    if (!activeKeyword) return;

    setLoadingAll(true);
    try {
      let all: TikTokVideoMetadataItem[] = [];
      let currentPage = 1;
      let pagesAvailable = 1;

      do {
        const data = await getTikTokVideoMetadata({
          search: activeKeyword,
          page: currentPage,
          pageSize: BULK_PAGE_SIZE,
          ...SORT_PARAMS[activeSort],
        });
        all = all.concat(data.items);
        pagesAvailable = data.total_pages;
        currentPage += 1;
      } while (currentPage <= pagesAvailable && all.length < MAX_BULK_ITEMS);

      setAllItems(all);
    } catch {
      setAllItems(null);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  // Detail (deskripsi lengkap + komentar) tidak ikut di response list --
  // cuma saved_comment_count (angka). Di-fetch on-demand saat panel dibuka,
  // bukan sekaligus utk semua item di halaman.
  const openVideoDetail = useCallback(async (id: string) => {
    setSelectedVideoId(id);
    setVideoDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      setVideoDetail(await getTikTokVideoDetail(id));
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Gagal memuat detail video");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closeVideoDetail = useCallback(() => {
    setSelectedVideoId(null);
    setVideoDetail(null);
    setDetailError("");
  }, []);

  return {
    keyword,
    items,
    total,
    page,
    totalPages,
    loading,
    loadingMore,
    error,
    search,
    searchKeywords,
    sortBy,
    changeSort,
    loadMore,
    hasMore: page < totalPages,
    allItems,
    loadingAll,
    fetchAll,
    selectedVideoId,
    videoDetail,
    detailLoading,
    detailError,
    openVideoDetail,
    closeVideoDetail,
  };
}
