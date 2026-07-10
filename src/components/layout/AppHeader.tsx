"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, LogOut, ChevronDown, Clock, Menu } from "lucide-react";

interface User {
  username?: string;
  email?: string;
  role?: string;
}

interface Props {
  onOpenHistory?: () => void;
  historyCount?: number;
  onOpenSidebar?: () => void;
}

export default function AppHeader({ onOpenHistory, historyCount = 0, onOpenSidebar }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const initials = (user.username ?? "A").charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={17} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-900">MediaWatch Dashboard</h2>
          <p className="hidden truncate text-xs text-slate-400 sm:block">Social Media & News Monitoring</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* History button */}
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="relative flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-2.5 sm:px-3 text-sm text-slate-500 hover:bg-slate-50 transition"
          >
            <Clock size={15} />
            <span className="hidden sm:inline text-xs font-medium">Riwayat</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        )}

        {/* Notification */}
        <button className="relative h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 sm:block" />

        {/* User */}
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow shadow-indigo-500/30">
            {initials}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">
              {user.username ?? "Administrator"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{user.role ?? "Admin"}</p>
          </div>
          <ChevronDown size={14} className="hidden text-slate-400 sm:block" />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-2.5 sm:px-3 py-2 text-xs font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
