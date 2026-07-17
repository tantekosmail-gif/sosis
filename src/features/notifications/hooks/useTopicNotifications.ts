"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getUnreadNotificationCount,
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

  const refreshUnreadCount = useCallback(async () => {
    try {
      setUnreadCount(await getUnreadNotificationCount());
    } catch (err) {
      console.error("getUnreadNotificationCount failed:", err);
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
