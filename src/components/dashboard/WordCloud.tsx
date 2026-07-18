"use client";

import { useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import { Cloud } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { INFO_HINT, useInfoSource } from "@/components/common/InfoSource";

type WordData = { keyword: string; total: number };

interface Props {
  data: WordData[];
}

export default function WordCloud({ data }: Props) {
  const { t } = useTranslation();
  const { explain } = useInfoSource();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (typeof window === "undefined") return;
      await import("echarts-wordcloud");
      if (mounted) setReady(true);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const option = useMemo(() => ({
    tooltip: { trigger: "item" },
    animationDuration: 800,
    series: [{
      type: "wordCloud",
      shape: "circle",
      left: "center",
      top: "center",
      width: "95%",
      height: "95%",
      keepAspect: true,
      gridSize: 8,
      sizeRange: [16, 64],
      rotationRange: [0, 0],
      drawOutOfBound: false,
      layoutAnimation: true,
      textStyle: {
        fontFamily: "Inter",
        fontWeight: "bold",
        color: () => {
          const colors = ["#6366f1", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#14b8a6"];
          return colors[Math.floor(Math.random() * colors.length)];
        },
      },
      emphasis: {
        focus: "self",
        textStyle: { shadowBlur: 16, shadowColor: "#00000022" },
      },
      data: data.map((item) => ({ name: item.keyword, value: item.total })),
    }],
  }), [data]);

  if (!ready) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
          <Cloud size={28} className="animate-pulse" />
          <span className="text-sm">{t.wordCloud.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() =>
          explain({
            title: t.wordCloud.title,
            meaning: "Kata-kata yang paling sering muncul dalam komentar publik — semakin besar hurufnya, semakin sering kata itu disebut. Berguna untuk menangkap isu yang paling ramai dibicarakan.",
            source: "Seluruh komentar yang terkumpul dari analisis keyword pada halaman ini.",
          })
        }
        title={INFO_HINT}
        className="block w-full cursor-pointer border-b border-slate-100 px-6 py-5 text-left dark:border-slate-800"
      >
        <h2 className="font-semibold text-slate-900 underline decoration-slate-200 decoration-dotted underline-offset-4 hover:decoration-indigo-400 dark:text-slate-100 dark:decoration-slate-700">{t.wordCloud.title}</h2>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{t.wordCloud.subtitle}</p>
      </button>
      <ReactECharts option={option} style={{ width: "100%", height: 460 }} notMerge lazyUpdate />
    </div>
  );
}
