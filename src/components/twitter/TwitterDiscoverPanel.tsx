"use client";

import { useState } from "react";
import { CheckCircle2, ExternalLink, Loader2, Radar, XCircle } from "lucide-react";

import { useTwitterDiscover } from "@/features/twitter/hooks/useTwitterDiscover";

function SubmissionBadge({ keyword, submitted }: { keyword: string; submitted: { created: string[]; updated: string[]; rejected: string[] } }) {
  if (submitted.created.includes(keyword)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
        <CheckCircle2 size={12} />
        Topik ditambahkan ke pemantauan
      </span>
    );
  }
  if (submitted.updated.includes(keyword)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold text-sky-700">
        <CheckCircle2 size={12} />
        Topik diperbarui di pemantauan
      </span>
    );
  }
  if (submitted.rejected.includes(keyword)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700">
        <XCircle size={12} />
        Topik ditolak (kuota pemantauan penuh)
      </span>
    );
  }
  return null;
}

export default function TwitterDiscoverPanel({ onSelectAccount }: { onSelectAccount?: (username: string) => void }) {
  const [keywordInput, setKeywordInput] = useState("");
  const { data, loading, error, discover } = useTwitterDiscover();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    discover(keywordInput);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
          <Radar size={17} className="text-violet-600" />
        </div>
        <div>
          <h2 className="font-semibold text-slate-900">Cari Topik & Akun</h2>
          <p className="text-xs text-slate-400">Temukan akun yang membahas sebuah topik &amp; tambahkan ke pemantauan</p>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            placeholder="Keyword atau topik, mis. jokowi"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="h-10 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition"
          />
          <button
            type="submit"
            disabled={loading || !keywordInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Radar size={14} />}
            Cari
          </button>
        </form>

        {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-500">{error}</p>}

        {loading && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 size={24} className="mb-2 animate-spin text-violet-400" />
            <p className="text-sm text-slate-500">Mencari akun & tweet terkait...</p>
          </div>
        )}

        {!loading && data && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{data.posts_found}</span> tweet ·{" "}
                <span className="font-semibold text-slate-700">{data.accounts_found.length}</span> akun ditemukan untuk{" "}
                <span className="font-semibold text-violet-600">&quot;{data.keyword}&quot;</span>
              </p>
              <SubmissionBadge keyword={data.keyword} submitted={data.submitted} />
            </div>

            {data.accounts_found.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Akun Ditemukan</p>
                <div className="flex flex-wrap gap-2">
                  {data.accounts_found.map((account) => (
                    <button
                      key={account.username}
                      type="button"
                      onClick={() => onSelectAccount?.(account.username)}
                      className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      @{account.username}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {data.sample_posts.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">Contoh Tweet</p>
                <ul className="space-y-2">
                  {data.sample_posts.map((post, idx) => (
                    <li key={`${post.identifier_extracted}-${idx}`} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <p className="line-clamp-2 text-xs leading-snug text-slate-600">{post.text}</p>
                      <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                        <span>{post.author} · @{post.identifier_extracted}</span>
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex shrink-0 items-center gap-1 text-violet-500 hover:text-violet-700"
                        >
                          Lihat <ExternalLink size={10} />
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!loading && !error && !data && (
          <p className="py-6 text-center text-sm text-slate-400">
            Masukkan keyword untuk menemukan akun yang membahasnya
          </p>
        )}
      </div>
    </div>
  );
}
