"use client";

import { create } from "zustand";

interface FilterStore {
  platform: string;
  interval: string;
  keyword: string;

  runId: number;

  setPlatform: (value: string) => void;
  setInterval: (value: string) => void;
  setKeyword: (value: string) => void;

  execute: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  platform: "global",
  interval: "1d",
  keyword: "",

  runId: 0,

  setPlatform: (value) => set({ platform: value }),

  setInterval: (value) => set({ interval: value }),

  setKeyword: (value) => set({ keyword: value }),

  execute: () =>
    set((state) => ({
      runId: state.runId + 1,
    })),
}));