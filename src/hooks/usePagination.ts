"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: T[] | null | undefined, pageSize = 12) {
  const safeItems = useMemo(() => items ?? [], [items]);

  const [page, setPage] = useState(1);
  const [trackedItems, setTrackedItems] = useState(items);

  if (items !== trackedItems) {
    setTrackedItems(items);
    setPage(1);
  }

  const totalPages = Math.max(1, Math.ceil(safeItems.length / pageSize));
  const clampedPage = Math.min(page, totalPages);

  const paginated = useMemo(
    () => safeItems.slice((clampedPage - 1) * pageSize, clampedPage * pageSize),
    [safeItems, clampedPage, pageSize]
  );

  return { page: clampedPage, totalPages, setPage, paginated };
}
