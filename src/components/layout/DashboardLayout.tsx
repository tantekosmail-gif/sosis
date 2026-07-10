"use client";

import { ReactNode, useState } from "react";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

interface Props {
  children: ReactNode;
  onOpenHistory?: () => void;
  historyCount?: number;
}

const COLLAPSED_KEY = "sidebar_collapsed";

function readCollapsed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

export default function DashboardLayout({ children, onOpenHistory, historyCount }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(readCollapsed);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AppSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AppHeader
          onOpenHistory={onOpenHistory}
          historyCount={historyCount}
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6 max-w-screen-2xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
