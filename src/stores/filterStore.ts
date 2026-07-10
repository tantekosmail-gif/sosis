import { create } from "zustand";

interface FilterState {
  topic: string;
  platform: string;
  interval: string;

  startDate: string;
  endDate: string;

  keyword: string;

  setTopic: (v: string) => void;
  setPlatform: (v: string) => void;
  setInterval: (v: string) => void;

  setStartDate: (v: string) => void;
  setEndDate: (v: string) => void;

  setKeyword: (v: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  topic: "Tim Urai Kemacetan",

  platform: "youtube",

  interval: "1d",

  startDate: "",

  endDate: "",

  keyword: "",

  setTopic: (topic) => set({ topic }),

  setPlatform: (platform) => set({ platform }),

  setInterval: (interval) => set({ interval }),

  setStartDate: (startDate) => set({ startDate }),

  setEndDate: (endDate) => set({ endDate }),

  setKeyword: (keyword) => set({ keyword }),
}));