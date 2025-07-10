import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  isSideBarToggled: boolean;
  toggleSideBar: () => void;
  activeNavName: string;
  setActiveNavName: (name: string) => void;
  resetSidebar: () => void;
}

const initialState = {
  isSideBarToggled: true,
  activeNavName: "Dashboard",
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      ...initialState,
      toggleSideBar: () => set({ isSideBarToggled: !get().isSideBarToggled }),
      setActiveNavName: (activeNavName) => set({ activeNavName }),
      resetSidebar: () => set({ ...initialState }),
    }),
    {
      name: "sidebar-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
