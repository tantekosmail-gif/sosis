"use client";

import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Grid3x3, Lock, MessageSquare, PieChart, TrendingUp, UserRound } from "lucide-react";

import type { InstagramPostsStats, InstagramUserInfo, PostSentimentOverview } from "@/features/instagram/types/posts.types";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" },
};

function formatCompact(n?: number) {
  if (n === undefined || n === null) return "-";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function InstagramProfileCard({
  userInfo,
  stats,
  sentiment,
}: {
  userInfo: InstagramUserInfo;
  stats: InstagramPostsStats;
  sentiment: PostSentimentOverview;
}) {
  const hasProfile = Boolean(userInfo && (userInfo.username || userInfo.full_name));

  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    ...sentiment[key],
  }));

  return (
    <div className="space-y-4">
      {hasProfile ? (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-slate-100">
            {userInfo.profile_pic_url ? (
              <img
                src={userInfo.profile_pic_url}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <UserRound size={28} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-semibold text-slate-900">{userInfo.full_name || userInfo.username}</p>
              {userInfo.is_verified && <BadgeCheck size={15} className="shrink-0 text-indigo-500" />}
              {userInfo.is_private && <Lock size={13} className="shrink-0 text-slate-400" />}
            </div>
            {userInfo.username && <p className="text-sm text-slate-400">@{userInfo.username}</p>}
            {userInfo.biography && <p className="mt-1.5 line-clamp-2 break-words text-xs text-slate-500">{userInfo.biography}</p>}
          </div>

          <div className="flex shrink-0 gap-5 text-center">
            <div>
              <p className="text-sm font-bold text-slate-800">{formatCompact(userInfo.followers_count)}</p>
              <p className="text-[11px] text-slate-400">Followers</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{formatCompact(userInfo.following_count)}</p>
              <p className="text-[11px] text-slate-400">Following</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">{formatCompact(userInfo.media_count)}</p>
              <p className="text-[11px] text-slate-400">Postingan</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-slate-400">
          Profil tidak tersedia dari sumber data
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Grid3x3} label="Total Post" value={stats.total_posts.toLocaleString("id-ID")} />
        <StatCard icon={MessageSquare} label="Total Komentar" value={stats.total_comments.toLocaleString("id-ID")} />
        <StatCard icon={TrendingUp} label="Dianalisis" value={stats.total_analyzed.toLocaleString("id-ID")} />
        <StatCard icon={PieChart} label="Coverage" value={`${stats.coverage_pct.toFixed(1)}%`} />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentimen Komentar</span>
          <span className="text-[11px] text-slate-400">{sentiment.total_analyzed} komentar dianalisis</span>
        </div>

        {sentiment.total_analyzed > 0 ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {entries.map((e) => (
                <div key={e.key} className={SENTIMENT_COLOR[e.key].bar} style={{ width: `${e.percentage}%` }} />
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {entries.map((e) => (
                <span
                  key={e.key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[e.key].bg} ${SENTIMENT_COLOR[e.key].text} ${
                    sentiment.dominant === e.key ? "border-current" : "border-transparent"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[e.key].bar}`} />
                  {SENTIMENT_LABEL[e.key]} {e.percentage.toFixed(1)}% ({e.count})
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-xs text-slate-400">Belum ada komentar yang dianalisis</p>
        )}
      </div>
    </div>
  );
}
