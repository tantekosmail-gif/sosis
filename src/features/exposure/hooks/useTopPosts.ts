"use client";

import { topPostsMock } from "../mock/posts";

export function useTopPosts() {
  return {
    data: topPostsMock,
    isLoading: false,
  };
}
