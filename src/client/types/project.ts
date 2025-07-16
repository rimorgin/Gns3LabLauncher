import type { Classroom } from "./classroom"; // Assuming Classroom is defined in another file

export interface Project {
  id: string;
  projectName: string;
  projectDescription: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  visible: boolean | null;
  duration: Date | null;
  tags: ProjectTagsEnum | null;
  steps: LearningStep[];
  progresses: Progress[];
  classrooms: Classroom[];
  submissions: Submission[];
}

export interface Progress {
  id: string;
  userId: string;
  projectId: string;
  completedSteps: number;
  totalSteps: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  lastAccessedAt: Date;
}

export interface Submission {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  status: "DRAFT" | "SUBMITTED" | "REVIEWED";
  score: number | null;
  feedback: string | null;
  submittedAt: Date;
}

export enum ProjectTagsEnum {
  NETWORKING = "NETWORKING",
  SECURITY = "SECURITY",
}

export interface LearningStep {
  id: string;
  title: string;
  description: string;
  type: "READING" | "LAB" | "QUIZ" | "PROJECT";
  estimatedTime: number;
  prerequisites: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: "VIDEO" | "DOCUMENT" | "LINK" | "CODE";
  url: string;
}

export interface ReadingContent {
  id: string;
  title: string;
  content: string;
  sections: ReadingSection[];
  estimatedReadTime: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  objectives: string[];
  keyTerms: KeyTerm[];
}

export interface ReadingSection {
  id: string;
  title: string;
  content: string;
  type: "TEXT" | "CODE" | "IMAGE" | "VIDEO" | "CALLOUT";
  order: number;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit?: number;
  passingScore: number;
  attempts: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
}

export interface QuizQuestion {
  id: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK" | "DRAG_DROP";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  image?: string;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  score: number;
  totalPoints: number;
  startedAt: Date;
  completedAt?: Date;
  timeSpent: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
}
