"use client";

import { useState } from "react";
import { generateAISummary } from "../services/ai.service";

export function useAISummary() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function run(topicId: string) {
    setLoading(true);

    const res = await generateAISummary(topicId);

    setData(res);

    setLoading(false);
  }

  return { loading, data, run };
}