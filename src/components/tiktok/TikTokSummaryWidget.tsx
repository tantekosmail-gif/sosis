"use client";

import type { LucideIcon } from "lucide-react";
import { Download, Eye, MessageSquare, Music2, PieChart, Users } from "lucide-react";

import type { TikTokAccountSummary, TikTokAnalysisSummary } from "@/features/tiktok/types/summary.types";
import Pagination from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";

const SENTIMENT_LABEL: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

const SENTIMENT_COLOR: Record<string, { text: string; bar: string }> = {
  positif: { text: "text-emerald-600 dark:text-emerald-400", bar: "bg-emerald-500" },
  netral: { text: "text-slate-500 dark:text-slate-400", bar: "bg-slate-400" },
  negatif: { text: "text-red-600 dark:text-red-400", bar: "bg-red-500" },
};

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white dark:bg-slate-900 shadow-sm">
        <Icon size={16} className="text-rose-600" />
      </div>
      <p className="mt-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</p>
      <p className="mt-0.5 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function AccountAvatar({ username }: { username: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-950/50 text-sm font-bold text-rose-700 dark:text-rose-300">
      {username.charAt(0).toUpperCase()}
    </span>
  );
}

function AccountSentimentBar({ sentiment }: { sentiment: TikTokAccountSummary["sentiment"] }) {
  const total = sentiment.positif + sentiment.netral + sentiment.negatif;
  if (total === 0) return <span className="text-xs text-slate-400 dark:text-slate-500">Belum ada data</span>;
  const pct = (n: number) => Math.round((n / total) * 100);

  return (
    <div className="w-full max-w-[180px]">
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className={SENTIMENT_COLOR.positif.bar} style={{ width: `${pct(sentiment.positif)}%` }} />
        <div className={SENTIMENT_COLOR.netral.bar} style={{ width: `${pct(sentiment.netral)}%` }} />
        <div className={SENTIMENT_COLOR.negatif.bar} style={{ width: `${pct(sentiment.negatif)}%` }} />
      </div>
      <div className="mt-1 flex items-center justify-between text-[11px] font-semibold">
        <span className={SENTIMENT_COLOR.positif.text}>{pct(sentiment.positif)}% Positif</span>
        <span className={SENTIMENT_COLOR.negatif.text}>{pct(sentiment.negatif)}% Negatif</span>
      </div>
    </div>
  );
}

function downloadAccountsCsv(rows: TikTokAccountSummary[]) {
  const header = ["Username", "Video", "Komentar", "Positif (%)", "Netral (%)", "Negatif (%)"];
  const lines = rows.map((r) => {
    const total = r.sentiment.positif + r.sentiment.netral + r.sentiment.negatif;
    const pct = (n: number) => (total > 0 ? Math.round((n / total) * 1000) / 10 : 0);
    return [r.username, r.post_count, r.comment_count, pct(r.sentiment.positif), pct(r.sentiment.netral), pct(r.sentiment.negatif)].join(",");
  });
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "analisis-tiktok-per-akun.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function TikTokSummaryWidget({
  data,
  onSelectAccount,
}: {
  data: TikTokAnalysisSummary;
  onSelectAccount?: (username: string) => void;
}) {
  const { overall, per_account } = data;
  const analyzedPct = overall.total_comments > 0 ? (overall.total_analyzed / overall.total_comments) * 100 : 0;
  const { page, totalPages, setPage, paginated } = usePagination(per_account, 5);
  const rangeStart = per_account.length === 0 ? 0 : (page - 1) * 5 + 1;
  const rangeEnd = Math.min(page * 5, per_account.length);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Music2} label="Total Video" value={overall.total_posts.toLocaleString("id-ID")} />
        <StatCard icon={MessageSquare} label="Total Komentar" value={overall.total_comments.toLocaleString("id-ID")} />
        <StatCard icon={PieChart} label="Dianalisis" value={`${analyzedPct.toFixed(1)}%`} />
        <StatCard icon={Users} label="Akun Dipantau" value={String(per_account.length)} />
      </div>

      {overall.total_analyzed > 0 && (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">Sentimen Keseluruhan</h3>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">Agregat sentimen dari seluruh komentar yang dianalisis.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
              {(["positif", "netral", "negatif"] as const).map((key) => (
                <span key={key} className={`flex items-center gap-1.5 ${SENTIMENT_COLOR[key].text}`}>
                  <span className={`h-2 w-2 rounded-full ${SENTIMENT_COLOR[key].bar}`} />
                  {SENTIMENT_LABEL[key]} ({overall.sentiment[key].percentage.toFixed(0)}%)
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            {(["positif", "netral", "negatif"] as const).map((key) => (
              <div key={key} className={SENTIMENT_COLOR[key].bar} style={{ width: `${overall.sentiment[key].percentage}%` }} />
            ))}
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Analisis Per Akun</h3>
          {per_account.length > 0 && (
            <button
              type="button"
              onClick={() => downloadAccountsCsv(per_account)}
              className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              <Download size={13} />
              Download CSV
            </button>
          )}
        </div>

        {per_account.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-slate-400 dark:text-slate-500">Belum ada akun yang dianalisis</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-950 text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left">Profil Akun</th>
                    <th className="px-4 py-3 text-right">Video</th>
                    <th className="px-4 py-3 text-right">Komentar</th>
                    <th className="px-4 py-3 text-left">Distribusi Sentimen</th>
                    <th className="px-6 py-3 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {paginated.map((account) => (
                    <tr key={account.username} className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <AccountAvatar username={account.username} />
                          <span className="font-medium text-slate-700 dark:text-slate-300">@{account.username}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{account.post_count}</td>
                      <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-400">{account.comment_count.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3">
                        <AccountSentimentBar sentiment={account.sentiment} />
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectAccount?.(account.username)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
                        >
                          <Eye size={13} />
                          Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800 px-6 py-3">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Menampilkan {rangeStart}-{rangeEnd} dari {per_account.length} akun
              </p>
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
