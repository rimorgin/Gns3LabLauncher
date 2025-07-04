export interface Student {
  id: string;
  name: string;
  student: {
    classrooms?: {
      id: string;
      classroomName: string;
    }[];
    groupIds?: Array<string>;
  };
}

export interface StudentOption {
  value: string;
  label: string;
}
