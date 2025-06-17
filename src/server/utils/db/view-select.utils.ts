type ViewOption = "dropdown" | "list" | "full";
type ModelOption = "user" | "course" | "classroom" | "project";


const viewSelects = {
  user: {
    dropdown: { id: true },
    list: { id: true, name: true, email: true, role: true },
    full: undefined,
  },
  course: {
    dropdown: { id: true },
    list: { id: true, courseCode: true },
    full: undefined,
  },
  classroom: {
    dropdown: { id: true },
    list: { id: true, classroomName: true },
    full: undefined,
  },
  project: {
    dropdown: { id: true },
    list: { id: true, projectName: true },
    full: undefined,
  },
} as const;

export function getSelectByView<
  M extends ModelOption,
  V extends ViewOption = "full"
>(
  model: M,
  view?: V
): (typeof viewSelects)[M][V] {
  return viewSelects[model][view ?? "full" as V];
}


/* const s1 = getSelectByView("user", "dropdown");
// inferred: { id: true }

const s2 = getSelectByView("project", "list");
// inferred: { id: true, projectName: true }

const s3 = getSelectByView("course");
// inferred: undefined (which is what "full" maps to)
 */