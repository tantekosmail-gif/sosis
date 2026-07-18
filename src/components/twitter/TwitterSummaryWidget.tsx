"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, MessageSquare, PieChart, Users } from "lucide-react";

import type { TwitterAnalysisSummary } from "@/features/twitter/types/summary.types";
import MiniSentimentBar from "@/components/common/MiniSentimentBar";

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

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default function TwitterSummaryWidget({
  data,
  onSelectAccount,
}: {
  data: TwitterAnalysisSummary;
  onSelectAccount?: (username: string) => void;
}) {
  const { overall, per_account } = data;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-800">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-950/40">
          <BarChart3 size={17} className="text-sky-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900 dark:text-slate-100">Ringkasan Analisis Twitter/X</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">Overview seluruh akun yang pernah dianalisis</p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Users} label="Total Post" value={overall.total_posts.toLocaleString("id-ID")} />
          <StatCard icon={MessageSquare} label="Total Balasan" value={overall.total_comments.toLocaleString("id-ID")} />
          <StatCard icon={PieChart} label="Dianalisis" value={overall.total_analyzed.toLocaleString("id-ID")} />
          <StatCard icon={BarChart3} label="Akun Dipantau" value={String(per_account.length)} />
        </div>

        {overall.total_analyzed > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Sentimen Keseluruhan</span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">{overall.total_analyzed} balasan dianalisis</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              {(["positif", "netral", "negatif"] as const).map((key) => (
                <div key={key} className={SENTIMENT_COLOR[key].bar} style={{ width: `${overall.sentiment[key].percentage}%` }} />
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["positif", "netral", "negatif"] as const).map((key) => (
                <span
                  key={key}
                  className={`inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2.5 py-1 text-[11px] font-semibold ${SENTIMENT_COLOR[key].bg} ${SENTIMENT_COLOR[key].text}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${SENTIMENT_COLOR[key].bar}`} />
                  {SENTIMENT_LABEL[key]} {overall.sentiment[key].percentage.toFixed(1)}% ({overall.sentiment[key].count})
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">Per Akun</p>
          {per_account.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500">Belum ada akun yang dianalisis</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-slate-950 dark:text-slate-500">
                  <tr>
                    <th className="px-4 py-2 text-left">Akun</th>
                    <th className="px-4 py-2 text-right">Post</th>
                    <th className="px-4 py-2 text-right">Balasan</th>
                    <th className="px-4 py-2 text-left">Sentimen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {per_account.map((account) => (
                    <tr
                      key={account.username}
                      onClick={() => onSelectAccount?.(account.username)}
                      className={onSelectAccount ? "cursor-pointer hover:bg-sky-50/60" : ""}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-300">@{account.username}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500 dark:text-slate-400">{account.post_count}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500 dark:text-slate-400">{account.comment_count}</td>
                      <td className="px-4 py-2.5">
                        <MiniSentimentBar {...account.sentiment} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
