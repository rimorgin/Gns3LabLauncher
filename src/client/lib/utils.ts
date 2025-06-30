import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UserDbData } from "./validators/user-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function safeIds(input?: (string | undefined)[]): string[] {
  return (input ?? []).filter((id): id is string => typeof id === "string");
}

// Helper function to extract classroom IDs from database format
export const extractClassroomIds = (user: Partial<UserDbData>) => {
  if (user.role === "instructor" && user.instructor?.classrooms) {
    return user.instructor.classrooms
      .map((cls) => cls.id)
      .filter(Boolean) as string[];
  }
  if (user.role === "student" && user.student?.classrooms) {
    return user.student.classrooms
      .map((cls) => cls.id)
      .filter(Boolean) as string[];
  }
  return [];
};

// Helper function to extract group IDs from database format
export const extractGroupIds = (user: Partial<UserDbData>) => {
  if (user.role === "student" && user.student?.userGroups) {
    return user.student.userGroups
      .map((grp) => grp.id)
      .filter(Boolean) as string[];
  }
  return [];
};

// Helper function to extract expertise from database format
export const extractExpertise = (user: Partial<UserDbData>) => {
  if (user.role === "instructor" && user.instructor?.expertise) {
    return user.instructor.expertise.filter(Boolean) as string[];
  }
  return [];
};

export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a == null || b == null) return false;

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  return keysA.every((key) =>
    deepEqual(
      (a as Record<string, unknown>)[key],
      (b as Record<string, unknown>)[key],
    ),
  );
}
