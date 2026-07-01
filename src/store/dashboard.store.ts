import { create } from "zustand";

interface DashboardState {
  loading: boolean;

  dashboard: any | null;

  setLoading: (loading: boolean) => void;

  setDashboard: (dashboard: any) => void;

  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  loading: false,

  dashboard: null,

  setLoading: (loading) =>
    set({
      loading,
    }),

  setDashboard: (dashboard) =>
    set({
      dashboard,
    }),

  clearDashboard: () =>
    set({
      dashboard: null,
    }),
}));