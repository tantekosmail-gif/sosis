"use client";

import { Loader2 } from "lucide-react";

import TopicEntitiesCard from "@/components/topic/TopicEntitiesCard";
import { useGlobalEntities } from "../hooks/useGlobalEntities";

export default function GlobalEntityRadarSection() {
  const { entities, loading } = useGlobalEntities();

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-12 shadow-sm">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <TopicEntitiesCard
      entities={entities}
      title="Entity Radar — Semua Topik"
      description="Orang, organisasi, lokasi, atau event yang paling sering disebut di seluruh topik yang dipantau."
    />
  );
}
