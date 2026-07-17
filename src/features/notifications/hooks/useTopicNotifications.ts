"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getUnreadNotificationCount,
  isNotificationRecent,
  listNotifications,
  markNotificationRead,
  type TopicNotification,
} from "../services/notification.service";

// Backend cek topik viral tiap jam dan tidak ada push/websocket — badge di-poll
// tiap 20 detik sesuai rekomendasi dokumentasi API.
const POLL_INTERVAL_MS = 20000;

export function useTopicNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [items, setItems] = useState<TopicNotification[]>([]);
  const [loading, setLoading] = useState(false);

  // unread-count dari server itu all-time (termasuk backlog lama yang sudah
  // tidak ditampilkan di panel), jadi angkanya bisa menggelembung ("99+")
  // padahal panel cuma nampilin beberapa. Endpoint itu tetap dipakai duluan
  // sebagai cek murah — kalau 0 selesai di situ — tapi begitu ada yang unread,
  // ambil daftarnya dan hitung ulang cuma yang masih relevan (isNotificationRecent),
  // supaya angka badge selalu sama dengan yang benar-benar akan terlihat.
  const refreshUnreadCount = useCallback(async () => {
    try {
      const rawCount = await getUnreadNotificationCount();
      if (rawCount === 0) {
        setUnreadCount(0);
        return;
      }
      const result = await listNotifications({ isRead: false, limit: 50 });
      setUnreadCount(result.items.filter(isNotificationRecent).length);
    } catch (err) {
      console.error("refreshUnreadCount failed:", err);
    }
  }, []);

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(refreshUnreadCount, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  const loadList = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listNotifications({ limit: 20 });
      setItems(result.items);
    } catch (err) {
      console.error("listNotifications failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await markNotificationRead(id);
    } catch (err) {
      console.error("markNotificationRead failed:", err);
    }
  }, []);

  return { items, unreadCount, loading, loadList, markRead };
}
