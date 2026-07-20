"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ArrowLeft, ChevronDown, Eye, Loader2, Tag, ThumbsUp } from "lucide-react";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { getTopicDetail, getShareOfVoice, getTopicTrendGraph } from "@/features/topic/services/topic.service";
import { normalizeTopicDetail, platformMeta, type TopicDetail, type TopicPost } from "@/features/topic/lib/topicDetail";
import { normalizeTopicTrendGraph, type TopicTrendGraph } from "@/features/topic/lib/topicTrendGraph";
import ShareOfVoiceCard, { type ShareOfVoiceItem } from "@/components/topic/ShareOfVoiceCard";
import TopicTrendGraphChart from "@/components/topic/TopicTrendGraphChart";
import { normalizeShareOfVoice } from "@/lib/shareOfVoice";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import FallbackImage from "@/components/common/FallbackImage";
import { hankenGrotesk, jetBrainsMono } from "@/lib/fonts/dashboardFonts";

const RESULTS_PAGE_SIZE = 8;

type SortKey = "recent" | "views";

const SENTIMENT_LABEL: Record<string, string> = { positif: "Positif", netral: "Netral", negatif: "Negatif" };
const SENTIMENT_STYLE: Record<string, string> = {
  positif: "bg-emerald-500 text-white",
  netral: "bg-amber-400 text-white",
  negatif: "bg-red-500 text-white",
};

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

  const sentimentKey = post.sentiment?.toLowerCase();
  const sentimentStyle = sentimentKey ? SENTIMENT_STYLE[sentimentKey] : undefined;

  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden">
        <FallbackImage
          src={post.thumbnail_url}
          className="h-full w-full"
          imgClassName="h-full w-full object-cover transition duration-200 group-hover:scale-105"
        />
        {sentimentKey && sentimentStyle && (
          <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide shadow ${sentimentStyle}`}>
            {SENTIMENT_LABEL[sentimentKey] ?? post.sentiment}
          </span>
        )}
        {post.duration && (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-1.5 py-0.5 text-[11px] font-semibold text-white">
            {post.duration}
          </span>
        )}
      </div>

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
            <div className={`${jetBrainsMono.className} flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500`}>
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

function PlatformResultsSection({ platform, posts }: { platform: string; posts: TopicPost[] }) {
  const { t } = useTranslation();
  const meta = platformMeta(platform);
  const Icon = meta.icon;
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE);
  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "recent", label: t.topics.detail.sortRecent },
    { key: "views", label: t.topics.detail.sortViews },
  ];

  const sortedPosts = useMemo(() => {
    const items = [...posts];
    if (sortBy === "views") {
      return items.sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0));
    }
    return items; // posts sudah diurutkan terbaru->lama saat normalisasi
  }, [posts, sortBy]);

  const visiblePosts = sortedPosts.slice(0, visibleCount);
  const hasMore = visiblePosts.length < sortedPosts.length;

  return (
    <div className="px-5 py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className={meta.color} />
          <h3 className={`${hankenGrotesk.className} text-sm font-bold text-slate-800 dark:text-slate-200`}>
            {meta.label} {t.topics.detail.platformResultsSuffix}
          </h3>
          <span className="text-xs text-slate-400 dark:text-slate-500">({posts.length})</span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          {t.topics.detail.sortLabel}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="h-7 appearance-none rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-2.5 pr-6 text-xs font-medium text-slate-600 dark:text-slate-300 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visiblePosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + RESULTS_PAGE_SIZE)}
            className="flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900 px-5 py-2.5 text-sm font-semibold text-emerald-600 dark:text-emerald-400 transition hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          >
            {t.topics.detail.loadMoreResultsLabel}
            <ChevronDown size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useTranslation();
  const PERIOD_OPTIONS = [
    { key: 7, label: t.topics.detail.trendGraph.days7 },
    { key: 14, label: t.topics.detail.trendGraph.days14 },
    { key: 30, label: t.topics.detail.trendGraph.days30 },
  ] as const;
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
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/topics"
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ArrowLeft size={12} /> {t.topics.detail.backLink}
          </Link>
          <h1 className={`${hankenGrotesk.className} text-xl font-bold text-slate-900 dark:text-slate-100`}>
            {t.topics.detail.pageTitlePrefix}: {topic?.name ?? "..."}
          </h1>
        </div>

        <div className="inline-flex shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => setTrendDays(opt.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                trendDays === opt.key
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
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
          {/* Keywords Associated */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm p-5">
            <div className="mb-3 flex items-center gap-2">
              <Tag size={15} className="text-indigo-600" />
              <h2 className={`${hankenGrotesk.className} font-bold text-slate-900 dark:text-slate-100`}>
                Keywords Associated
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {topic.keywordGroups.map((g) => (
                <span
                  key={g.keywordId}
                  className="flex items-center gap-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300"
                >
                  {g.keyword}
                  <span className={`${jetBrainsMono.className} flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white`}>
                    {g.totalPosts}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {trendGraph && <TopicTrendGraphChart data={trendGraph} days={trendDays} />}
            </div>
            <div className="lg:col-span-1">
              {shareOfVoice.length > 1 && <ShareOfVoiceCard items={shareOfVoice} />}
            </div>
          </div>

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
                  <h2 className={`${hankenGrotesk.className} font-bold text-slate-900 dark:text-slate-100`}>
                    {t.topics.detail.resultsTitle} <span className="text-indigo-600">&quot;{g.keyword}&quot;</span>
                  </h2>
                </div>

                {g.posts.length === 0 ? (
                  <div className="py-14 text-center text-sm text-slate-400 dark:text-slate-500">
                    {t.topics.detail.noResults}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {groupByPlatform(g.posts).map(([platform, posts]) => (
                      <PlatformResultsSection key={platform} platform={platform} posts={posts} />
                    ))}
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
