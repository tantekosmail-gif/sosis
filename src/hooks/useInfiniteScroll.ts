"use client";

import { useEffect, useRef, type RefObject } from "react";

// Sentinel di akhir list yang di-observe lewat scroll container-nya sendiri
// (bukan viewport) -- begitu sentinel kelihatan (user scroll mendekati
// bawah), onLoadMore dipanggil otomatis. `enabled` dipakai supaya observer
// tidak dipasang sama sekali kalau memang tidak ada lagi data buat dimuat
// atau sedang dalam proses memuat (mencegah trigger dobel).
export function useInfiniteScroll(
  containerRef: RefObject<HTMLElement | null>,
  onLoadMore: () => void,
  enabled: boolean,
): RefObject<HTMLDivElement | null> {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { root: containerRef.current, rootMargin: "200px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [containerRef, onLoadMore, enabled]);

  return sentinelRef;
}
