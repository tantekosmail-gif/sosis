"use client";

import { formatCompactNumber } from "@/lib/utils";

import type { SnapshotTopPost } from "../hooks/usePlatformSnapshot";

export default function TopPostsTable({
  posts,
  metricLabel,
  color,
  emptyLabel,
}: {
  posts: SnapshotTopPost[];
  metricLabel: string;
  color: string;
  emptyLabel: string;
}) {
  if (posts.length === 0) {
    return <p className="text-xs text-slate-400 dark:text-slate-500">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        <span>Post</span>
        <span>{metricLabel}</span>
      </div>

      {posts.map((post, index) => (
        <a
          key={post.item.id}
          href={post.item.url}
          target="_blank"
          rel="noreferrer"
          className="group grid grid-cols-[1.5rem_1fr_auto] items-center gap-3 rounded-lg px-1 py-1 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
        >
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">{index + 1}.</span>

          <span className="min-w-0">
            <span className="block truncate text-xs text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100">
              {post.item.title || post.item.author}
            </span>
            <span className="mt-1 block h-1 rounded-full bg-slate-100 dark:bg-slate-800">
              <span
                className="block h-1 rounded-full"
                style={{ width: `${Math.max(post.share * 100, 4)}%`, backgroundColor: color }}
              />
            </span>
          </span>

          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            {formatCompactNumber(post.value)}
          </span>
        </a>
      ))}
    </div>
  );
}
