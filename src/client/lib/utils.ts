import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ClassroomDbData } from "./validators/classroom-schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(word: string) {
  return word[0].toUpperCase() + word.slice(1);
}

export function stringInitials(word: string) {
  return word
    .split(" ")
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

export function safeIds(input?: (string | undefined)[]): string[] {
  return (input ?? []).filter((id): id is string => typeof id === "string");
}

export const extractStudentIds = (classroom: Partial<ClassroomDbData>) => {
  if (classroom.students && classroom.students.length !== 0) {
    return classroom.students
      .map((student) => student.userId)
      .filter(Boolean) as string[];
  }
  return [];
};

export const extractProjectIds = (classroom: Partial<ClassroomDbData>) => {
  if (classroom.projects && classroom.projects.length !== 0) {
    return classroom.projects
      .map((project) => project.id)
      .filter(Boolean) as string[];
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

export function getChangedFields<T extends Record<string, unknown>>(
  current: T,
  original: T,
): Partial<T> {
  const changed: Partial<T> = {};
  for (const key in current) {
    if (!deepEqual(current[key], original[key])) {
      changed[key] = current[key];
    }
  }
  return changed;
}
