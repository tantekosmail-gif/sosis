"use client";

import { useCallback, useRef, useState } from "react";

import {
  getTwitterMetadata,
  getTwitterMetadataDetail,
  type TwitterMetadataDetail,
  type TwitterMetadataItem,
  type TwitterMetadataParams,
} from "../services/metadata.service";

export type { TwitterMetadataItem, TwitterMetadataDetail };

export type TwitterMetadataSort = "relevance" | "newest" | "popular";

const SORT_PARAMS: Record<TwitterMetadataSort, Pick<TwitterMetadataParams, "sortBy" | "order">> = {
  relevance: { sortBy: "trend_score", order: "desc" },
  newest: { sortBy: "published_at", order: "desc" },
  popular: { sortBy: "likes", order: "desc" },
};

export const PAGE_SIZE = 10;

const BULK_PAGE_SIZE = 100;
const MAX_BULK_ITEMS = 1000;

function sortMergedItems(items: TwitterMetadataItem[], sort: TwitterMetadataSort): TwitterMetadataItem[] {
  const sorted = [...items];
  if (sort === "newest") {
    return sorted.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }
  if (sort === "popular") return sorted.sort((a, b) => (b.metrics.likes ?? 0) - (a.metrics.likes ?? 0));
  return sorted.sort((a, b) => (b.scores.trend_score ?? 0) - (a.scores.trend_score ?? 0));
}

async function fetchMergedPage(
  keywords: string[],
  sort: TwitterMetadataSort,
  page: number,
  pageSize: number,
): Promise<{ items: TwitterMetadataItem[]; total: number; totalPages: number }> {
  const pages = await Promise.all(
    keywords.map((kw) => getTwitterMetadata({ search: kw, page, pageSize, ...SORT_PARAMS[sort] })),
  );

  const merged = new Map<string, TwitterMetadataItem>();
  let total = 0;
  let totalPages = 1;
  pages.forEach((data) => {
    data.items.forEach((item) => merged.set(item.id, item));
    total += data.total;
    totalPages = Math.max(totalPages, data.total_pages);
  });

  return { items: sortMergedItems(Array.from(merged.values()), sort), total, totalPages };
}

export function useTwitterMetadataSearch() {
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<TwitterMetadataSort>("newest");
  const [items, setItems] = useState<TwitterMetadataItem[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [allItems, setAllItems] = useState<TwitterMetadataItem[] | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [postDetail, setPostDetail] = useState<TwitterMetadataDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const activeQuery = useRef<{ keywords: string[]; sortBy: TwitterMetadataSort }>({ keywords: [], sortBy: "newest" });

  const fetchPage = useCallback(async (keywords: string[], sort: TwitterMetadataSort, targetPage: number) => {
    const uniqueKeywords = Array.from(new Set(keywords.map((k) => k.trim()).filter(Boolean)));
    activeQuery.current = { keywords: uniqueKeywords, sortBy: sort };
    setKeyword(uniqueKeywords.join(", "));
    setAllItems(null);

    if (uniqueKeywords.length === 0) {
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
      const data = await fetchMergedPage(uniqueKeywords, sort, targetPage, PAGE_SIZE);
      setItems(data.items);
      setTotal(data.total);
      setPage(targetPage);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mencari post Twitter");
      setItems(null);
      setTotal(0);
      setPage(1);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback((q: string) => fetchPage([q], activeQuery.current.sortBy, 1), [fetchPage]);

  const searchKeywords = useCallback(
    (keywords: string[]) => fetchPage(keywords, activeQuery.current.sortBy, 1),
    [fetchPage],
  );

  const changeSort = useCallback(
    (sort: TwitterMetadataSort) => {
      setSortBy(sort);
      if (activeQuery.current.keywords.length > 0) void fetchPage(activeQuery.current.keywords, sort, 1);
    },
    [fetchPage],
  );

  const loadMore = useCallback(async () => {
    const { keywords: activeKeywords, sortBy: activeSort } = activeQuery.current;
    if (activeKeywords.length === 0 || loadingMore || page >= totalPages) return;

    setLoadingMore(true);
    try {
      const data = await fetchMergedPage(activeKeywords, activeSort, page + 1, PAGE_SIZE);
      setItems((prev) => {
        const merged = new Map((prev ?? []).map((item) => [item.id, item]));
        data.items.forEach((item) => merged.set(item.id, item));
        return sortMergedItems(Array.from(merged.values()), activeSort);
      });
      setTotal(data.total);
      setPage((p) => p + 1);
      setTotalPages(data.totalPages);
    } catch {
      // Gagal load more tidak boleh menghapus hasil yang sudah tampil.
    } finally {
      setLoadingMore(false);
    }
  }, [page, totalPages, loadingMore]);

  const fetchAll = useCallback(async () => {
    const { keywords: activeKeywords, sortBy: activeSort } = activeQuery.current;
    if (activeKeywords.length === 0) return;

    setLoadingAll(true);
    try {
      let all: TwitterMetadataItem[] = [];
      let currentPage = 1;
      let pagesAvailable = 1;

      do {
        const data = await fetchMergedPage(activeKeywords, activeSort, currentPage, BULK_PAGE_SIZE);
        const merged = new Map(all.map((item) => [item.id, item]));
        data.items.forEach((item) => merged.set(item.id, item));
        all = Array.from(merged.values());
        pagesAvailable = data.totalPages;
        currentPage += 1;
      } while (currentPage <= pagesAvailable && all.length < MAX_BULK_ITEMS);

      setAllItems(sortMergedItems(all, activeSort));
    } catch {
      setAllItems(null);
    } finally {
      setLoadingAll(false);
    }
  }, []);

  const openPostDetail = useCallback(async (id: string) => {
    setSelectedPostId(id);
    setPostDetail(null);
    setDetailError("");
    setDetailLoading(true);
    try {
      setPostDetail(await getTwitterMetadataDetail(id));
    } catch (err) {
      setDetailError(err instanceof Error ? err.message : "Gagal memuat detail post");
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const closePostDetail = useCallback(() => {
    setSelectedPostId(null);
    setPostDetail(null);
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
    selectedPostId,
    postDetail,
    detailLoading,
    detailError,
    openPostDetail,
    closePostDetail,
  };
}
