import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LabState {
  isLabLoading: boolean;
  isLabRunning: boolean;
  instanceIpAddress: string;
  setIsLabLoading: (loading: boolean) => void;
  setIsLabRunning: (running: boolean) => void;
  setInstanceIpAddress: (ip: string) => void;
  clearLabState: () => void;
}

export const useLabStore = create<LabState>()(
  persist(
    (set) => ({
      isLabLoading: false,
      isLabRunning: false,
      instanceIpAddress: "",
      setIsLabLoading: (loading) => set({ isLabLoading: loading }),
      setIsLabRunning: (running) => set({ isLabRunning: running }),
      setInstanceIpAddress: (ip) => set({ instanceIpAddress: ip }),
      clearLabState: () => set({ isLabRunning: false, instanceIpAddress: "" }),
    }),
    {
      name: "lab-state",
      partialize: (state) => ({
        isLabLoading: state.isLabLoading,
        isLabRunning: state.isLabRunning,
        instanceIpAddress: state.instanceIpAddress,
      }),
    },
  ),
);
