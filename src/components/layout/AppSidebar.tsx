"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ChevronDown, ChevronLeft, ChevronRight, GitCompareArrows, Home, MessageCircle, Newspaper, Settings, Tags, Wrench, X } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { LogoMark } from "@/components/brand/AppLogo";
import { useTranslation } from "@/lib/i18n/LanguageProvider";

const menus = [
  { key: "overview",          href: "/overview",          icon: Home            },
  { key: "engagement",        href: "/engagement",        icon: BarChart3       },
  { key: "topics",            href: "/topics",            icon: Tags            },
  { key: "youtube",           href: "/youtube",           icon: FaYoutube       },
  { key: "instagram",         href: "/instagram",         icon: FaInstagram     },
  { key: "facebook",          href: "/facebook",          icon: FaFacebook      },
  { key: "twitter",           href: "/twitter",           icon: FaXTwitter      },
  { key: "tiktok",            href: "/tiktok",            icon: FaTiktok        },
  { key: "news",              href: "/news",              icon: Newspaper       },
  {
    key: "toolsGroup",
    icon: Wrench,
    children: [
      { key: "comparePlatforms", href: "/compare/social",  icon: GitCompareArrows },
      { key: "aiTopicSearch",    href: "/dashboard/trend",  icon: MessageCircle    },
    ],
  },
  { key: "settings",          href: "/settings",          icon: Settings        },
] as const;

function isGroupMenu(menu: (typeof menus)[number]): menu is Extract<(typeof menus)[number], { children: readonly unknown[] }> {
  return "children" in menu;
}

interface Props {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export default function AppSidebar({ open = false, onClose, collapsed = false, onToggleCollapsed }: Props) {
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
            <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <LogoMark size={15} className="text-white" />
            </div>
            <div className={collapsed ? "lg:hidden" : ""}>
              <p className="text-white font-bold text-sm leading-none whitespace-nowrap">MediaWatch</p>
              <p className="text-slate-500 text-[10px] mt-0.5 whitespace-nowrap">{t.sidebar.brandTagline}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden ${collapsed ? "lg:hidden" : ""}`}
            aria-label="Tutup menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className={`text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-3 mt-2 ${collapsed ? "lg:hidden" : ""}`}>
            {t.sidebar.mainMenu}
          </p>
          {menus.map((menu) => {
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
        </nav>

        {/* Bottom */}
        <div className="border-t border-slate-800 p-3">
          <div className={collapsed ? "lg:hidden" : ""}>
            <div className="rounded-xl bg-gradient-to-r from-indigo-600/20 to-violet-600/20 border border-indigo-500/20 p-3">
              <p className="text-white text-xs font-semibold">Pro Plan</p>
              <p className="text-slate-400 text-[10px] mt-0.5">All platforms active</p>
              <div className="mt-2 h-1 rounded-full bg-slate-700">
                <div className="h-1 w-3/4 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
              </div>
            </div>
          </div>

          <button
            onClick={onToggleCollapsed}
            className="hidden w-full items-center justify-center rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white lg:flex"
            aria-label={collapsed ? "Perbesar menu" : "Perkecil menu"}
            title={collapsed ? "Perbesar menu" : "Perkecil menu"}
          >
            {collapsed ? <ChevronRight size={18} /> : (
              <span className="flex items-center gap-2 text-xs font-medium">
                <ChevronLeft size={18} /> Perkecil menu
              </span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
