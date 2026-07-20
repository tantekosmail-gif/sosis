"use client";

import { useMemo, useState } from "react";

// Sama seperti usePagination, tapi jendela tampilan bertambah (0..visibleCount)
// alih-alih berpindah per-halaman -- untuk pola "Muat Lebih Banyak".
export function useLoadMore<T>(items: T[] | null | undefined, pageSize = 12) {
  const safeItems = useMemo(() => items ?? [], [items]);

  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [trackedItems, setTrackedItems] = useState(items);

  if (items !== trackedItems) {
    setTrackedItems(items);
    setVisibleCount(pageSize);
  }

  const visible = useMemo(() => safeItems.slice(0, visibleCount), [safeItems, visibleCount]);
  const hasMore = visibleCount < safeItems.length;

  function loadMore() {
    setVisibleCount((c) => c + pageSize);
  }

  return { visible, hasMore, loadMore };
}
