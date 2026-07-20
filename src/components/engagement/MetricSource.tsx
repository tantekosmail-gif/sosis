"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { ExternalLink, Eye, Loader2, MessageCircle, Tags, ThumbsUp } from "lucide-react";
import type { IconType } from "react-icons";
import { FaFacebook, FaInstagram, FaNewspaper, FaTiktok, FaXTwitter, FaYoutube } from "react-icons/fa6";

import type { EngagementBreakdown, EngagementPlatform } from "@/features/engagement/types/engagement.types";
import { BREAKDOWN_COLOR, BREAKDOWN_KEYS, BREAKDOWN_LABEL, PLATFORM_LABEL, type BreakdownKey } from "@/features/engagement/lib/colors";
import { formatCompact } from "@/features/engagement/lib/format";
import { getTopicDetail, listSavedTopics } from "@/features/topic/services/topic.service";
import { normalizeTopicDetail } from "@/features/topic/lib/topicDetail";
import {
  getKeywordMetricDetail,
  type MetricDetailAccountItem,
  type MetricDetailCommentItem,
  type MetricDetailMetric,
  type MetricDetailPostItem,
} from "@/features/engagement/services/metricDetail.service";
import { decodeHtmlEntities } from "@/lib/decodeHtmlEntities";
import { useLoadMore } from "@/hooks/useLoadMore";
import LoadMoreButton from "@/components/common/LoadMoreButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type MetricKey =
  | "engagement"
  | "mentions"
  | "reach"
  | "exposure"
  | "sentiment"
  | "mentionGrowth"
  | "breakdown"
  | "trend";

export interface MetricSourceRequest {
  metric: MetricKey;
  /** Kosong = berlaku untuk semua platform (info level chart/section). */
  platform?: EngagementPlatform;
  /** Nilai yang sedang ditampilkan di UI, sudah terformat. */
  value?: string;
  /** Rincian penyusun (untuk metrik engagement/breakdown) — ditampilkan agar
   *  operator bisa memverifikasi totalnya menjumlah dari komponen-komponennya. */
  breakdown?: EngagementBreakdown;
  /** Nilai total mentah dari API — dibandingkan dengan jumlah rincian; kalau
   *  beda, dialog menampilkan peringatan alih-alih menyembunyikannya. */
  rawTotal?: number;
  /** Diisi saat user klik salah satu segmen warna di grafik komposisi — daftar
   *  konten diurutkan berdasarkan komponen ini (bukan tanggal terbaru). */
  sortBy?: BreakdownKey;
  sortByLabel?: string;
  /** Diisi saat user klik satu titik di grafik tren — override rentang tanggal
   *  jadi hari itu saja (bukan seluruh periode dashboard). */
  dateFrom?: string;
  dateTo?: string;
  dateLabel?: string;
}

const METRIC_EXPLANATION: Record<MetricKey, { label: string; desc: string; note?: string }> = {
  engagement: {
    label: "Total Engagement",
    desc: "Total interaksi publik — like, komentar, share, save, balasan, dan klik — pada seluruh konten yang memuat topik atau keyword yang dipantau dalam periode terpilih.",
  },
  mentions: {
    label: "Mentions",
    desc: "Jumlah konten (post, video, atau berita) yang menyebut topik atau keyword yang dipantau dalam periode terpilih. Setiap konten pada daftar di bawah dihitung sebagai satu mention.",
  },
  reach: {
    label: "Reach",
    desc: "Perkiraan jumlah akun unik yang terjangkau oleh konten-konten terpantau, dihitung dari besaran audiens akun yang mempublikasikannya.",
  },
  exposure: {
    label: "Exposure",
    desc: "Perkiraan total tayangan (views) dari seluruh konten terpantau dalam periode terpilih.",
    note: "Facebook & Instagram tidak menyediakan data tayangan, sehingga untuk dua platform itu nilainya ditampilkan sebagai “Tidak tersedia”.",
  },
  sentiment: {
    label: "Skor Sentimen",
    desc: "Kecenderungan sentimen publik dari komentar terhadap konten-konten terpantau — di atas 0 condong positif, di bawah 0 condong negatif.",
  },
  mentionGrowth: {
    label: "Growth Mentions",
    desc: "Perbandingan jumlah konten terpantau pada periode ini terhadap periode sebelumnya dengan durasi yang sama. Tanda “—” berarti data periode pembanding belum cukup.",
  },
  breakdown: {
    label: "Komposisi Engagement",
    desc: "Porsi tiap jenis interaksi (like, komentar, share, save, balasan, klik) terhadap total engagement platform tersebut, dari konten-konten yang sama dengan daftar di bawah.",
  },
  trend: {
    label: "Tren Mention Harian",
    desc: "Jumlah konten terpantau per hari dalam periode terpilih. Konten pada daftar di bawah adalah sumber yang membentuk grafik ini.",
  },
};

