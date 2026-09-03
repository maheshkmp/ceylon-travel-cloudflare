// With Better Auth, session state is managed by Better Auth's useSession hook.
// This store is kept only for UI state that doesn't need to be persisted.
// The single source of truth is: authClient.useSession()

"use client";

import { create } from "zustand";

interface UIState {
  // Add any global UI state here (sidebar collapsed, etc.)
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
}));

