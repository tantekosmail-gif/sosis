// "use client";

// import { useEffect, useState } from "react";
// import { getDashboard } from "../services/dashboard.service";
// import { useFilterStore } from "@/stores/filterStore";
// import { useTopicStore } from "@/store/topic.store";

// export function useDashboard() {
//   const topicId = useTopicStore((s) => s.topicId);

//   const {
//     platform,
//     startDate,
//     endDate,
//   } = useFilterStore();

//   const [loading, setLoading] = useState(false);

//   const [dashboard, setDashboard] = useState<any>(null);

//   async function reload() {
//     if (!topicId) return;

//     setLoading(true);

//     try {
//       const res = await getDashboard({
//         topicId,
//         platform,
//         dateFrom: startDate,
//         dateTo: endDate,
//       });

//       setDashboard(res);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     reload();
//   }, [topicId, platform, startDate, endDate]);

//   return {
//     loading,
//     reload,
//     dashboard,
//   };
// }


"use client";

import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboard.service";
import { useFilterStore } from "@/stores/filterStore";
import { useTopicStore } from "@/store/topic.store";

export function useDashboard() {
  const topicId = useTopicStore((s) => s.topicId);

  const {
    platform,
    startDate,
    endDate,
  } = useFilterStore();

  const [loading, setLoading] = useState(false);

  const [dashboard, setDashboard] = useState<any>(null);

  async function reload() {
    if (!topicId) return;

    setLoading(true);

    try {
      const res = await getDashboard({
        topicId,
        platform,
        dateFrom: startDate,
        dateTo: endDate,
      });

      setDashboard(res);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reload();
  }, [topicId, platform, startDate, endDate]);

  return {
    loading,
    reload,
    dashboard,
  };
}