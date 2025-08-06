import type { Classroom } from "./classroom"; // Assuming Classroom is defined in another file
import { Progress } from "./progress";
import { LabSubmission } from "./submission";

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
  progresses: Progress[];
  classrooms: Classroom[];
  submissions: LabSubmission[];
}

export enum ProjectTagsEnum {
  NETWORKING = "NETWORKING",
  SECURITY = "SECURITY",
}
