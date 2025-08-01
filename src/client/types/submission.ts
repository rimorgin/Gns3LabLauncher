// Updated LabSubmission interface based on your Prisma model
export interface LabSubmission {
  id: string;
  labId: string;
  studentId: string;
  projectId: string;
  submittedAt?: string; // DateTime?
  updatedAt: string; // DateTime
  status?: "submitted" | "graded" | "late" | "pending"; // SubmissionStatus?
  grade?: number; // Float?
  feedback?: string; // String?
  attempt: number; // Int with autoincrement
  files: LabSubmissionFile[]; // Relation to LabSubmissionFile[]

  // Relations
  student: {
    userId: string;
    isOnline: boolean;
    lastActiveAt?: string;
    user: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
  project: {
    id: string;
    projectName: string;
    projectDescription?: string;
    imageUrl?: string;
    duration?: string;
    tags?: string;
    byGroupSubmissions?: boolean;
  };
  lab: {
    id: string;
    title: string;
    description?: string;
    maxGrade: number;
    dueDate?: string;
  };
}

// Updated LabSubmissionFile interface based on your Prisma model
export interface LabSubmissionFile {
  id: string;
  labSubmissionId: string;
  url: string;
  name?: string; // String?
  uploadedAt: Date; // DateTime
}
