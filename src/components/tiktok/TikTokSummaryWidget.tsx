"use client";

import type { LucideIcon } from "lucide-react";
import { BarChart3, MessageSquare, Music2, PieChart } from "lucide-react";

import type { TikTokAnalysisSummary } from "@/features/tiktok/types/summary.types";

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

function StatCard({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Icon size={13} />
        <span className="text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-1 text-lg font-bold text-slate-900">{value}</p>
    </div>
  );
}

function MiniSentimentBar({ positif, negatif, netral }: { positif: number; negatif: number; netral: number }) {
  const total = positif + negatif + netral;
  if (total === 0) {
    return <div className="h-1.5 w-full rounded-full bg-slate-100" />;
  }

  return (
    <div className="flex h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
      <div className={SENTIMENT_COLOR.positif.bar} style={{ width: `${(positif / total) * 100}%` }} />
      <div className={SENTIMENT_COLOR.netral.bar} style={{ width: `${(netral / total) * 100}%` }} />
      <div className={SENTIMENT_COLOR.negatif.bar} style={{ width: `${(negatif / total) * 100}%` }} />
    </div>
  );
}

export default function TikTokSummaryWidget({
  data,
  onSelectAccount,
}: {
  data: TikTokAnalysisSummary;
  onSelectAccount?: (username: string) => void;
}) {
  const { overall, per_account } = data;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50">
          <BarChart3 size={17} className="text-rose-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Ringkasan Analisis TikTok</h2>
          <p className="text-xs text-slate-400">Overview seluruh akun yang pernah dianalisis</p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={Music2} label="Total Video" value={overall.total_posts.toLocaleString("id-ID")} />
          <StatCard icon={MessageSquare} label="Total Komentar" value={overall.total_comments.toLocaleString("id-ID")} />
          <StatCard icon={PieChart} label="Dianalisis" value={overall.total_analyzed.toLocaleString("id-ID")} />
          <StatCard icon={BarChart3} label="Akun Dipantau" value={String(per_account.length)} />
        </div>

        {overall.total_analyzed > 0 && (
          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Sentimen Keseluruhan</span>
              <span className="text-[11px] text-slate-400">{overall.total_analyzed} komentar dianalisis</span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Per Akun</p>
          {per_account.length === 0 ? (
            <p className="text-sm text-slate-400">Belum ada akun yang dianalisis</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-2 text-left">Akun</th>
                    <th className="px-4 py-2 text-right">Video</th>
                    <th className="px-4 py-2 text-right">Komentar</th>
                    <th className="px-4 py-2 text-left">Sentimen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {per_account.map((account) => (
                    <tr
                      key={account.username}
                      onClick={() => onSelectAccount?.(account.username)}
                      className={onSelectAccount ? "cursor-pointer hover:bg-rose-50/60" : ""}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-700">@{account.username}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500">{account.post_count}</td>
                      <td className="px-4 py-2.5 text-right text-slate-500">{account.comment_count}</td>
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
