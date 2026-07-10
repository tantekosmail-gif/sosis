"use client";

import { useState } from "react";
import { Camera, Info, LayoutGrid, Play } from "lucide-react";

import type { ViralVideoItem } from "@/features/youtube/types/viral.types";

const RAIL_SIZE = 4;

export default function VisualsPreviewWidget({ items }: { items: ViralVideoItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const active = items[activeIndex] ?? items[0];
  const rail = items.slice(0, RAIL_SIZE);
  const placeholderCount = Math.max(0, RAIL_SIZE - rail.length);
  const hasMore = items.length > RAIL_SIZE;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Video Viral</h2>
        <Info size={16} className="text-slate-400 dark:text-slate-500" />
      </div>

      <div className="flex gap-3 p-4">
        <a
          href={active.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block aspect-video w-full flex-1 overflow-hidden rounded-xl bg-slate-900"
        >
          {active.thumbnail_url && (
            <img
              src={active.thumbnail_url}
              alt=""
              className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

          <span className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur-sm">
            <Play size={15} className="ml-0.5 fill-white text-white" />
          </span>

          {active.duration && (
            <span className="absolute right-3 top-3 rounded-md bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {active.duration}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="truncate text-[11px] font-medium uppercase tracking-wide text-white/70">
              {active.channel}
            </p>
            <p className="mt-1 line-clamp-2 text-lg font-bold leading-snug text-white sm:text-xl">
              {active.title}
            </p>
          </div>
        </a>

        <div className="flex w-16 shrink-0 flex-col gap-2 sm:w-20">
          {rail.map((item, i) => (
            <button
              key={item.video_id}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-square overflow-hidden rounded-lg bg-slate-100 transition dark:bg-slate-800 ${
                i === activeIndex ? "ring-2 ring-indigo-500" : "ring-1 ring-slate-200 hover:ring-slate-300"
              }`}
            >
              {item.thumbnail_url ? (
                <img src={item.thumbnail_url} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Camera size={16} className="text-slate-300" />
                </div>
              )}
            </button>
          ))}

          {Array.from({ length: placeholderCount }).map((_, i) => (
            <div
              key={`placeholder-${i}`}
              className="flex aspect-square items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 dark:bg-slate-800"
            >
              <Camera size={16} className="text-slate-300" />
            </div>
          ))}

          {hasMore && (
            <div className="flex aspect-square items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200 dark:bg-slate-950">
              <LayoutGrid size={15} className="text-slate-400 dark:text-slate-500" />
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center border-t border-slate-100 bg-slate-50 py-2 dark:border-slate-800 dark:bg-slate-950">
        <span className="h-1 w-10 rounded-full bg-slate-300" />
      </div>
    </div>
  );
}
