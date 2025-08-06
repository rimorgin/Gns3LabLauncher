import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type {
  Lab,
  LabEnvironment,
  LabGuide,
  LabResource,
  LabSettings,
} from "@clnt/types/lab";

export const initialLabData = {
  lab: {
    basicInfo: {},
    environment: {},
    guide: {},
    resources: [],
    settings: {},
  },
  hasEdited: false,
  hasHydrated: false,
};

export interface LabBuilderData {
  basicInfo: Partial<Lab>;
  environment: Partial<LabEnvironment>;
  guide: Partial<LabGuide>;
  resources: LabResource[];
  settings: Partial<LabSettings>;
}

interface LabBuilderState {
  lab: LabBuilderData;
  hasHydrated: boolean;
  setHasHydrated: () => void;
  setLab: (lab: LabBuilderData | null) => void;
  updateSection: <K extends keyof LabBuilderData>(
    key: K,
    data: LabBuilderData[K],
  ) => void;
  resetLab: () => void;
  buildLab: (username?: string) => Lab;
  hasEdited: boolean;
  setHasEdited: (edited: boolean) => void;
  initializeLabFromExisting: (lab: Lab) => void;
  exitBuilderPage: () => void;
}

export const useLabBuilderStore = create<LabBuilderState>()(
  persist(
    immer((set, get) => ({
      ...initialLabData,
      setLab: (lab) => {
        set((state) => {
          state.lab = lab ?? initialLabData.lab;
        });
      },
      updateSection: (key, data) => {
        set((state) => {
          state.lab[key] = data;
          state.hasEdited = true;
        });
      },
      resetLab: () => {
        set((state) => {
          state.lab = initialLabData.lab;
        });
      },
      buildLab: (username = "Unknown") => {
        const labData = get().lab;
        return {
          id: labData.basicInfo.id ?? crypto.randomUUID(),
          title: labData.basicInfo.title ?? "Untitled",
          description: labData.basicInfo.description ?? "",
          difficulty: labData.basicInfo.difficulty ?? "BEGINNER",
          estimatedTime: labData.basicInfo.estimatedTime ?? 60,
          category: labData.basicInfo.category ?? "",
          tags: labData.basicInfo.tags ?? [],
          objectives: labData.basicInfo.objectives ?? [],
          prerequisites: labData.basicInfo.prerequisites ?? [],
          environment: { ...labData.environment } as LabEnvironment,
          guide: { ...labData.guide } as LabGuide,
          resources: [...(labData.resources ?? ([] as LabResource[]))],
          settings: { ...labData.settings } as LabSettings,
          createdAt: labData.basicInfo.createdAt ?? new Date(),
          updatedAt: new Date(),
          createdBy: username,
          status: "PUBLISHED",
        };
      },
      setHasEdited: (edited: boolean) =>
        set((state) => {
          state.hasEdited = edited;
        }),

      initializeLabFromExisting: (initialLab) => {
        set((state) => {
          state.lab = {
            basicInfo: {
              id: initialLab.id,
              title: initialLab.title,
              description: initialLab.description,
              category: initialLab.category,
              difficulty: initialLab.difficulty,
              tags: initialLab.tags,
              status: initialLab.status,
              estimatedTime: initialLab.estimatedTime,
              objectives: initialLab.objectives,
              prerequisites: initialLab.prerequisites,
              createdBy: initialLab.createdBy,
            },
            environment: initialLab.environment ?? {},
            guide: initialLab.guide ?? {},
            resources: initialLab.resources ?? [],
            settings: initialLab.settings ?? {},
          };
        });
      },
      exitBuilderPage: () => {
        set((state) => {
          state.lab = initialLabData.lab;
          state.hasEdited = false;
        });
      },
      setHasHydrated: () => {
        set((state) => {
          state.hasHydrated = true;
        });
      },
    })),
    {
      name: "lab-builder-store", // key in localStorage
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(); // <- set hydrated when done
      },
      partialize: (state) => ({
        lab: state.lab,
        hasEdited: state.hasEdited,
        hasHydrated: state.hasHydrated,
      }), // persist only `lab` and `has edited, skip methods
    },
  ),
);
