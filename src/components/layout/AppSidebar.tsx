"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AtSign, Feather, Flame, GitCompareArrows, Home, MessageCircle, Music2, Newspaper, Settings, Sparkles, SquareUser, X } from "lucide-react";

const menus = [
  { name: "Overview",            href: "/overview",          icon: Home            },
  { name: "YouTube",             href: "/youtube",           icon: Flame           },
  { name: "Instagram",           href: "/instagram",         icon: AtSign          },
  { name: "Facebook",            href: "/facebook",          icon: SquareUser      },
  { name: "Twitter/X",           href: "/twitter",           icon: Feather         },
  { name: "TikTok",              href: "/tiktok",            icon: Music2          },
  { name: "Berita",              href: "/news",              icon: Newspaper       },
  { name: "Bandingkan Platform", href: "/compare/social",    icon: GitCompareArrows },
  { name: "Cari Topik AI",       href: "/dashboard/trend",   icon: MessageCircle   },
  { name: "Settings",            href: "/settings",          icon: Settings        },
];

interface Props {
  open?: boolean;
  onClose?: () => void;
}

export default function AppSidebar({ open = false, onClose }: Props) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col bg-slate-900 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between gap-3 border-b border-slate-800 px-5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">MediaWatch</p>
              <p className="text-slate-500 text-[10px] mt-0.5">Media Monitoring</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 mt-2">
            Main Menu
          </p>
          {menus.map((menu) => {
            const Icon = menu.icon;
            const active = pathname === menu.href;

            return (
              <Link
                key={menu.name}
                href={menu.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {menu.name}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-3">
          <div className="rounded-xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 p-3">
            <p className="text-white text-xs font-semibold">Pro Plan</p>
            <p className="text-slate-400 text-[10px] mt-0.5">All platforms active</p>
            <div className="mt-2 h-1 rounded-full bg-slate-700">
              <div className="h-1 w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
