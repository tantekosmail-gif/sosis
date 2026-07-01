import { create } from "zustand";

function getDefaultDates() {
  const now = new Date();
  const end = now.toISOString().substring(0, 10);
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().substring(0, 10);
  return { start, end };
}

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

const { start: defaultStart, end: defaultEnd } = getDefaultDates();

export const useFilterStore = create<FilterState>((set) => ({
  topic: "Tim Urai Kemacetan",

  // platform: "global",
  platform: "youtube",

  interval: "1d",

  startDate: defaultStart,

  endDate: defaultEnd,

  keyword: "",

  setTopic: (topic) => set({ topic }),

  setPlatform: (platform) => set({ platform }),

  setInterval: (interval) => set({ interval }),

  setStartDate: (startDate) => set({ startDate }),

  setEndDate: (endDate) => set({ endDate }),

  setKeyword: (keyword) => set({ keyword }),
}));