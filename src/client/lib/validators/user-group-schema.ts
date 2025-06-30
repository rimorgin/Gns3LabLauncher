import { z } from "zod";

export const userGroupFormSchema = z.object({
  groupName: z.string().optional(),
  studentIds: z.array(z.string().optional()),
});

export type UserGroupFormData = z.infer<typeof userGroupFormSchema>;
