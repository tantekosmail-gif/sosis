"use client";

import { ExternalLink } from "lucide-react";

import type { ViralComment } from "@/features/viral/types/viral.types";

const SENTIMENT_STYLE: Record<string, { pill: string; dot: string }> = {
  positif: { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  negatif: { pill: "bg-red-50 text-red-700 border-red-200",             dot: "bg-red-500" },
  netral:  { pill: "bg-amber-50 text-amber-700 border-amber-200",       dot: "bg-amber-400" },
};

export default function ViralCommentsList({ data }: { data: ViralComment[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-400">
        Tidak ada komentar
      </div>
    );
  }

  return (
    <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {data.map((comment) => {
        const sentiment = comment.sentiment?.toLowerCase() ?? "netral";
        const sentimentCfg = SENTIMENT_STYLE[sentiment] ?? SENTIMENT_STYLE.netral;

        return (
          <li key={comment.id} className="px-5 py-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-700">{comment.author}</span>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${sentimentCfg.pill}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${sentimentCfg.dot}`} />
                {comment.sentiment}
              </span>
            </div>

            <p className="mt-1.5 text-sm leading-snug text-slate-600">{comment.content}</p>

            <a
              href={comment.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              Lihat video
              <ExternalLink size={10} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
