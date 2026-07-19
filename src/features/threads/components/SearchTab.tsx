"use client";

import { useMemo, useState } from "react";
import { AtSign, Loader2, Search } from "lucide-react";

import ThreadsPostGrid from "@/components/threads/ThreadsPostGrid";
import ThreadsCommentsList from "@/components/threads/ThreadsCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import Pagination from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { useThreadsSearch } from "../hooks/useThreadsSearch";
import { useRecentThreadsSearches } from "../hooks/useRecentSearches";
import type { ThreadsPost } from "../types/search.types";

const SORT_OPTIONS = [
  { key: "terbaru", label: "Terbaru" },
  { key: "likes", label: "Paling Disukai" },
  { key: "balasan", label: "Paling Banyak Balasan" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

export default function ThreadsSearchTab() {
  const [query, setQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>("terbaru");

  const { data, loading, polling, error, hasSearched, search, refreshPostComments } = useThreadsSearch();
  const { recent, addRecentSearch } = useRecentThreadsSearches();

  const selectedPost = data?.posts.find((p) => p.id === selectedPostId) ?? null;

  const sortedItems = useMemo(() => {
    if (!data) return [];
    const items = [...data.posts];
    if (sortBy === "likes") return items.sort((a, b) => b.likes - a.likes);
    if (sortBy === "balasan") return items.sort((a, b) => b.comment_count - a.comment_count);
    return items.sort((a, b) => (b.published_at || "").localeCompare(a.published_at || ""));
  }, [data, sortBy]);

  const { page, totalPages, setPage, paginated } = usePagination(sortedItems, 8);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await search(query);
    if (result?.query) addRecentSearch(result.query);
  }

  async function handleSelectRecent(term: string) {
    setQuery(term);
    const result = await search(term);
    if (result?.query) addRecentSearch(result.query);
  }

  function handleSelectPost(item: ThreadsPost) {
    setSelectedPostId((prev) => (prev === item.id ? null : item.id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari topik di Threads, mis. jokowi, pemilu, ekonomi..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
          />
        </div>
        <button
          type="submit"
          disabled={loading || polling || !query.trim()}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-medium text-white shadow-lg shadow-purple-500/30 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading || polling ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Cari
        </button>
      </form>

      {recent.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Pencarian Terakhir
          </span>
          {recent.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleSelectRecent(term)}
              className="rounded-lg bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 transition hover:bg-purple-50 hover:text-purple-700 dark:hover:bg-purple-950/40 dark:hover:text-purple-300"
            >
              {term}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600 dark:bg-red-950/40">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm dark:bg-slate-900">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-purple-600" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Mencari post Threads...</p>
        </div>
      )}

      {!loading && polling && (
        <div className="flex items-start gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-5 py-4 text-sm text-purple-800 dark:border-purple-900 dark:bg-purple-950/30 dark:text-purple-300">
          <Loader2 size={18} className="mt-0.5 shrink-0 animate-spin" />
          <div>
            <p className="font-semibold">Mengumpulkan post baru dari Threads...</p>
            <p className="mt-1 text-xs text-purple-700/80 dark:text-purple-400/80">
              Pencarian berjalan di background (kuota API terbatas), hasil akan muncul otomatis di sini begitu selesai.
            </p>
          </div>
        </div>
      )}

      {!loading && !error && hasSearched && data && (
        <>
          {data.posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-500">
              {polling ? "Belum ada post tersimpan, sedang mencari..." : "Tidak ada post Threads ditemukan untuk pencarian ini"}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{data.posts.length}</span> hasil untuk{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">&ldquo;{data.query}&rdquo;</span>
                </p>

                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => setSortBy(opt.key)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                        sortBy === opt.key
                          ? "bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-100"
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <ThreadsPostGrid data={paginated} selectedPostId={selectedPostId} onSelectPost={handleSelectPost} />
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

              <CommentsModal
                open={!!selectedPost}
                onClose={() => setSelectedPostId(null)}
                title="Balasan Threads"
                url={selectedPost?.url}
                caption={selectedPost?.content}
              >
                {selectedPost && (
                  <ThreadsCommentsList
                    data={selectedPost.comments}
                    totalInDb={selectedPost.comment_count}
                    onRefresh={() => refreshPostComments(selectedPost.id)}
                  />
                )}
              </CommentsModal>
            </>
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center dark:border-slate-600 dark:bg-slate-900">
          <AtSign className="mb-4 h-10 w-10 text-slate-300" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Mulai cari post Threads</p>
          <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">Masukkan kata kunci di atas untuk memulai pencarian</p>
        </div>
      )}
    </div>
  );
}
