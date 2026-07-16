import { create } from "zustand";

// Local calendar date, not UTC — toISOString() would roll the date back for
// any visitor east of UTC (e.g. WIB/UTC+7) during the first hours of the day.
function toLocalDateString(d: Date) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function defaultDateRange() {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 7);
  return { startDate: toLocalDateString(from), endDate: toLocalDateString(to) };
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

export const useFilterStore = create<FilterState>((set) => ({
  topic: "Tim Urai Kemacetan",

  platform: "youtube",

  interval: "1d",

  ...defaultDateRange(),

  keyword: "",

  setTopic: (topic) => set({ topic }),

  setPlatform: (platform) => set({ platform }),

  setInterval: (interval) => set({ interval }),

  setStartDate: (startDate) => set({ startDate }),

  setEndDate: (endDate) => set({ endDate }),

  setKeyword: (keyword) => set({ keyword }),
}));