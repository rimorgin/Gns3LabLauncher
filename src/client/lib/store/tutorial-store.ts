import { create } from "zustand";

interface TutorialStore {
  selectedTutorial: string | null;
  setSelectedTutorial: (tutorialId: string) => void;
  clearTutorial: () => void;
}

export const useTutorialStore = create<TutorialStore>((set) => ({
  selectedTutorial: null,
  setSelectedTutorial: (tutorialId: string) =>
    set({ selectedTutorial: tutorialId }),
  clearTutorial: () => set({ selectedTutorial: null }),
}));
