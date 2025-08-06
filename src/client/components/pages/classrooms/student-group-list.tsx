"use client";

import { Student, UserGroups } from "@clnt/types/classroom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import { useUserGroupsQuery } from "@clnt/lib/queries/user-groups-query";
import Loader from "@clnt/components/common/loader";

export function StudentGroupList({
  classroomId,
  currentUserId,
  onJoinGroup,
}: {
  classroomId: string;
  currentUserId: string;
  onJoinGroup: (group: UserGroups) => void;
}) {
  const {
    data: userGroupQry = [],
    isLoading,
    error,
  } = useUserGroupsQuery({
    includes: ["student"],
    by_classroom_only_id: classroomId,
  });
  if (isLoading) return <Loader />;
  if (error) return <div>oops something happened</div>;
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Existing Groups</h3>

      {userGroupQry.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No groups yet. Be the first!
        </p>
      )}

      <div className="space-y-2">
        {userGroupQry.map((group: UserGroups) => {
          const isMember = group.student.some(
            (s: Student) => s.userId === currentUserId,
          );
          const isFull = group.student.length >= group.limit;

          return (
            <Card key={group.id}>
              <CardHeader>
                <CardTitle className="text-base">{group.groupName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="font-medium">Limit:</span>{" "}
                  {group.student.length}/{group.limit}
                </div>
                <div className="flex flex-wrap gap-1">
                  {group.student.map((student: Student) => (
                    <Badge
                      key={student.userId}
                      variant={
                        student.userId === currentUserId
                          ? "default"
                          : "secondary"
                      }
                    >
                      {student.user.name}
                    </Badge>
                  ))}
                </div>

                {!isMember && !isFull && (
                  <Button
                    size="sm"
                    className="mt-2"
                    onClick={() => onJoinGroup(group)}
                  >
                    Join Group
                  </Button>
                )}

                {isMember && (
                  <p className="text-xs text-green-600 mt-1">
                    You are a member
                  </p>
                )}

                {isFull && !isMember && (
                  <p className="text-xs text-red-600 mt-1">Group is full</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
