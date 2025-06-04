import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Theme = "dark" | "light" | "system";

interface AppState {
  isAppLoading: boolean;
  setIsAppLoading: (state: boolean) => void;
  isSideBarToggled: boolean;
  toggleSideBar: () => void;
  activeNavName: string;
  setActiveNavName: (navName: string) => void;
  activeSession: boolean;
  activateSession: () => void;
  deactivateSession: () => void;
}

export const useAppStateStore = create<AppState>()(
  persist(
    (set, get) => ({
      // APP LOADING
      isAppLoading: false,
      setIsAppLoading(state) {
        set({ isAppLoading: state });
      },
      // SIDEBAR TOGGLE
      isSideBarToggled: true,
      toggleSideBar: () => {
        const { isSideBarToggled } = get();
        set({ isSideBarToggled: !isSideBarToggled });
      },

      // SIDEBAR ACTIVE NAV
      activeNavName: "Dashboard",
      setActiveNavName(navName) {
        set({ activeNavName: navName });
      },
      activeSession: false,
      activateSession: () => {
        set({ activeSession: true });
      },
      deactivateSession() {
        set({ activeSession: false });
      },
    }),
    {
      name: "app-state-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
