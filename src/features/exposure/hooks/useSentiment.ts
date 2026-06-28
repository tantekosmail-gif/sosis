"use client";

import { sentimentMock } from "../mock/sentiment";

export function useSentiment() {
  return {
    data: sentimentMock,
    isLoading: false,
  };
}
