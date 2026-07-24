import { create } from "zustand";

type TopicStore = {
  /** id (uuid) rekomendasi keyword terpilih -- dipakai untuk fetch keyword terkaitnya. */
  topicId: string | null;
  /** Nama topik untuk ditampilkan (mis. di TopicSelector), tanpa perlu cross-reference ulang ke list. */
  topicLabel: string | null;
  setTopic: (id: string, label: string) => void;
};

export const useTopicStore = create<TopicStore>((set) => ({
  topicId: null,
  topicLabel: null,
  setTopic: (topicId, topicLabel) => set({ topicId, topicLabel }),
}));