const PLATFORM_ICON: Record<string, IconType> = {
  youtube: FaYoutube,
  tiktok: FaTiktok,
  twitter: FaXTwitter,
  facebook: FaFacebook,
  instagram: FaInstagram,
  news: FaNewspaper,
};

const SENTIMENT_BADGE: Record<string, string> = {
  positif: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
  netral: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
  negatif: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300",
};

const SENTIMENT_LABEL_ID: Record<string, string> = {
  positif: "Positif",
  netral: "Netral",
  negatif: "Negatif",
};

interface SourceTopic {
  id: string;
  name: string;
  isActive: boolean;
}

interface ActiveKeyword {
  keywordId: string;
  keyword: string;
  topicId: string;
  topicName: string;
}

type DetailShape =
  | { kind: "posts"; data: MetricDetailPostItem[] }
  | { kind: "accounts"; data: MetricDetailAccountItem[] }
  | { kind: "comments"; data: MetricDetailCommentItem[] };

// Referensi tetap (bukan literal `[]` baru tiap render) supaya useLoadMore
// tidak salah kira daftar berubah dan reset jendela tampilan terus-menerus.
const EMPTY_DETAIL_ITEMS: (MetricDetailPostItem | MetricDetailAccountItem | MetricDetailCommentItem)[] = [];

// Konten "title" post topik bisa berupa markdown mentah (berita) — sederhanakan
// jadi teks polos sebelum ditampilkan.
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDateLabel(date: string) {
  try {
    return new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return date;
  }
}

// Metrik dialog (MetricKey) lebih kaya dari 5 metrik yang didukung endpoint
// drill-down asli — "breakdown" & "trend" dipetakan ke metrik terdekat,
// "mentionGrowth" tidak punya daftar konten (murni angka perbandingan).
function toApiMetric(metric: MetricKey): MetricDetailMetric | null {
  switch (metric) {
    case "mentions":
    case "exposure":
    case "engagement":
    case "reach":
    case "sentiment":
      return metric;
    case "breakdown":
      return "engagement";
    case "trend":
      return "mentions";
    default:
      return null;
  }
}

function shapeKindFor(metric: MetricDetailMetric): DetailShape["kind"] {
  if (metric === "reach") return "accounts";
  if (metric === "sentiment") return "comments";
  return "posts";
}

