"use client";

import { useState, useEffect, useCallback } from "react";

export type NotificationType = "success" | "error" | "info";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  createdAt: string;
  read: boolean;
}

const KEY = "app_notifications";
const MAX = 30;

let listeners: Array<() => void> = [];

function readAll(): AppNotification[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(items: AppNotification[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((listen) => listen());
}

// Dipanggil dari mana saja (hook, service) untuk mencatat notifikasi baru —
// tidak terikat siklus render komponen tertentu.
export function pushNotification(input: { type: NotificationType; title: string; message?: string }) {
  const next: AppNotification[] = [
    { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString(), read: false },
    ...readAll(),
  ].slice(0, MAX);
  writeAll(next);
  return next;
}

export function useNotifications() {
  const [items, setItems] = useState<AppNotification[]>([]);

  useEffect(() => {
    setItems(readAll());
    const listen = () => setItems(readAll());
    listeners.push(listen);
    return () => {
      listeners = listeners.filter((l) => l !== listen);
    };
  }, []);

  const markAllRead = useCallback(() => {
    writeAll(readAll().map((n) => ({ ...n, read: true })));
  }, []);

  const clear = useCallback(() => {
    writeAll([]);
  }, []);

  const unreadCount = items.filter((n) => !n.read).length;

  return { items, unreadCount, markAllRead, clear };
}
