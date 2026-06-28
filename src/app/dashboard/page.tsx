"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FilterBar from "@/components/filters/FilterBar";

import ExposureSection from "@/features/dashboard/sections/ExposureSection";
import SentimentSection from "@/features/dashboard/sections/SentimentSection";
import TopPostsSection from "@/features/dashboard/sections/TopPostsSection";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import { useTopicStore } from "@/store/topic.store";
import PlatformChart from "@/components/dashboard/PlatformChart";
import WordCloud from "@/components/dashboard/WordCloud";

export default function DashboardPage() {
  const topicId = useTopicStore((s) => s.topicId);

  const { dashboard, platform, sentiment, timeline, topPosts, wordCloud } =
    useDashboard(topicId || "");

  const wordCloudMock = [
  { keyword: "macet", total: 35 },
  { keyword: "kemacetan", total: 30 },
  { keyword: "dishub", total: 18 },
  { keyword: "jalan", total: 25 },
  { keyword: "lampu merah", total: 15 },
  { keyword: "parkir", total: 12 },
  { keyword: "trotoar", total: 11 },
  { keyword: "angkutan", total: 10 },
  { keyword: "bus", total: 20 },
  { keyword: "halte", total: 9 },
  { keyword: "jalan rusak", total: 14 },
  { keyword: "banjir", total: 19 },
  { keyword: "drainase", total: 13 },
  { keyword: "polisi", total: 8 },
  { keyword: "kecelakaan", total: 17 },
  { keyword: "motor", total: 16 },
  { keyword: "mobil", total: 22 },
  { keyword: "truk", total: 7 },
  { keyword: "ojek", total: 9 },
  { keyword: "terminal", total: 8 },
  { keyword: "jalan tol", total: 11 },
  { keyword: "simpang", total: 6 },
  { keyword: "u turn", total: 5 },
  { keyword: "zebra cross", total: 7 },
  { keyword: "pelican crossing", total: 4 },
  { keyword: "kemacetan parah", total: 12 },
  { keyword: "lalu lintas", total: 24 },
  { keyword: "rekayasa lalu lintas", total: 10 },
  { keyword: "pengalihan arus", total: 9 },
  { keyword: "jalan ditutup", total: 8 },
  { keyword: "parkir liar", total: 15 },
  { keyword: "kendaraan", total: 14 },
  { keyword: "kemacetan pagi", total: 13 },
  { keyword: "kemacetan sore", total: 12 },
  { keyword: "jalan utama", total: 9 },
  { keyword: "jalan alternatif", total: 10 },
  { keyword: "pengendara", total: 11 },
  { keyword: "pengguna jalan", total: 7 },
  { keyword: "sepeda", total: 6 },
  { keyword: "jalur sepeda", total: 5 },
  { keyword: "pejalan kaki", total: 12 },
  { keyword: "transportasi", total: 16 },
  { keyword: "transportasi umum", total: 18 },
  { keyword: "kemacetan kota", total: 20 },
  { keyword: "jalan nasional", total: 8 },
  { keyword: "perempatan", total: 6 },
  { keyword: "bundaran", total: 5 },
  { keyword: "flyover", total: 11 },
  { keyword: "underpass", total: 9 },
  { keyword: "kemacetan panjang", total: 14 },
];

  return (
    <DashboardLayout>
      <DashboardHeader />

      <FilterBar />

      {topicId ? (
        <>
          <ExposureSection data={dashboard} timeline={timeline} />

          <SentimentSection data={sentiment} platform={platform} />

          <TopPostsSection data={topPosts} />

          <WordCloud data={wordCloudMock} />
        </>
      ) : (
        <div className="p-10 text-center text-gray-500">
          Pilih topic terlebih dahulu
        </div>
      )}
    </DashboardLayout>
  );
}
