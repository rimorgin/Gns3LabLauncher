import { create } from "zustand";

interface QuickDrawerState {
  isQuickDrawerOpen: boolean;
  toggleQuickDrawer: () => void;
}

export const useQuickDrawerStore = create<QuickDrawerState>((set, get) => ({
  isQuickDrawerOpen: false,
  toggleQuickDrawer: () => set({ isQuickDrawerOpen: !get().isQuickDrawerOpen }),
}));
