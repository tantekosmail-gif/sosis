"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronDown,
  FileText,
  Flame,
  GitCompareArrows,
  Home,
  Locate,
  Network,
  Newspaper,
  Radar,
  Radio,
  Settings,
  Share2,
  Tags,
  Video,
  X,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaThreads, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

// Menu dikelompokkan per fungsi: Ringkasan (dashboard lintas-platform),
// Pemantauan (sumber data yang benar-benar dipantau — topik, platform,
// berita, deteksi buzzer, analisis video), Sistem (output & konfigurasi
// aplikasi). Urutan grup mengikuti alur kerja: lihat ringkasan -> pantau
// sumber -> ambil laporan/atur aplikasi.
const sections = [
  {
    key: "summaryGroup",
    items: [
      { key: "overview", href: "/overview", icon: Home },
    ],
  },
  {
    key: "monitoringGroup",
    items: [
      { key: "topics", href: "/topics", icon: Tags },
      { key: "viral",  href: "/viral",  icon: Flame },
      {
        key: "platformGroup",
        icon: Share2,
        children: [
          { key: "engagement",  href: "/engagement",  icon: BarChart3   },
          { key: "youtube",     href: "/youtube",     icon: FaYoutube   },
          { key: "instagram",   href: "/instagram",   icon: FaInstagram },
          { key: "facebook",    href: "/facebook",     icon: FaFacebook  },
          { key: "threads",     href: "/threads",      icon: FaThreads   },
          { key: "tiktok",      href: "/tiktok",       icon: FaTiktok    },
          { key: "twitter",     href: "/twitter",      icon: FaXTwitter  },
          { key: "comparePlatforms", href: "/compare/social", icon: GitCompareArrows },
        ],
      },
      { key: "news", href: "/news", icon: Newspaper },
      {
        key: "buzzerDetectorGroup",
        icon: Radar,
        children: [
          { key: "sna", href: "/buzzer-detector/sna", icon: Network },
        ],
      },
      {
        key: "videoAnalysisGroup",
        icon: Video,
        children: [
          { key: "videoTracking", href: "/video-analysis/tracking",      icon: Locate },
          { key: "liveStreamer",  href: "/video-analysis/live-streamer", icon: Radio  },
        ],
      },
    ],
  },
  {
    key: "systemGroup",
    items: [
      { key: "reports",  href: "/reports",  icon: FileText },
      { key: "settings", href: "/settings", icon: Settings },
    ],
  },
] as const;

type MenuItem = (typeof sections)[number]["items"][number];

function isGroupMenu(menu: MenuItem): menu is Extract<MenuItem, { children: readonly unknown[] }> {
  return "children" in menu;
}

interface Props {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
}

export default function AppSidebar({ open = false, onClose, collapsed = false }: Props) {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [manuallyOpenGroups, setManuallyOpenGroups] = useState<Record<string, boolean>>({});

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
        className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col bg-slate-900 transition-all duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-20" : "lg:w-60"}`}
      >
        {/* Brand */}
        <div className={`flex h-16 items-center gap-3 border-b border-slate-800 px-5 ${collapsed ? "lg:justify-center lg:px-0" : "justify-between"}`}>
          <div className="flex items-center gap-3">
            <div className={collapsed ? "lg:hidden" : ""}>
              <p className="text-white font-bold text-lg leading-none tracking-tight whitespace-nowrap">MediaWatch</p>
              <p className="text-slate-500 text-[10px] mt-1 whitespace-nowrap">{t.sidebar.brandTagline}</p>
            </div>
            <p className={`hidden text-white font-bold text-sm leading-none ${collapsed ? "lg:block" : ""}`}>MW</p>
          </div>

          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden ${collapsed ? "lg:hidden" : ""}`}
            aria-label={t.header.closeMenu}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="scrollbar-thin flex-1 overflow-y-auto p-3">
          {sections.map((section, sectionIdx) => (
          <div key={section.key} className={sectionIdx > 0 ? "mt-5" : ""}>
          <p className={`text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 ${sectionIdx === 0 ? "mt-2" : ""} ${collapsed ? "lg:hidden" : ""}`}>
            {t.sidebar[section.key]}
          </p>
          <div className="space-y-1">
          {section.items.map((menu) => {
            const name = t.sidebar[menu.key];

            if (isGroupMenu(menu)) {
              const GroupIcon = menu.icon;
              const groupActive = menu.children.some(
                (child) => pathname === child.href || pathname.startsWith(`${child.href}/`)
              );
              const isOpen = !collapsed && (manuallyOpenGroups[menu.key] ?? groupActive);

              // Sidebar diciutkan (icon rail) tidak punya ruang buat submenu bertingkat,
              // jadi anak-anaknya ditampilkan rata sebagai item biasa.
              if (collapsed) {
                return menu.children.map((child) => {
                  const ChildIcon = child.icon;
                  const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                  return (
                    <Link
                      key={child.key}
                      href={child.href}
                      onClick={onClose}
                      title={t.sidebar[child.key]}
                      className={`flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                        childActive
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <ChildIcon size={18} className="shrink-0" />
                    </Link>
                  );
                });
              }

              return (
                <div key={menu.key}>
                  <button
                    type="button"
                    onClick={() => setManuallyOpenGroups((prev) => ({ ...prev, [menu.key]: !isOpen }))}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                      groupActive ? "text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <GroupIcon size={18} className="shrink-0" />
                    <span className="flex-1 text-left">{name}</span>
                    <ChevronDown size={15} className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-slate-800 pl-3">
                      {menu.children.map((child) => {
                        const ChildIcon = child.icon;
                        const childActive = pathname === child.href || pathname.startsWith(`${child.href}/`);
                        return (
                          <Link
                            key={child.key}
                            href={child.href}
                            onClick={onClose}
                            className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all ${
                              childActive
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                                : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            }`}
                          >
                            <ChildIcon size={16} className="shrink-0" />
                            <span>{t.sidebar[child.key]}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            const Icon = menu.icon;
            const active = pathname === menu.href || pathname.startsWith(`${menu.href}/`);

            return (
              <Link
                key={menu.key}
                href={menu.href}
                onClick={onClose}
                title={collapsed ? name : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${collapsed ? "lg:justify-center" : ""} ${
                  active
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span className={collapsed ? "lg:hidden" : ""}>{name}</span>
              </Link>
            );
          })}
          </div>
          </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
