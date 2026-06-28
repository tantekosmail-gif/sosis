"use client";

import { useMutation } from "@tanstack/react-query";
import { executeAnalyze } from "@/services/analyze.service";

export function useAnalyze() {
  return useMutation({
    mutationFn: executeAnalyze,
  });
}