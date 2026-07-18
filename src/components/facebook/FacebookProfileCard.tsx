"use client";

import type { LucideIcon } from "lucide-react";
import { BadgeCheck, Grid3x3, Info, MessageSquare, Percent, PieChart, TrendingUp } from "lucide-react";

import type { FacebookPageInfo, FacebookPostItem, FacebookPostSentimentOverview, FacebookPostsStats } from "@/features/facebook/types/posts.types";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import FallbackImage from "@/components/common/FallbackImage";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { bg: string; text: string; bar: string }> = {
  positif: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700", bar: "bg-emerald-500" },
  netral: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700", bar: "bg-amber-400" },
  negatif: { bg: "bg-red-50 dark:bg-red-950/40", text: "text-red-700", bar: "bg-red-500" },
};

function formatCompact(n?: number) {
  if (n === undefined || n === null) return "-";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function StatCard({ icon: Icon, label, value, tooltip }: { icon: LucideIcon; label: string; value: string; tooltip?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon size={15} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
        {tooltip && (
          <span title={tooltip} className="shrink-0 cursor-help">
            <Info size={12} />
          </span>
        )}
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default function FacebookProfileCard({
  pageInfo,
  stats,
  sentiment,
  items,
}: {
  pageInfo: FacebookPageInfo;
  stats: FacebookPostsStats;
  sentiment: FacebookPostSentimentOverview;
  items: FacebookPostItem[];
}) {
  const hasProfile = Boolean(pageInfo && (pageInfo.username || pageInfo.name));

  const entries = (["positif", "netral", "negatif"] as const).map((key) => ({
    key,
    ...sentiment[key],
  }));

  const engagementRate = (() => {
    if (!pageInfo.followers || items.length === 0) return null;
    const totalEngagement = items.reduce((sum, item) => sum + (item.likes || 0) + (item.comment_count || 0), 0);
    const avgEngagement = totalEngagement / items.length;
    return (avgEngagement / pageInfo.followers) * 100;
  })();

  const lastCollectedAt = items.reduce<string | undefined>((latest, item) => {
    if (!item.collected_at) return latest;
    if (!latest || item.collected_at > latest) return item.collected_at;
    return latest;
  }, undefined);

  return (
    <div className="space-y-4">
      {hasProfile ? (
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 shadow-sm">
          <FallbackImage
            src={pageInfo.profile_pic_url}
            variant="avatar"
            className="h-16 w-16 shrink-0 rounded-full"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{pageInfo.name || pageInfo.username}</p>
              {pageInfo.is_verified && <BadgeCheck size={15} className="shrink-0 text-blue-500" />}
            </div>
            {pageInfo.username && <p className="text-sm text-slate-400 dark:text-slate-500">@{pageInfo.username}</p>}
            {pageInfo.category && <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">{pageInfo.category}</p>}
            {lastCollectedAt && (
              <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                Diperbarui {formatRelativeTime(lastCollectedAt)}
              </p>
            )}
          </div>

          <div className="flex shrink-0 gap-5 text-center">
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{formatCompact(pageInfo.followers)}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Followers</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-5 py-4 text-sm text-slate-400 dark:text-slate-500">
          Profil tidak tersedia dari sumber data
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={Grid3x3} label="Total Post" value={stats.total_posts.toLocaleString("id-ID")} />
        <StatCard icon={MessageSquare} label="Total Komentar" value={stats.total_comments.toLocaleString("id-ID")} />
        <StatCard
          icon={TrendingUp}
          label="Dianalisis"
          value={stats.total_analyzed.toLocaleString("id-ID")}
          tooltip="Jumlah komentar yang sudah diproses oleh mesin analisis sentimen"
        />
        <StatCard
          icon={PieChart}
          label="Coverage"
          value={`${stats.coverage_pct.toFixed(1)}%`}
          tooltip="Persentase komentar yang sudah dianalisis dari total komentar yang terkumpul"
        />
        <StatCard
          icon={Percent}
          label="Engagement Rate"
          value={engagementRate !== null ? `${engagementRate.toFixed(2)}%` : "-"}
          tooltip="Rata-rata (like + komentar) per post dibagi jumlah followers, dari post yang diambil saat ini"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sentimen Komentar</span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">{sentiment.total_analyzed} komentar dianalisis</span>
        </div>

        {sentiment.total_analyzed > 0 ? (
          <>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
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
          <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada komentar yang dianalisis</p>
        )}
      </div>
    </div>
  );
}
