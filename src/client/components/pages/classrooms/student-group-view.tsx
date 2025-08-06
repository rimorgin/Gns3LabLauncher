"use client";

import { useState } from "react";
import { StudentGroupCreate } from "./student-group-create";
import { StudentGroupList } from "./student-group-list";
import { UserGroups } from "@clnt/types/classroom";
import { Button } from "@clnt/components/ui/button";

export function StudentGroupView({
  classroomId,
  currentUserId,
  onJoinGroup,
}: {
  classroomId: string;
  studentGroups: UserGroups[];
  currentUserId: string;
  onJoinGroup: (group: UserGroups) => void;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-muted p-5 rounded-lg">
        <h3 className="text-lg font-semibold">Student Groups</h3>
        <Button onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Cancel" : "Create Group"}
        </Button>
      </div>

      {showForm && (
        <div className="p-4 border rounded-md bg-muted">
          <StudentGroupCreate
            classroomId={classroomId}
            currentUserId={currentUserId}
          />
        </div>
      )}

      <StudentGroupList
        classroomId={classroomId}
        currentUserId={currentUserId}
        onJoinGroup={onJoinGroup}
      />
    </div>
  );
}
