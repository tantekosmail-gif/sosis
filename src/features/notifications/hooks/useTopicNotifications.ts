"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getUnreadNotificationCount,
  isNotificationRecent,
  listRecentUnreadNotifications,
  markNotificationRead,
  type TopicNotification,
} from "../services/notification.service";

// Backend cek topik viral tiap jam dan tidak ada push/websocket — badge di-poll
// tiap 20 detik sesuai rekomendasi dokumentasi API.
const POLL_INTERVAL_MS = 20000;

export function useTopicNotifications() {
  const [items, setItems] = useState<TopicNotification[]>([]);
  const [loading, setLoading] = useState(false);
  // Id yang sudah ditandai dibaca secara optimistis di sesi ini — poll yang
  // datang sebelum server selesai memproses POST read tidak boleh
  // menghidupkan kembali notifikasi yang barusan diklik.
  const readIdsRef = useRef(new Set<string>());

  // Badge dihitung dari daftar yang sama dengan yang dirender panel, jadi
  // angkanya tidak pernah beda dengan yang benar-benar terlihat.
  const unreadCount = items.filter((n) => !n.isRead && isNotificationRecent(n)).length;

  // unread-count dari server itu all-time (termasuk backlog lama yang sudah
  // tidak ditampilkan di panel). Endpoint itu tetap dipakai duluan sebagai cek
  // murah — kalau 0 selesai di situ — kalau tidak, susuri daftar unread dan
  // simpan hanya yang masih relevan (listRecentUnreadNotifications).
  const refresh = useCallback(async (withSpinner = false) => {
    if (withSpinner) setLoading(true);
    try {
      const rawCount = await getUnreadNotificationCount();
      const fresh =
        rawCount === 0
          ? []
          : (await listRecentUnreadNotifications()).map((n) =>
              readIdsRef.current.has(n.id) ? { ...n, isRead: true } : n,
            );
      setItems((prev) => {
        const same =
          prev.length === fresh.length &&
          prev.every((p, i) => p.id === fresh[i].id && p.isRead === fresh[i].isRead);
        return same ? prev : fresh;
      });
    } catch (err) {
      console.error("refreshTopicNotifications failed:", err);
    } finally {
      if (withSpinner) setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(() => refresh(), POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refresh]);

  const loadList = useCallback(() => refresh(true), [refresh]);

  const markRead = useCallback(async (id: string) => {
    readIdsRef.current.add(id);
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await markNotificationRead(id);
    } catch (err) {
      // Batal dari daftar optimistis supaya poll berikutnya memulihkannya
      // sebagai unread — gagal di server tidak boleh menghilangkan notifikasi.
      readIdsRef.current.delete(id);
      console.error("markNotificationRead failed:", err);
    }
  }, []);

  // Backend belum punya endpoint bulk-read, jadi "tandai semua dibaca" memakai
  // endpoint read per-item secara paralel; item yang gagal dipulihkan lewat
  // poll berikutnya.
  const markAllRead = useCallback(async () => {
    const unreadIds = items.filter((n) => !n.isRead).map((n) => n.id);
    if (unreadIds.length === 0) return;
    unreadIds.forEach((id) => readIdsRef.current.add(id));
    setItems((prev) => prev.map((n) => ({ ...n, isRead: true })));
    const results = await Promise.allSettled(unreadIds.map((id) => markNotificationRead(id)));
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        readIdsRef.current.delete(unreadIds[i]);
        console.error(`markNotificationRead(${unreadIds[i]}) failed:`, result.reason);
      }
    });
  }, [items]);

  return { items, unreadCount, loading, loadList, markRead, markAllRead };
}
