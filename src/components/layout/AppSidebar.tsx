"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, LayoutDashboard, Settings, Sparkles, TrendingUp } from "lucide-react";

const menus = [
  { name: "Dashboard",           href: "/dashboard",         icon: LayoutDashboard },
  { name: "Viral Video",         href: "/viral",             icon: Flame           },
  { name: "Instagram Trending",  href: "/instagram/trending", icon: TrendingUp     },
  { name: "Settings",            href: "/settings",          icon: Settings        },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-slate-900 flex flex-col shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center gap-3 px-5 border-b border-slate-800">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles size={15} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-none">SentimentAI</p>
          <p className="text-slate-500 text-[10px] mt-0.5">Social Intelligence</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
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
  );
}
