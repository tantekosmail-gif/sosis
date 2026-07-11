"use client";

import Link from "next/link";
import { AlertTriangle, Loader2 } from "lucide-react";
import { FaFacebook, FaInstagram, FaTiktok, FaXTwitter } from "react-icons/fa6";

import { useNeedsAttention, type AttentionAccount } from "../hooks/useNeedsAttention";

const PLATFORM_META: Record<AttentionAccount["platform"], { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string; href: string }> = {
  instagram: { label: "Instagram", icon: FaInstagram, color: "text-pink-500", href: "/instagram" },
  facebook: { label: "Facebook", icon: FaFacebook, color: "text-blue-600", href: "/facebook" },
  twitter: { label: "Twitter/X", icon: FaXTwitter, color: "text-sky-500", href: "/twitter" },
  tiktok: { label: "TikTok", icon: FaTiktok, color: "text-slate-900 dark:text-white", href: "/tiktok" },
};

export default function NeedsAttentionSection() {
  const { accounts, loading } = useNeedsAttention();

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (accounts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-red-200 dark:border-red-900/60 bg-white dark:bg-slate-900 shadow-sm p-5">
      <div className="mb-1 flex items-center gap-2">
        <AlertTriangle size={16} className="text-red-600" />
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Butuh Perhatian</h2>
      </div>
      <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
        Akun dengan porsi sentimen negatif tertinggi, digabung dari semua platform yang dipantau.
      </p>

      <div className="space-y-2">
        {accounts.slice(0, 8).map((account) => {
          const meta = PLATFORM_META[account.platform];
          const Icon = meta.icon;
          return (
            <Link
              key={`${account.platform}-${account.username}`}
              href={meta.href}
              className="flex items-center justify-between rounded-xl border border-slate-100 dark:border-slate-800 px-3.5 py-2.5 transition hover:border-red-200 dark:hover:border-red-900"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Icon size={14} className={meta.color} />
                @{account.username}
              </span>
              <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                {(account.negatifRatio * 100).toFixed(0)}% negatif · {account.negatifCount}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
