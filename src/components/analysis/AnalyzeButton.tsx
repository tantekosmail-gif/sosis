// "use client";

// import { useSmartSearch } from "@/features/search/hooks/useSmartSearch";
// import { useFilterStore } from "@/stores/filterStore";
// import { useTopicStore } from "@/store/topic.store";
// import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

// export default function AnalyzeButton() {
//   const { execute, loadingSmartSearch } = useSmartSearch();

//   const topicId = useTopicStore((s) => s.topicId);

//   const {
//     keyword,
//     platform,
//     startDate,
//     endDate,
//   } = useFilterStore();

//   async function analyze() {
//     if (!topicId) {
//       alert("Silakan pilih Project terlebih dahulu.");
//       return;
//     }

//     if (!keyword.trim()) {
//       alert("Keyword tidak boleh kosong.");
//       return;
//     }

//     try {
//       console.log("========== ANALYZE ==========");

//       console.table({
//         topicId,
//         platform,
//         keyword,
//         startDate,
//         endDate,
//       });

//       const result = await execute({
//         topicId,
//         platform,
//         keyword,
//         startDate,
//         endDate,
//         limitVideos: 20,
//         limitComments: 50,
//       });

//       console.log("SMART SEARCH RESULT");
//       console.log(result);

//       // TODO:
//       // nanti refresh dashboard
//       // nanti generate AI Summary
//       // nanti update WordCloud

//     } catch (err) {
//       console.error("Analyze Error", err);

//       alert("Analyze gagal.");
//     }
//   }

//   return (
//     <button
//       type="button"
//       onClick={analyze}
//       disabled={loadingSmartSearch}
//       className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 transition"
//     >
//       {loadingSmartSearch ? "Analyzing..." : "Analyze"}
//     </button>
//   );
// }


"use client";

import { Button } from "@/components/ui/button";

import { useAnalyze } from "@/features/analysis/hooks/useAnalyze";

import { useFilterStore } from "@/stores/filterStore";

export default function AnalyzeButton() {
  const { execute } = useAnalyze();

  const platform = useFilterStore(
    (s) => s.platform
  );

  const keyword = useFilterStore(
    (s) => s.keyword
  );

  async function handleClick() {
    if (!keyword.trim()) {
      alert("Masukkan keyword");

      return;
    }

    await execute(platform, keyword);

    console.log("Dashboard Updated");
  }

  return (
    <Button
      onClick={handleClick}
      className="w-full"
    >
      Analyze
    </Button>
  );
}