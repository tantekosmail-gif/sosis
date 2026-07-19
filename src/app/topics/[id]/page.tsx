"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowLeft, Eye, Loader2, Tag, ThumbsUp } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getTopicDetail, getShareOfVoice, getTopicTrendGraph } from "@/features/topic/services/topic.service";
import { normalizeTopicDetail, platformMeta, type TopicDetail, type TopicPost } from "@/features/topic/lib/topicDetail";
import { normalizeTopicTrendGraph, type TopicTrendGraph } from "@/features/topic/lib/topicTrendGraph";
import ShareOfVoiceCard, { type ShareOfVoiceItem } from "@/components/topic/ShareOfVoiceCard";
import TopicTrendGraphChart from "@/components/topic/TopicTrendGraphChart";
import Pagination from "@/components/common/Pagination";
import { usePagination } from "@/hooks/usePagination";
import { normalizeShareOfVoice } from "@/lib/shareOfVoice";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import FallbackImage from "@/components/common/FallbackImage";

function groupByPlatform(posts: TopicPost[]): [string, TopicPost[]][] {
  const map = new Map<string, TopicPost[]>();
  for (const post of posts) {
    const list = map.get(post.platform) ?? [];
    list.push(post);
    map.set(post.platform, list);
  }
  return Array.from(map.entries());
}

// Konten "title" dari backend berupa markdown mentah (gambar, heading, link) —
// disederhanakan jadi teks polos supaya enak dibaca dalam kartu.
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}


function PostCard({ post }: { post: TopicPost }) {
  let dateStr = "";
  if (post.published_at) {
    try {
      dateStr = formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: idLocale });
    } catch {}
  }

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
    >
      <FallbackImage
        src={post.thumbnail_url}
        className="aspect-video w-full shrink-0"
        imgClassName="h-full w-full object-cover transition duration-200 group-hover:scale-105"
      />

      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <p className="line-clamp-3 text-sm font-medium leading-snug text-slate-800 dark:text-slate-200 transition-colors group-hover:text-indigo-600">
          {stripMarkdown(post.title)}
        </p>

        <div className="mt-auto space-y-1.5 pt-1">
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 dark:text-slate-500">
            <span className="truncate">{post.author ?? "—"}</span>
            {dateStr && <span className="shrink-0">{dateStr}</span>}
          </div>
          {(!!post.view_count || !!post.likes) && (
            <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
              {!!post.view_count && (
                <span className="flex items-center gap-1">
                  <Eye size={11} /> {post.view_count.toLocaleString("id-ID")}
                </span>
              )}
              {!!post.likes && (
                <span className="flex items-center gap-1">
                  <ThumbsUp size={11} /> {post.likes.toLocaleString("id-ID")}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function PlatformPostsGrid({ posts }: { posts: TopicPost[] }) {
  const { page, totalPages, setPage, paginated } = usePagination(posts, 8);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {paginated.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
}

export default function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const [authChecked, setAuthChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [topic, setTopic] = useState<TopicDetail | null>(null);
  const [shareOfVoice, setShareOfVoice] = useState<ShareOfVoiceItem[]>([]);
  const [trendDays, setTrendDays] = useState(7);
  const [trendGraph, setTrendGraph] = useState<TopicTrendGraph | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    setAuthChecked(true);
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const raw = await getTopicDetail(id, { limit_per_keyword: 100, include_sentiment: true });
        if (!cancelled) setTopic(normalizeTopicDetail(raw));
      } catch (err) {
        console.error("getTopicDetail failed:", err);
        if (!cancelled) setError(t.topics.detail.loadError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authChecked, id, t]);

  // Share of Voice dihitung dari keyword_id tiap keyword dalam topik —
  // dijalankan setelah detail topik siap, gagal diam-diam (tidak menimpa error
  // utama halaman) supaya widget tambahan ini tidak memblokir konten inti.
  useEffect(() => {
    if (!topic || topic.keywordGroups.length === 0) return;
    let cancelled = false;
    const keywordIds = topic.keywordGroups.map((g) => g.keywordId).filter(Boolean);
    const keywordNameById = Object.fromEntries(topic.keywordGroups.map((g) => [g.keywordId, g.keyword]));

    (async () => {
      try {
        const sovRaw = await getShareOfVoice(keywordIds);
        if (!cancelled) setShareOfVoice(normalizeShareOfVoice(sovRaw, keywordNameById));
      } catch (err) {
        console.error("getShareOfVoice failed:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [topic]);

  // Grafik tren dipisah dari effect detail topik supaya ganti rentang hari
  // tidak perlu refetch ulang detail/SOV.
  useEffect(() => {
    if (!authChecked) return;
    let cancelled = false;

    (async () => {
      try {
        const raw = await getTopicTrendGraph(id, trendDays);
        if (!cancelled) setTrendGraph(normalizeTopicTrendGraph(raw));
      } catch (err) {
        console.error("getTopicTrendGraph failed:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authChecked, id, trendDays]);

  if (!authChecked) return null;

  return (
    <DashboardLayout>
      <div>
        <Link
          href="/topics"
          className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft size={12} /> {t.topics.detail.backLink}
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{topic?.name ?? "..."}</h1>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={24} className="animate-spin text-indigo-500" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 dark:bg-red-950/40 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      ) : topic ? (
        <>
          {/* Keywords overview */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t.topics.detail.keywordsTitle}
            </h2>
            <div className="flex flex-wrap gap-2">
              {topic.keywordGroups.map((g) => (
                <span
                  key={g.keywordId}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                >
                  <Tag size={11} />
                  {g.keyword}
                  <span className="opacity-70">· {g.totalPosts}</span>
                </span>
              ))}
            </div>
          </div>

          {trendGraph && <TopicTrendGraphChart data={trendGraph} days={trendDays} onDaysChange={setTrendDays} />}

          {shareOfVoice.length > 1 && <ShareOfVoiceCard items={shareOfVoice} />}

          {/* Results per keyword, separated per platform */}
          {topic.keywordGroups.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm py-14 text-center text-sm text-slate-400 dark:text-slate-500">
              {t.topics.detail.noResults}
            </div>
          ) : (
            topic.keywordGroups.map((g) => (
              <div
                key={g.keywordId}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              >
                <div className="border-b border-slate-100 dark:border-slate-800 px-5 py-4">
                  <h2 className="font-semibold text-slate-900 dark:text-slate-100">
                    {t.topics.detail.resultsTitle} <span className="text-indigo-600">&quot;{g.keyword}&quot;</span>
                  </h2>
                </div>

                {g.posts.length === 0 ? (
                  <div className="py-14 text-center text-sm text-slate-400 dark:text-slate-500">
                    {t.topics.detail.noResults}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {groupByPlatform(g.posts).map(([platform, posts]) => {
                      const meta = platformMeta(platform);
                      const Icon = meta.icon;
                      return (
                        <div key={platform} className="px-5 py-5">
                          <div className="mb-3 flex items-center gap-2">
                            <Icon size={16} className={meta.color} />
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{meta.label}</h3>
                            <span className="text-xs text-slate-400 dark:text-slate-500">({posts.length})</span>
                          </div>
                          <PlatformPostsGrid posts={posts} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </>
      ) : null}
    </DashboardLayout>
  );
}
