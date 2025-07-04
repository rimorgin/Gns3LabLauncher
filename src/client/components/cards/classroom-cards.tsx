import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import { Button } from "@clnt/components/ui/button";
import { Separator } from "@clnt/components/ui/separator";
import { TeacherIcon } from "@clnt/components/common/svg-icons";
import { IconAlertOctagonFilled, IconLockFilled } from "@tabler/icons-react";
import { Badge } from "@clnt/components/ui/badge";

type ClassroomData = {
  id: string;
  classroomName: string;
  status: "active" | "expired" | "archived" | "locked";
  course: { courseCode: string; courseName?: string | null };
  instructor: { user: { name: string; email: string; username: string } };
  students: { user: { name: string; email: string; username: string } }[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
};

export function ClassroomCard({ classroom }: { classroom: ClassroomData }) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const classroomStatus = classroom.status;
  const isLockedOrExpired =
    classroom.status === "expired" || classroom.status === "locked";

  const badgeColor: "default" | "secondary" | "destructive" | "outline" =
    classroom.status === "expired"
      ? "destructive"
      : classroom.status === "archived"
        ? "secondary"
        : classroom.status === "locked"
          ? "outline"
          : "default";

  return (
    <>
      <ClassroomViewer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        classroom={classroom}
      />
      <Card
        onClick={() =>
          setOpenDrawer(
            classroomStatus === "active" || classroomStatus === "archived",
          )
        }
        role="button"
        className="w-full max-w-md rounded-xl shadow-md overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.025] hover:shadow-lg active:scale-95 break-inside-avoid"
      >
        {/* IMAGE SECTION */}
        <div className="relative">
          <img
            src={classroom.imageUrl?.trim() || "/placeholder.png"}
            alt={classroom.classroomName}
            className={`h-40 w-full object-cover -mt-6 ${isLockedOrExpired ? "contrast-50 brightness-50" : ""}`}
          />
          {classroomStatus === "locked" && (
            <span className="absolute inset-0 flex items-center justify-center">
              <IconLockFilled className="w-3/6 h-3/6" />
            </span>
          )}
          {classroomStatus === "expired" && (
            <span className="absolute inset-0 flex items-center justify-center">
              <IconAlertOctagonFilled className="w-3/6 h-3/6 fill-destructive" />
            </span>
          )}
        </div>

        {/* HEADER & CONTENT */}
        <CardHeader>
          <div className="flex flex-row justify-between">
            <CardTitle className="text-md font-semibold">
              {(classroom.course?.courseCode ?? "") +
                " - " +
                classroom.classroomName}
            </CardTitle>
            <Badge variant={badgeColor ?? "default"}>{classroom.status}</Badge>
          </div>
          <CardDescription className="text-xs">
            {classroom.course.courseName || "No course assigned"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-row -mb-3 justify-between ">
            <p className="text-xs text-muted-foreground">
              {classroom.students.length} Students enrolled
            </p>
          </div>
        </CardContent>
        <CardFooter className="-mb-3">
          <div className="flex flex-col w-full gap-3">
            <Separator />
            <div className="flex flex-col gap-2 text-xs font-bold">
              {classroom.instructor.user.name && (
                <div className="flex items-center gap-2">
                  <TeacherIcon />
                  {classroom.instructor.user.name.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export function ClassroomList({ classrooms }: { classrooms: ClassroomData[] }) {
  if (classrooms.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic py-6 text-center">
        No classrooms found.
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
      {classrooms.map((classroom) => {
        const isLockedOrExpired =
          classroom.status === "expired" || classroom.status === "locked";

        return (
          <div key={classroom.id} className="mb-4 relative group">
            {isLockedOrExpired && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-bold transition-opacity z-10">
                {classroom.status === "expired"
                  ? "You can't access this content anymore"
                  : "The content is locked"}
              </div>
            )}

            <ClassroomCard classroom={classroom} />
          </div>
        );
      })}
    </div>
  );
}

export function ClassroomViewer({
  classroom,
  open,
  onOpenChange,
}: {
  classroom: ClassroomData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer modal open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent className="h-3/4">
        <div className="h-full flex flex-col">
          <DrawerHeader>
            <DrawerTitle>{classroom.classroomName}</DrawerTitle>
            <DrawerDescription>
              {classroom.course.courseName || "No course assigned"}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <p>Status: {classroom.status}</p>
            <p>Instructor: {classroom.instructor.user.name || "None"}</p>
          </div>

          <DrawerFooter>
            <Button>Save</Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
