"use client";

import { create } from "zustand";
import { DashboardData } from "@/types/dashboard.type";

interface DashboardStore {
  dashboard: DashboardData | null;

  loading: boolean;

  error: string | null;

  setLoading: (loading: boolean) => void;

  setDashboard: (dashboard: DashboardData | null) => void;

  setError: (error: string | null) => void;

  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboard: null,

  loading: false,

  error: null,

  setLoading: (loading) =>
    set({
      loading,
    }),

  setDashboard: (dashboard) =>
    set({
      dashboard,
      error: null,
    }),

  setError: (error) =>
    set({
      error,
    }),

  clearDashboard: () =>
    set({
      dashboard: null,
      loading: false,
      error: null,
    }),
}));
