"use client";

import { useState } from "react";
import { Loader2, Newspaper, Search } from "lucide-react";

import NewsResultCard from "@/components/news/NewsResultCard";
import { useNewsSearch } from "../hooks/useNewsSearch";

export default function NewsSearchTab() {
  const [query, setQuery] = useState("");
  const { data, loading, error, hasSearched, search } = useNewsSearch();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    search(query);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari berita, mis. jokowi, pemilu, ekonomi..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-medium text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Cari
        </button>
      </form>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
          <p className="font-semibold text-slate-700">Mencari berita...</p>
        </div>
      )}

      {!loading && !error && hasSearched && data && (
        <>
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{data.total}</span> hasil untuk{" "}
            <span className="font-semibold text-slate-700">&ldquo;{data.query}&rdquo;</span>
          </p>

          {data.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
              Tidak ada berita ditemukan untuk pencarian ini
            </div>
          ) : (
            <div className="space-y-4">
              {data.items.map((item) => (
                <NewsResultCard key={item.post_id} item={item} />
              ))}
            </div>
          )}
        </>
      )}

      {!hasSearched && !loading && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-24 text-center">
          <Newspaper className="mb-4 h-10 w-10 text-slate-300" />
          <p className="font-semibold text-slate-700">Mulai cari berita</p>
          <p className="mt-1 text-sm text-slate-400">Masukkan kata kunci di atas untuk memulai pencarian</p>
        </div>
      )}
    </div>
  );
}
