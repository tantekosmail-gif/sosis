import { create } from "zustand";

type TopicStore = {
  topicId: string | null;
  setTopicId: (id: string) => void;
};

export const useTopicStore = create<TopicStore>((set) => ({
  topicId: null,
  setTopicId: (id) => set({ topicId: id }),
}));