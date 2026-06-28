"use client";

import { exposureMock } from "../mock/exposure";

export function useExposureSummary() {
  return {
    data: exposureMock,
    isLoading: false,
    error: null,
  };
}
