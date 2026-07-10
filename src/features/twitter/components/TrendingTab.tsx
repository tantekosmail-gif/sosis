"use client";

import { Loader2, RefreshCw } from "lucide-react";

import TrendingTopicCard from "@/components/twitter/TrendingTopicCard";
import TwitterCommentsList from "@/components/twitter/TwitterCommentsList";
import CommentsModal from "@/components/common/CommentsModal";
import { useTwitterTrending } from "../hooks/useTwitterTrending";

export default function TwitterTrendingTab() {
  const {
    data,
    loading,
    error,
    refetch,
    selectedPostId,
    setSelectedPostId,
    selectedPost,
  } = useTwitterTrending();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-semibold text-slate-900">Topik Trending</h2>
          <p className="mt-1 text-sm text-slate-400">
            Topik dengan skor trending tertinggi di Twitter/X, diperbarui otomatis setiap hari
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
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-sky-600" />
          <p className="font-semibold text-slate-700">Memuat topik trending...</p>
        </div>
      )}

      {!loading && !error && data && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">{data.total_topics}</span> topik trending
            </p>
            <p className="text-xs text-slate-400">Jadwal: {data.schedule}</p>
          </div>

          {(data.topics ?? []).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-400">
              Belum ada topik trending ditemukan
            </div>
          ) : (
            <div className="space-y-4">
              {(data.topics ?? []).map((topic, idx) => (
                <TrendingTopicCard
                  key={topic.topic}
                  topic={topic}
                  rank={idx + 1}
                  selectedPostId={selectedPostId}
                  onSelectPost={(post) => setSelectedPostId(post.post_id)}
                />
              ))}
            </div>
          )}

          <CommentsModal
            open={!!selectedPost}
            onClose={() => setSelectedPostId(null)}
            title="Balasan"
            url={selectedPost?.url}
            caption={selectedPost?.caption}
          >
            {selectedPost && <TwitterCommentsList data={selectedPost.comments} />}
          </CommentsModal>
        </>
      )}
    </div>
  );
}
