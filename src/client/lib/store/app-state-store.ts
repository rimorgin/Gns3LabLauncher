import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";

interface IAppState {
  isAppLoading: boolean;
  setIsAppLoading: (state: boolean) => void;
  isSideBarToggled: boolean;
  toggleSideBar: () => void;
  activeNavName: string;
  setActiveNavName: (navName: string) => void;
  isQuickCreateDialogOpen: boolean;
  toggleQuickCreateDialog: () => void;
  isQuickEditDrawerOpen: boolean;
  toggleQuickEditDrawer: () => void;
  /* isFormSubmitted: boolean;
  submitForm: () => void; */

  resetAppState: () => void;
}

const initialState = {
  isAppLoading: false,
  isSideBarToggled: true,
  activeNavName: "Dashboard",
  isQuickCreateDialogOpen: false,
  isQuickEditDrawerOpen: false,
};

export const useAppStateStore = create<IAppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      // APP LOADING
      setIsAppLoading(state) {
        set({ isAppLoading: state });
      },
      // SIDEBAR TOGGLE
      toggleSideBar: () => {
        const { isSideBarToggled } = get();
        set({ isSideBarToggled: !isSideBarToggled });
      },
      // SIDEBAR ACTIVE NAV
      setActiveNavName(navName) {
        set({ activeNavName: navName });
      },
      // QUICK CREATE DIALOG TOGGLE
      toggleQuickCreateDialog: () => {
        const { isQuickCreateDialogOpen } = get();
        set({ isQuickCreateDialogOpen: !isQuickCreateDialogOpen });
      },
      // QUICK EDIT DRAWER TOGGLE
      toggleQuickEditDrawer: () => {
        const { isQuickEditDrawerOpen } = get();
        set({ isQuickEditDrawerOpen: !isQuickEditDrawerOpen });
      },
      resetAppState: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "app-state-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
