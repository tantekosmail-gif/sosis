"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { Bell, LogOut, ChevronDown, Clock, Menu, Moon, Sun, CheckCircle2, XCircle, Info, Trash2 } from "lucide-react";
import { getSettings, setThemeSetting, type Theme } from "@/features/settings/hooks/useSettings";
import { useNotifications, type NotificationType } from "@/features/notifications/hooks/useNotifications";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { applyTheme } from "@/lib/theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NOTIFICATION_ICON: Record<NotificationType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const NOTIFICATION_COLOR: Record<NotificationType, string> = {
  success: "text-emerald-600",
  error: "text-red-500",
  info: "text-indigo-600",
};

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

function readUser(): User {
  try {
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
  } catch {}
  return {};
}

export default function AppHeader({ onOpenHistory, historyCount = 0, onOpenSidebar }: Props) {
  const router = useRouter();
  const [user] = useState<User>(readUser);
  const [theme, setTheme] = useState<Theme>(() => getSettings().theme);
  const { items: notifications, unreadCount, markAllRead, clear } = useNotifications();
  const { language, setLanguage, t } = useTranslation();

  function toggleLanguage() {
    setLanguage(language === "id" ? "en" : "id");
  }

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
    setThemeSetting(next);
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  const initials = (user.username ?? "A").charAt(0).toUpperCase();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-3 sm:px-6 flex items-center justify-between gap-3 shrink-0">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition lg:hidden"
          aria-label="Buka menu"
        >
          <Menu size={17} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-900 dark:text-slate-100">{t.header.dashboardTitle}</h2>
          <p className="hidden truncate text-xs text-slate-400 dark:text-slate-500 sm:block">{t.header.dashboardSubtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* History button */}
        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="relative flex h-9 items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 px-2.5 sm:px-3 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <Clock size={15} />
            <span className="hidden sm:inline text-xs font-medium">{t.header.history}</span>
            {historyCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>
        )}

        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          aria-label={t.header.language}
          title={t.header.language}
        >
          {language.toUpperCase()}
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          aria-label={theme === "dark" ? t.header.lightMode : t.header.darkMode}
          title={theme === "dark" ? t.header.lightMode : t.header.darkMode}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Notification */}
        <DropdownMenu onOpenChange={(open) => !open && unreadCount > 0 && markAllRead()}>
          <DropdownMenuTrigger asChild>
            <button
              className="relative h-9 w-9 shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              aria-label={t.header.notifications}
            >
              <Bell size={17} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.header.notifications}</p>
              {notifications.length > 0 && (
                <button
                  onClick={clear}
                  className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={12} /> {t.header.clearAll}
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">{t.header.noNotifications}</p>
              ) : (
                notifications.map((n) => {
                  const Icon = NOTIFICATION_ICON[n.type];
                  return (
                    <div
                      key={n.id}
                      className={`flex gap-3 border-b border-slate-50 dark:border-slate-800/60 px-4 py-3 last:border-0 ${
                        n.read ? "" : "bg-indigo-50/50 dark:bg-indigo-950/20"
                      }`}
                    >
                      <Icon size={16} className={`mt-0.5 shrink-0 ${NOTIFICATION_COLOR[n.type]}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{n.title}</p>
                        {n.message && (
                          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{n.message}</p>
                        )}
                        <p className="mt-1 text-[11px] text-slate-300 dark:text-slate-600">
                          {formatDistanceToNow(new Date(n.createdAt), {
                            addSuffix: true,
                            locale: language === "id" ? idLocale : undefined,
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Divider */}
        <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-700 sm:block" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex shrink-0 items-center gap-2.5 rounded-xl px-1.5 py-1 transition hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow shadow-indigo-500/30">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                  {user.username ?? "Administrator"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{user.role ?? "Admin"}</p>
              </div>
              <ChevronDown size={14} className="hidden text-slate-400 dark:text-slate-500 sm:block" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2.5 py-2">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {user.username ?? "Administrator"}
              </p>
              <p className="truncate text-xs text-slate-400 dark:text-slate-500">{user.email ?? user.role ?? "Admin"}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout}>
              <LogOut size={14} /> {t.header.logout}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
