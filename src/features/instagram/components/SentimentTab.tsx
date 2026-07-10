"use client";

import { useState } from "react";
import { AlertTriangle, AtSign, Loader2, RefreshCw, Search } from "lucide-react";

import InstagramProfileCard from "@/components/instagram/InstagramProfileCard";
import InstagramPostGrid from "@/components/instagram/InstagramPostGrid";
import TrendingCommentsList from "@/components/instagram/TrendingCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import InstagramSummaryWidget from "@/components/instagram/InstagramSummaryWidget";
import { useInstagramPosts } from "../hooks/useInstagramPosts";
import { useInstagramSummary } from "../hooks/useInstagramSummary";

const MAX_POSTS_OPTIONS = [10, 20, 50];

export default function InstagramSentimentTab() {
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
  } = useInstagramPosts();

  const { data: summary } = useInstagramSummary();

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
        <h2 className="font-semibold text-slate-900 dark:text-slate-100">Analisis Sentimen</h2>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Analisis sentimen komentar dari postingan sebuah akun Instagram
        </p>
      </div>

      {summary && <InstagramSummaryWidget data={summary} onSelectAccount={handleSelectAccount} />}

      {/* Search bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <form onSubmit={handleSearch} className="flex-1">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Username Instagram
            </label>
            <div className="relative">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="mis. jokowi"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
            </div>
          </form>

          <div className="shrink-0">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Jumlah Post
            </label>
            <select
              value={maxPosts}
              onChange={(e) => setMaxPosts(Number(e.target.value))}
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:focus:bg-slate-900"
            >
              {MAX_POSTS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt} post</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !usernameInput.trim()}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition"
          >
            <Search size={15} />
            Analisis
          </button>

          {data && (
            <button
              onClick={() => search(data.username, true)}
              disabled={loading}
              title="Ambil ulang data terbaru dari Instagram"
              className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Mengambil & menganalisis data Instagram...</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Proses scraping bisa butuh beberapa detik</p>
        </div>
      )}

      {!loading && !error && !data && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
          Masukkan username Instagram untuk melihat analisis sentimennya
        </div>
      )}

      {!loading && !error && data && (
        <>
          {(data.scrape?.errors?.length ?? 0) > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 dark:bg-amber-950/40">
              <AlertTriangle size={18} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold">Gagal mengambil data terbaru dari Instagram</p>
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

          <InstagramProfileCard userInfo={data.user_info} stats={data.stats} sentiment={data.sentiment} />

          <InstagramPostGrid
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
            {selectedPost && <TrendingCommentsList data={selectedPost.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