function mergePostItems(lists: MetricDetailPostItem[][], sortBy?: BreakdownKey): MetricDetailPostItem[] {
  const seen = new Set<string>();
  const merged: MetricDetailPostItem[] = [];
  for (const items of lists) {
    for (const item of items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
  }
  if (sortBy) {
    merged.sort((a, b) => (b.engagement_breakdown?.[sortBy] ?? 0) - (a.engagement_breakdown?.[sortBy] ?? 0));
  } else {
    merged.sort((a, b) => {
      const at = a.published_at ? new Date(a.published_at).getTime() : -Infinity;
      const bt = b.published_at ? new Date(b.published_at).getTime() : -Infinity;
      return bt - at;
    });
  }
  return merged;
}

function mergeAccountItems(lists: MetricDetailAccountItem[][]): MetricDetailAccountItem[] {
  const byKey = new Map<string, MetricDetailAccountItem>();
  for (const items of lists) {
    for (const item of items) {
      const key = `${item.platform}:${item.author}`;
      const existing = byKey.get(key);
      if (existing) existing.post_count += item.post_count;
      else byKey.set(key, { ...item });
    }
  }
  return Array.from(byKey.values()).sort((a, b) => b.post_count - a.post_count);
}

function mergeCommentItems(lists: MetricDetailCommentItem[][]): MetricDetailCommentItem[] {
  const seen = new Set<string>();
  const merged: MetricDetailCommentItem[] = [];
  for (const items of lists) {
    for (const item of items) {
      if (seen.has(item.comment_id)) continue;
      seen.add(item.comment_id);
      merged.push(item);
    }
  }
  merged.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  return merged;
}

interface MetricSourceContextValue {
  show: (request: MetricSourceRequest) => void;
}

const MetricSourceContext = createContext<MetricSourceContextValue | null>(null);

export function useMetricSource(): MetricSourceContextValue {
  const ctx = useContext(MetricSourceContext);
  // Komponen engagement bisa dipakai di luar provider — klik sumber data jadi
  // no-op alih-alih crash.
  return ctx ?? { show: () => {} };
}

export function MetricSourceProvider({
  dateFrom,
  dateTo,
  fetchedAt,
  children,
}: {
  dateFrom: string;
  dateTo: string;
  fetchedAt: Date | null;
  children: ReactNode;
}) {
  const [request, setRequest] = useState<MetricSourceRequest | null>(null);
  const [topics, setTopics] = useState<SourceTopic[]>([]);
  const [activeKeywords, setActiveKeywords] = useState<ActiveKeyword[]>([]);
  const [keywordsLoading, setKeywordsLoading] = useState(false);
  const [keywordsError, setKeywordsError] = useState("");
  const keywordsLoadedRef = useRef(false);

  const [detail, setDetail] = useState<DetailShape | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadKeywords = useCallback(async () => {
    if (keywordsLoadedRef.current) return;
    keywordsLoadedRef.current = true;
    setKeywordsLoading(true);
    setKeywordsError("");
    try {
      // Sengaja TIDAK filter is_active: true -- /metrics/summary & /metrics/trend
      // (angka yang ditampilkan di kartu/grafik) agregat lintas SEMUA topik tanpa
      // peduli status aktif, jadi keyword dari topik yang lagi nonaktif/pause
      // tetap harus ikut diquery di sini, kalau tidak drill-down-nya akan
      // kehilangan sebagian konten padahal angka totalnya sudah termasuk itu.
      const listRaw = await listSavedTopics({ limit: 50 });
      const items: Record<string, unknown>[] = listRaw?.data?.items ?? listRaw?.items ?? [];
      const nextTopics: SourceTopic[] = items
        .map((raw) => ({
          id: String(raw.id ?? raw.topic_id ?? ""),
          name: String(raw.name ?? raw.topic ?? "-"),
          isActive: Boolean(raw.is_active ?? true),
        }))
        .filter((t) => t.id);

      const details = await Promise.allSettled(
        nextTopics.map((t) => getTopicDetail(t.id, { limit_per_keyword: 1, include_sentiment: false }))
      );

      const nextKeywords: ActiveKeyword[] = [];
      const seenKeywordIds = new Set<string>();
      let failedCount = 0;
      details.forEach((res, i) => {
        if (res.status !== "fulfilled") {
          failedCount++;
          return;
        }
        const topic = nextTopics[i];
        const detail = normalizeTopicDetail(res.value);
        detail.keywordGroups.forEach((group) => {
          if (!group.keywordId || seenKeywordIds.has(group.keywordId)) return;
          seenKeywordIds.add(group.keywordId);
          nextKeywords.push({ keywordId: group.keywordId, keyword: group.keyword, topicId: topic.id, topicName: topic.name });
        });
      });

      // Gagal sebagian (bukan seluruhnya) tidak boleh diam-diam -- kalau tidak,
      // daftar sumber yang kurang lengkap terlihat sama persis dengan "memang
      // tidak ada konten", padahal cuma gagal dimuat.
      if (failedCount > 0) {
        setKeywordsError(
          `${failedCount} dari ${nextTopics.length} topik gagal dimuat — daftar sumber di bawah mungkin tidak lengkap.`
        );
      }

      setTopics(nextTopics);
      setActiveKeywords(nextKeywords);
    } catch (err) {
      console.error("loadKeywords failed:", err);
      setKeywordsError("Gagal memuat daftar topik & keyword");
      keywordsLoadedRef.current = false;
    } finally {
      setKeywordsLoading(false);
    }
  }, []);

  const show = useCallback(
    (req: MetricSourceRequest) => {
      setRequest(req);
      loadKeywords();
    },
    [loadKeywords]
  );
  const value = useMemo(() => ({ show }), [show]);

  const explanation = request ? METRIC_EXPLANATION[request.metric] : null;
  const apiMetric = request ? toApiMetric(request.metric) : null;

  // Ambil daftar konten mentah dari endpoint drill-down resmi, per keyword aktif,
  // lalu digabung di frontend -- endpoint-nya scoped ke satu keyword_id, sedangkan
  // dashboard Engagement agregat lintas semua keyword yang dipantau.
  useEffect(() => {
    if (!request || !apiMetric) {
      setDetail(null);
      return;
    }
    if (keywordsLoading) return;
    if (activeKeywords.length === 0) {
      setDetail({ kind: shapeKindFor(apiMetric), data: [] } as DetailShape);
      return;
    }

    let cancelled = false;
    setDetailLoading(true);
    setDetailError("");

    // UTC ("Z"), dikonfirmasi lewat data asli dari /metrics/trend -- field
    // `period`-nya sendiri berformat "...T00:00:00+00:00", jadi backend membucket
    // "hari" pakai kalender UTC, bukan WIB. Dokumen API juga bilang drill-down
    // memakai logika pengelompokan hari PERSIS SAMA dengan /metrics/trend, jadi
    // batas jam satu-hari di sini harus ikut UTC supaya kedua sisi sinkron.
    const effectiveFrom = request.dateFrom ? `${request.dateFrom}T00:00:00Z` : dateFrom;
    const effectiveTo = request.dateTo ? `${request.dateTo}T23:59:59Z` : dateTo;

    (async () => {
      try {
        const results = await Promise.allSettled(
          activeKeywords.map((k) =>
            getKeywordMetricDetail(k.keywordId, {
              metric: apiMetric,
              platform: request.platform,
              sortBy: request.sortBy,
              dateFrom: effectiveFrom,
              dateTo: effectiveTo,
              limit: 50,
            })
          )
        );
        if (cancelled) return;

        const lists = results
          .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof getKeywordMetricDetail>>> => r.status === "fulfilled")
          .map((r) => r.value.items);

        if (apiMetric === "reach") {
          setDetail({ kind: "accounts", data: mergeAccountItems(lists as MetricDetailAccountItem[][]) });
        } else if (apiMetric === "sentiment") {
          setDetail({ kind: "comments", data: mergeCommentItems(lists as MetricDetailCommentItem[][]) });
        } else {
          setDetail({ kind: "posts", data: mergePostItems(lists as MetricDetailPostItem[][], request.sortBy) });
        }
      } catch (err) {
        if (cancelled) return;
        console.error("getKeywordMetricDetail failed:", err);
        setDetailError("Gagal memuat data sumber");
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [request, apiMetric, activeKeywords, keywordsLoading, dateFrom, dateTo]);

  const detailItems = detail?.data ?? EMPTY_DETAIL_ITEMS;
  const { visible: paginated, hasMore, loadMore } = useLoadMore(detailItems, 8);

  return (
    <MetricSourceContext.Provider value={value}>
      {children}

      <Dialog open={!!request} onOpenChange={(open) => !open && setRequest(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {explanation?.label}
              {request?.platform ? ` — ${PLATFORM_LABEL[request.platform]}` : ""}
            </DialogTitle>
          </DialogHeader>

          {explanation && request && (
            <div className="space-y-4">
              {request.value !== undefined && (
                <p className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">{request.value}</p>
              )}

              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{explanation.desc}</p>
              {explanation.note && (
                <p className="text-xs leading-relaxed text-amber-700 dark:text-amber-400">{explanation.note}</p>
              )}
              {request.sortByLabel && (
                <p className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  Diurutkan berdasarkan {request.sortByLabel} terbanyak
                </p>
              )}

              {request.breakdown && (() => {
                const sum = BREAKDOWN_KEYS.reduce((acc, key) => acc + (request.breakdown?.[key] ?? 0), 0);
                const mismatch = request.rawTotal !== undefined && request.rawTotal !== sum;
                return (
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Rincian penyusun
                    </p>
                    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                      {BREAKDOWN_KEYS.map((key) => (
                        <div
                          key={key}
                          className="flex items-center justify-between border-b border-slate-100 px-3.5 py-1.5 text-xs last:border-0 dark:border-slate-800"
                        >
                          <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                            <span className="h-2 w-2 rounded-full" style={{ background: BREAKDOWN_COLOR[key] }} />
                            {BREAKDOWN_LABEL[key]}
                          </span>
                          <span className="font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                            {(request.breakdown?.[key] ?? 0).toLocaleString("id-ID")}
                          </span>
                        </div>
                      ))}
                      <div className="flex items-center justify-between bg-slate-50 px-3.5 py-1.5 text-xs dark:bg-slate-800/60">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Jumlah</span>
                        <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">
                          {sum.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                    {mismatch && (
                      <p className="mt-1.5 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                        Jumlah rincian ({sum.toLocaleString("id-ID")}) berbeda dengan nilai agregat dari sumber data (
                        {request.rawTotal?.toLocaleString("id-ID")}) — sedang tidak sinkron, coba muat ulang data.
                      </p>
                    )}
                  </div>
                );
              })()}

              {keywordsLoading && (
                <div className="flex items-center gap-2 py-4 text-sm text-slate-400 dark:text-slate-500">
                  <Loader2 size={15} className="animate-spin" />
                  Memuat topik & keyword...
                </div>
              )}

              {keywordsError && !keywordsLoading && <p className="text-xs text-red-500">{keywordsError}</p>}

              {!keywordsLoading && topics.some((t) => t.isActive && activeKeywords.some((k) => k.topicId === t.id)) && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    <Tags size={12} />
                    Topik & keyword yang dipantau
                  </p>
                  <div className="space-y-1.5">
                    {topics
                      .filter((t) => t.isActive && activeKeywords.some((k) => k.topicId === t.id))
                      .map((topic) => (
                        <div key={topic.id} className="flex flex-wrap items-center gap-1.5">
                          <Link
                            href={`/topics/${topic.id}`}
                            className="shrink-0 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-950/70"
                          >
                            {topic.name}
                          </Link>
                          {/* Keyword nyata yang dipakai untuk drill-down (dari
                              keyword_details/keyword_id) -- BUKAN topic.keywords
                              dari list endpoint, yang bisa beda/basi dari yang
                              benar-benar diquery. */}
                          {activeKeywords
                            .filter((k) => k.topicId === topic.id)
                            .map((k) => (
                              <span
                                key={k.keywordId}
                                className="rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                              >
                                {k.keyword}
                              </span>
                            ))}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {!keywordsLoading && apiMetric && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {detail?.kind === "accounts"
                      ? "Akun sumber jangkauan"
                      : detail?.kind === "comments"
                        ? "Komentar sumber sentimen"
                        : "Konten sumber"}
                    {request.platform ? ` di ${PLATFORM_LABEL[request.platform]}` : ""}
                    {request.dateLabel ? ` pada ${request.dateLabel}` : " pada periode ini"}
                  </p>
                  <p className="mb-3 text-[11px] leading-relaxed text-amber-700 dark:text-amber-400">
                    Daftar ini cuma mencakup konten dari topik & keyword yang tersimpan dan dipantau -- sebagian
                    konten yang ikut terhitung di angka total di atas bisa jadi tidak tampil di sini kalau belum
                    terhubung ke topik manapun.
                  </p>

                  {detailLoading && (
                    <div className="flex items-center gap-2 py-4 text-sm text-slate-400 dark:text-slate-500">
                      <Loader2 size={15} className="animate-spin" />
                      Memuat data sumber...
                    </div>
                  )}

                  {detailError && !detailLoading && <p className="text-xs text-red-500">{detailError}</p>}

                  {!detailLoading && !detailError && detail && (
                    detail.data.length === 0 ? (
                      <p className="rounded-xl border border-dashed border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-700 dark:text-slate-500">
                        {detail.kind === "accounts"
                          ? "Tidak ada akun"
                          : detail.kind === "comments"
                            ? "Tidak ada komentar"
                            : "Tidak ada konten"}
                        {request.platform ? ` di ${PLATFORM_LABEL[request.platform]}` : ""}{" "}
                        {request.dateLabel ? `pada ${request.dateLabel}.` : "pada periode ini."}
                      </p>
                    ) : (
                      <>
                        <ul className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200 dark:divide-slate-800 dark:border-slate-700">
                          {detail.kind === "posts" &&
                            (paginated as MetricDetailPostItem[]).map((post) => {
                              const Icon = PLATFORM_ICON[post.platform];
                              return (
                                <li key={post.id}>
                                  <a
                                    href={post.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group flex items-start gap-2.5 px-3.5 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                  >
                                    {Icon && <Icon size={13} className="mt-0.5 shrink-0 text-slate-400 dark:text-slate-500" />}
                                    <span className="min-w-0 flex-1">
                                      <span className="flex items-start gap-1">
                                        <span className="line-clamp-2 text-xs font-medium leading-snug text-slate-700 group-hover:text-indigo-600 dark:text-slate-300">
                                          {stripMarkdown(decodeHtmlEntities(post.title))}
                                        </span>
                                        <ExternalLink size={10} className="mt-0.5 shrink-0 text-slate-300 opacity-0 transition group-hover:opacity-100 dark:text-slate-600" />
                                      </span>
                                      <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                                        {post.author && <span className="truncate">{post.author}</span>}
                                        {post.published_at && (
                                          <span>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: idLocale })}</span>
                                        )}
                                        {post.views > 0 && (
                                          <span className="flex items-center gap-0.5">
                                            <Eye size={9} /> {formatCompact(post.views)}
                                          </span>
                                        )}
                                        {request.sortBy ? (
                                          <span className="flex items-center gap-0.5 font-semibold text-indigo-600 dark:text-indigo-400">
                                            {BREAKDOWN_LABEL[request.sortBy]}: {formatCompact(post.engagement_breakdown?.[request.sortBy] ?? 0)}
                                          </span>
                                        ) : (
                                          post.engagement > 0 && (
                                            <span className="flex items-center gap-0.5">
                                              <ThumbsUp size={9} /> {formatCompact(post.engagement)}
                                            </span>
                                          )
                                        )}
                                      </span>
                                    </span>
                                  </a>
                                </li>
                              );
                            })}

                          {detail.kind === "accounts" &&
                            (paginated as MetricDetailAccountItem[]).map((acc) => {
                              const Icon = PLATFORM_ICON[acc.platform];
                              return (
                                <li key={`${acc.platform}:${acc.author}`} className="flex items-center gap-2.5 px-3.5 py-2.5">
                                  {Icon && <Icon size={13} className="shrink-0 text-slate-400 dark:text-slate-500" />}
                                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {acc.author}
                                  </span>
                                  <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                                    {acc.post_count.toLocaleString("id-ID")} post
                                  </span>
                                </li>
                              );
                            })}

                          {detail.kind === "comments" &&
                            (paginated as MetricDetailCommentItem[]).map((c) => (
                              <li key={c.comment_id}>
                                <a
                                  href={c.post_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex flex-col gap-1 px-3.5 py-2.5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
                                >
                                  <span className="flex items-center gap-1.5 text-[10px]">
                                    <span className={`rounded px-1.5 py-px font-semibold ${SENTIMENT_BADGE[c.label] ?? ""}`}>
                                      {SENTIMENT_LABEL_ID[c.label] ?? c.label}
                                    </span>
                                    {c.sentiment_source === "llm_reviewed" && (
                                      <span className="rounded bg-indigo-50 px-1.5 py-px font-medium text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300">
                                        Direview AI
                                      </span>
                                    )}
                                    {c.published_at && (
                                      <span className="ml-auto shrink-0 text-slate-400 dark:text-slate-500">
                                        {formatDistanceToNow(new Date(c.published_at), { addSuffix: true, locale: idLocale })}
                                      </span>
                                    )}
                                  </span>
                                  <span className="flex items-start gap-1">
                                    <MessageCircle size={11} className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />
                                    <span className="line-clamp-2 text-xs leading-snug text-slate-700 dark:text-slate-300">
                                      &ldquo;{decodeHtmlEntities(c.content)}&rdquo;
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-1 pl-4 text-[10px] text-slate-400 dark:text-slate-500">
                                    {c.author && <span className="truncate">{c.author}</span>}
                                    {c.post_title && <span className="truncate italic">· {stripMarkdown(decodeHtmlEntities(c.post_title))}</span>}
                                    <ExternalLink size={9} className="shrink-0 opacity-0 transition group-hover:opacity-100" />
                                  </span>
                                </a>
                              </li>
                            ))}
                        </ul>
                        {hasMore && <LoadMoreButton onClick={loadMore} />}
                      </>
                    )
                  )}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
                <span>
                  {request.dateLabel ?? `Periode: ${formatDateLabel(dateFrom)} – ${formatDateLabel(dateTo)}`}
                </span>
                {fetchedAt && (
                  <span>
                    Diperbarui {fetchedAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MetricSourceContext.Provider>
  );
}
