import { create } from "zustand";

interface QuickDialogState {
  isQuickDialogOpen: boolean;
  toggleQuickDialog: () => void;
}

export const useQuickDialogStore = create<QuickDialogState>((set, get) => ({
  isQuickDialogOpen: false,
  toggleQuickDialog: () => set({ isQuickDialogOpen: !get().isQuickDialogOpen }),
}));
