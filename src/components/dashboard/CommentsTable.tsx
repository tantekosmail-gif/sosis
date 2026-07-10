"use client";

import { useState, useMemo } from "react";
import { MessageSquare, Search, ThumbsUp, ChevronLeft, ChevronRight } from "lucide-react";
import { DashboardComment } from "@/types/dashboard.type";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface Props {
  comments: DashboardComment[];
}

type SentimentFilter = "all" | "positive" | "neutral" | "negative";

const SENTIMENT_STYLE: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  positive: { bg: "bg-emerald-50",  text: "text-emerald-700",  dot: "bg-emerald-400",  label: "Positif"  },
  neutral:  { bg: "bg-slate-100",   text: "text-slate-600",    dot: "bg-slate-400",    label: "Netral"   },
  negative: { bg: "bg-red-50",      text: "text-red-700",      dot: "bg-red-400",      label: "Negatif"  },
};

const PAGE_SIZE = 10;

export default function CommentsTable({ comments }: Props) {
  const [filter, setFilter] = useState<SentimentFilter>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const counts = useMemo(() => ({
    all: comments.length,
    positive: comments.filter((c) => c.sentiment === "positive").length,
    neutral:  comments.filter((c) => c.sentiment === "neutral").length,
    negative: comments.filter((c) => c.sentiment === "negative").length,
  }), [comments]);

  const filtered = useMemo(() => {
    let list = filter === "all" ? comments : comments.filter((c) => c.sentiment === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) => c.content.toLowerCase().includes(q) || c.author.toLowerCase().includes(q)
      );
    }
    return list;
  }, [comments, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function changeFilter(f: SentimentFilter) {
    setFilter(f);
    setPage(1);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
            <MessageSquare size={17} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Komentar</h2>
            <p className="text-xs text-slate-400">{comments.length.toLocaleString("id-ID")} komentar terkumpul</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Cari komentar atau penulis..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="h-9 w-full min-w-52 rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-slate-100 px-4 py-2.5 overflow-x-auto">
        {(["all", "positive", "neutral", "negative"] as SentimentFilter[]).map((f) => {
          const s = f === "all" ? null : SENTIMENT_STYLE[f];
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => changeFilter(f)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? f === "all"
                    ? "bg-indigo-600 text-white"
                    : `${s!.bg} ${s!.text} ring-1 ring-inset ring-current/30`
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {s && <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />}
              {f === "all" ? "Semua" : s!.label}
              <span className={`ml-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                {counts[f]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {paginated.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center">
          <MessageSquare size={28} className="mb-3 text-slate-300" />
          <p className="text-sm text-slate-500">Tidak ada komentar ditemukan</p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-100">
          {paginated.map((comment) => {
            const s = SENTIMENT_STYLE[comment.sentiment] ?? SENTIMENT_STYLE.neutral;
            let dateStr = "";
            try {
              if (comment.publishedAt)
                dateStr = format(new Date(comment.publishedAt), "d MMM yyyy", { locale: idLocale });
            } catch {}

            return (
              <li key={comment.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50/60 transition-colors">
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 text-sm font-bold text-white select-none">
                  {comment.author.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{comment.author}</span>
                    {dateStr && <span className="text-xs text-slate-400">{dateStr}</span>}
                    <span className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="mt-1 break-words text-sm leading-relaxed text-slate-600 line-clamp-2">{comment.content}</p>
                  {comment.likes !== undefined && comment.likes > 0 && (
                    <div className="mt-1.5 flex items-center gap-1 text-xs text-slate-400">
                      <ThumbsUp size={11} />
                      {comment.likes.toLocaleString("id-ID")}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3">
          <p className="text-xs text-slate-400">
            {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition disabled:opacity-40"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="px-2 text-xs text-slate-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition disabled:opacity-40"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
