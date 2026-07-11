"use client";

import { Hash } from "lucide-react";

import type { TwitterPostItem } from "@/features/twitter/types/posts.types";

const HASHTAG_REGEX = /#([\p{L}0-9_]+)/gu;
const MAX_HASHTAGS = 12;

function extractTopHashtags(items: TwitterPostItem[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    if (!item.caption) continue;
    const seenInPost = new Set<string>();
    for (const match of item.caption.matchAll(HASHTAG_REGEX)) {
      const tag = match[1].toLowerCase();
      if (seenInPost.has(tag)) continue;
      seenInPost.add(tag);
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, MAX_HASHTAGS);
}

export default function TopHashtags({ items }: { items: TwitterPostItem[] }) {
  const hashtags = extractTopHashtags(items);
  if (hashtags.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 shadow-sm">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        Hashtag Terpopuler
      </p>
      <div className="flex flex-wrap gap-2">
        {hashtags.map((h) => (
          <span
            key={h.tag}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 text-xs font-medium text-sky-700 dark:text-sky-300"
          >
            <Hash size={11} />
            {h.tag}
            <span className="text-sky-400 dark:text-sky-500">{h.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
