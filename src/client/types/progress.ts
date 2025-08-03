export type ProgressStatus = "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";

export interface Progress {
  id: string;
  studentId: string | null;
  groupId: string | null;
  projectId: string;
  classroomId: string | null;
  percentComplete: number;
  status: ProgressStatus | null;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface LabProgress {
  id: string;
  studentId: string | null;
  groupId: string | null;
  progressId: string;
  labId: string;
  status: ProgressStatus | null;
  currentSection: number | null;
  completedSections: number[];
  completedTasks: string[];
  completedVerifications: string[];
  percentComplete: number;
  createdAt: Date;
  updatedAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
}
