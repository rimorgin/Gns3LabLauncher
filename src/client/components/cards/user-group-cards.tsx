import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { Pencil, Trash, UserIcon } from "lucide-react";
import { IconDotsVertical } from "@tabler/icons-react";
import { Button } from "@clnt/components/ui/button";

type User = {
  id: string;
  name?: string | null;
  username: string;
  email: string;
};

type Student = {
  id: string;
  user: User;
};

type Classroom = {
  id: string;
  classroomName: string;
  course?: {
    courseCode: string;
    courseName: string;
  };
};

export type UserGroupData = {
  id: string;
  groupName: string;
  imageUrl: string;
  classrooms?: Classroom;
  student?: Student[];
};

export function UserGroupCard({ group }: { group: UserGroupData }) {
  return (
    <Card className="relative rounded-md border-0">
      <CardHeader>
        <CardTitle className="text-base leading-0 mt-1.5 font-semibold">
          {group.groupName.toUpperCase()}
        </CardTitle>
        <p className="text-sm  mt-4 leading-0 text-muted-foreground">
          {group.classrooms?.classroomName.toUpperCase()}
        </p>

        {/* This will now position within the Card */}
        <div className="absolute top-4 right-5 flex justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
              >
                <IconDotsVertical />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Pencil />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 px-6">
        {group?.student?.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No students in this group.
          </p>
        ) : (
          group?.student?.map((student) => (
            <div
              key={student.id}
              className="flex items-center gap-4 p-2 border border-muted rounded-lg"
            >
              <Avatar>
                <AvatarFallback>
                  <UserIcon className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{student.user?.name}</p>
                <p className="text-sm text-muted-foreground">
                  @{student.user.username}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function UserGroupList({ groups }: { groups: UserGroupData[] }) {
  const groupedByCourseAndClassroom = groups.reduce(
    (acc, group) => {
      const courseCode = group.classrooms?.course?.courseCode || "UnknownCode";
      const courseName =
        group.classrooms?.course?.courseName || "UnknownCourse";

      const key = `${courseCode}-${courseName}`;

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(group);
      return acc;
    },
    {} as Record<string, UserGroupData[]>,
  );

  return (
    <div className="space-y-10">
      {Object.entries(groupedByCourseAndClassroom).map(
        ([compositeKey, classGroups]) => {
          const [courseCode, courseName] = compositeKey.split("-");

          return (
            <div key={compositeKey}>
              <h2 className="text-lg font-semibold text-muted-foreground mb-2">
                {`${courseCode} - ${courseName}`.toUpperCase()}
              </h2>
              <div className="w-full columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {classGroups.map((group) => (
                  <div key={group.id} className="break-inside-avoid mb-6">
                    <UserGroupCard group={group} />
                  </div>
                ))}
              </div>
            </div>
          );
        },
      )}
    </div>
  );
}
