"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, RefreshCw, X } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import TrendingAccountCard from "@/components/instagram/TrendingAccountCard";
import TrendingCommentsList from "@/components/instagram/TrendingCommentsList";
import { useInstagramTrending } from "@/features/instagram/hooks/useInstagramTrending";

export default function InstagramTrendingPage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  const {
    data,
    loading,
    error,
    refetch,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  } = useInstagramTrending();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <p className="text-sm text-slate-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Instagram Trending</h1>
            <p className="mt-1 text-sm text-slate-400">
              Akun Instagram dengan skor trending tertinggi, diperbarui otomatis setiap hari
            </p>
          </div>

          <button
            onClick={() => refetch()}
            disabled={loading}
            className="flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-24 shadow-sm">
            <Loader2 className="mb-4 h-10 w-10 animate-spin text-indigo-600" />
            <p className="font-semibold text-slate-700">Memuat akun trending...</p>
          </div>
        )}

        {!loading && !error && data && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-700">{data.total_accounts}</span> akun trending
              </p>
              <p className="text-xs text-slate-400">Diperbarui setiap {data.updated_daily}</p>
            </div>

            {data.accounts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
                Belum ada akun trending ditemukan
              </div>
            ) : (
              <div className="space-y-4">
                {data.accounts.map((account) => (
                  <TrendingAccountCard
                    key={account.username}
                    account={account}
                    selectedPostId={selectedPostId}
                    onSelectPost={(post) => setSelectedPostId(post.post_id)}
                  />
                ))}
              </div>
            )}

            {selectedPost && (
              <div>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-slate-900">Komentar</h2>
                    <a
                      href={selectedPost.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 inline-flex items-center gap-1 truncate text-xs text-indigo-500 hover:text-indigo-700"
                    >
                      <span className="truncate">{selectedPost.caption}</span>
                      <ExternalLink size={10} className="shrink-0" />
                    </a>
                  </div>

                  <button
                    onClick={() => setSelectedPostId(null)}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 transition"
                  >
                    <X size={12} />
                    Tutup
                  </button>
                </div>

                <TrendingCommentsList data={selectedPost.comments} />
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
