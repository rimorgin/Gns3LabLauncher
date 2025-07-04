import { z } from "zod";

export const userGroupFormSchema = z.object({
  classroomId: z.string(),
  groupName: z.string().optional(),
  studentIds: z.array(z.string().optional()),
  imageUrl: z.string().optional(),
});

export type UserGroupFormData = z.infer<typeof userGroupFormSchema>;
