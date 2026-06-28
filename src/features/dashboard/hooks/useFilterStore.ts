import { create } from "zustand";

type FilterState = {
  topicId: string | null;
  platform: string;
  interval: string;
  startDate: string;
  endDate: string;
  keyword: string;

  setTopicId: (v: string) => void;
  setPlatform: (v: string) => void;
  setInterval: (v: string) => void;
  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;
  setKeyword: (v: string) => void;
};

export const useFilterStore = create<FilterState>((set) => ({
  topicId: null,
  platform: "global",
  interval: "1d",
  startDate: "",
  endDate: "",
  keyword: "",

  setTopicId: (v) => set({ topicId: v }),
  setPlatform: (v) => set({ platform: v }),
  setInterval: (v) => set({ interval: v }),
  setStartDate: (v) => set({ startDate: v }),
  setEndDate: (v) => set({ endDate: v }),
  setKeyword: (v) => set({ keyword: v }),
}));