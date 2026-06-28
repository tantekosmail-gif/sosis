"use client";

import { platformMock } from "../mock/platform";

export function usePlatform() {
  return {
    data: platformMock,
    isLoading: false,
  };
}
