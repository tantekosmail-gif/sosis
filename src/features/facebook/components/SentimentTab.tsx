"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, RefreshCw, Search } from "lucide-react";

import FacebookProfileCard from "@/components/facebook/FacebookProfileCard";
import FacebookPostGrid from "@/components/facebook/FacebookPostGrid";
import FacebookCommentsList from "@/components/facebook/FacebookCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import FacebookSummaryWidget from "@/components/facebook/FacebookSummaryWidget";
import FacebookDiscoverPanel from "@/components/facebook/FacebookDiscoverPanel";
import { useFacebookPosts } from "../hooks/useFacebookPosts";
import { useFacebookSummary } from "../hooks/useFacebookSummary";

const MAX_POSTS_OPTIONS = [5, 10];

export default function FacebookSentimentTab() {
  const [usernameInput, setUsernameInput] = useState("");

  const {
    data,
    loading,
    error,
    maxPosts,
    setMaxPosts,
    search,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  } = useFacebookPosts();

  const { data: summary } = useFacebookSummary();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    search(usernameInput);
  }

  function handleSelectAccount(username: string) {
    setUsernameInput(username);
    search(username);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-slate-900">Analisis Sentimen</h2>
        <p className="mt-1 text-sm text-slate-400">
          Analisis sentimen komentar dari postingan sebuah page/profile Facebook
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {summary && <FacebookSummaryWidget data={summary} onSelectAccount={handleSelectAccount} />}
        <FacebookDiscoverPanel onSelectAccount={handleSelectAccount} />
      </div>

      {/* Search bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Username / Page ID Facebook
            </label>
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="mis. jokowi"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>
          </form>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Jumlah Post
            </label>
            <select
              value={maxPosts}
              onChange={(e) => setMaxPosts(Number(e.target.value))}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            >
              {MAX_POSTS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} post</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !usernameInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Search size={15} />
            Analisis
          </button>

          {data && (
            <button
              onClick={() => search(data.username, true)}
              disabled={loading}
              title="Ambil ulang data terbaru dari Facebook"
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-blue-600" />
          <p className="font-semibold text-slate-700">Mengambil & menganalisis data Facebook...</p>
          <p className="mt-1 text-xs text-slate-400">Proses scraping bisa butuh beberapa detik</p>
        </div>
      )}

      {!loading && !error && !data && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
          Masukkan username/page Facebook untuk melihat analisis sentimennya
        </div>
      )}

      {!loading && !error && data && (
        <>
          {(data.scrape?.errors?.length ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Gagal mengambil data terbaru dari Facebook</p>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-amber-700">
                  {data.scrape?.errors?.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-amber-700">
                  Data di bawah ini (jika ada) berasal dari hasil scraping sebelumnya, bukan data terbaru.
                </p>
              </div>
            </div>
          )}

          <FacebookProfileCard pageInfo={data.page_info} stats={data.stats} sentiment={data.sentiment} />

          <FacebookPostGrid
            data={data.items}
            selectedPostId={selectedPostId}
            onSelectPost={(item) => setSelectedPostId(item.post_id)}
          />

          <CommentsModal
            open={!!selectedPost}
            onClose={() => setSelectedPostId(null)}
            url={selectedPost?.url}
            caption={selectedPost?.caption}
          >
            {selectedPost && <FacebookCommentsList data={selectedPost.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
