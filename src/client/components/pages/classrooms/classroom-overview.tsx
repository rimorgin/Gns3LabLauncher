import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@clnt/components/ui/card";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { IconUsersGroup } from "@tabler/icons-react";
import { BookOpen, Users } from "lucide-react";
import { Classroom } from "@clnt/types/classroom";

export default function ClassroomOverview({
  classroom,
}: {
  classroom: Classroom;
}) {
  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback randomizeBg>
                  <BookOpen className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              Active Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
              {classroom.projects?.length}
            </div>
            <p className="text-xs text-muted-foreground">Assigned projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback randomizeBg>
                  <Users className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
              {classroom.students?.length}
            </div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarFallback randomizeBg>
                  <IconUsersGroup className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              Total Student Groups
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary dark:text-primary-foreground">
              {classroom.studentGroups?.length}
            </div>
            <p className="text-xs text-muted-foreground">Groups made</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
