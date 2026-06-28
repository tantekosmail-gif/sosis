"use client";

import { supabase } from "@/lib/supabaseClient";
import { useTopicStore } from "@/store/topic.store";
import { useFilterStore } from "@/stores/filterStore";
import { useEffect, useState } from "react";

export default function FilterBar() {
  const {
    platform,
    interval,
    startDate,
    endDate,
    keyword,

    setPlatform,
    setInterval,
    setStartDate,
    setEndDate,
    setKeyword,
  } = useFilterStore();

  const setTopicId = useTopicStore((s) => s.setTopicId);

  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("topics")
        .select("id, name")
        .eq("status", "active");

      if (!error) setTopics(data || []);
      else setTopics([]);

      setLoading(false);
    };

    fetchTopics();
  }, []);

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="grid grid-cols-6 gap-4">
        {/* TOPIC */}
        <select
          onChange={(e) => setTopicId(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">{loading ? "Loading..." : "Select Topic"}</option>

          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* PLATFORM */}
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="border rounded-xl px-3 py-2"
        >
          <option value="global">Global</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="youtube">Youtube</option>
          <option value="tiktok">TikTok</option>
        </select>

        {/* START DATE */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded-xl px-3 py-2"
        />

        {/* END DATE */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded-xl px-3 py-2"
        />

        {/* INTERVAL */}
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="border rounded-xl px-3 py-2"
        >
          <option value="1h">1 Hour</option>
          <option value="1d">1 Day</option>
          <option value="7d">7 Day</option>
          <option value="30d">30 Day</option>
        </select>

        {/* KEYWORD */}
        <input
          placeholder="Keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border rounded-xl px-3 py-2"
        />
      </div>
    </div>
  );
}
