"use client";

import { timelineMock } from "../mock/timeline";

export function useExposureTimeline() {
  return {
    data: timelineMock,
    isLoading: false,
  };
}
