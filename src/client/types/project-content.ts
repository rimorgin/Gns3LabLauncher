export interface ProjectContent {
  id: string;
  projectName: string;
  projectDescription: string;
  imageUrl: string | null;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedDuration: number; // in hours
  tags: string[];
  objectives: string[];
  prerequisites: string[];
  learningPath: LearningPathItem[];
  resources: ProjectResource[];
  assessments: Assessment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  type: "READING" | "LAB" | "QUIZ" | "PROJECT" | "VIDEO";
  order: number;
  estimatedTime: number; // in minutes
  content: ContentSection[];
  isRequired: boolean;
  prerequisites: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  type: "TEXT" | "CODE" | "IMAGE" | "VIDEO" | "CALLOUT" | "INTERACTIVE";
  content: string;
  order: number;
  metadata?: {
    language?: string; // for code blocks
    videoUrl?: string; // for videos
    imageAlt?: string; // for images
    calloutType?: "INFO" | "WARNING" | "SUCCESS" | "ERROR";
  };
}

export interface ProjectResource {
  id: string;
  title: string;
  type: "DOCUMENT" | "VIDEO" | "LINK" | "DOWNLOAD" | "TOOL";
  url: string;
  description: string;
  isRequired: boolean;
}

export interface Assessment {
  id: string;
  title: string;
  type: "QUIZ" | "LAB_SUBMISSION" | "PROJECT_SUBMISSION" | "PEER_REVIEW";
  description: string;
  questions?: QuizQuestion[];
  rubric?: RubricCriteria[];
  maxScore: number;
  passingScore: number;
  timeLimit?: number; // in minutes
  attempts: number;
}

export interface QuizQuestion {
  id: string;
  type:
    | "MULTIPLE_CHOICE"
    | "TRUE_FALSE"
    | "FILL_BLANK"
    | "DRAG_DROP"
    | "CODE_COMPLETION";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface RubricCriteria {
  id: string;
  criterion: string;
  description: string;
  levels: RubricLevel[];
}

export interface RubricLevel {
  level: string;
  description: string;
  points: number;
}
