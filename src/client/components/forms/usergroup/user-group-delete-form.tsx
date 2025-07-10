import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { useUserGroupDelete } from "@clnt/lib/mutations/usergroup/user-group-delete-mutation";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";
import { UserGroupDbData } from "@clnt/lib/validators/user-group-schema";

interface UserGroupDeleteProps {
  initialData: Partial<UserGroupDbData> | Partial<UserGroupDbData>[];
}
export function UserGroupDeleteForm({ initialData }: UserGroupDeleteProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const { mutateAsync, status } = useUserGroupDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
  const firstUserGroup = dataList[0]; // Used for showing name/email/username

  const onDelete = async () => {
    const ids = dataList.map((user) => user.id).filter(Boolean) as string[];

    if (ids.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }

    toast.promise(mutateAsync(ids), {
      loading:
        ids.length > 1 ? "Deleting user groups..." : "Deleting user group...",
      success: () => {
        toggleQuickDrawer();
        return ids.length > 1 ? "User groups deleted." : "User group deleted.";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete user group(s)",
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onDelete();
      }}
      className="space-y-4"
    >
      {(!isArray || dataList.length === 1) && (
        <>
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input disabled value={firstUserGroup?.groupName || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Info</label>
            <Input
              disabled
              value={`${firstUserGroup?.classrooms?.course?.courseCode}-${firstUserGroup?.classrooms?.course?.courseName}-${firstUserGroup?.classrooms?.classroomName}`}
              type="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Students</label>
            {firstUserGroup?.student?.map((student, index) => (
              <div
                key={student.userId}
                className="flex items-center gap-2 py-2 text-md"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {`${index + 1}`}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{student.user.name}</span>
                  <span className="text-muted-foreground">
                    {student.user.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {isArray && (
        <div>
          {dataList.map((userGroup, index) => (
            <div
              key={userGroup.id || userGroup.groupName}
              className="flex items-center gap-2 py-2 text-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${index + 1}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{userGroup.groupName}</span>
                <span className="text-muted-foreground">{`${userGroup?.classrooms?.course?.courseCode}-${userGroup?.classrooms?.course?.courseName}-${userGroup?.classrooms?.classroomName}`}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          {isArray
            ? `This will permanently delete ${dataList.length} user groups and all associated data.`
            : "This will permanently delete this user group and all associated data."}
        </p>
      </div>
      <div className="w-full px-4 absolute bottom-17 right-0">
        <Button
          type="submit"
          className="w-full"
          disabled={status === "pending"}
          variant="destructive"
        >
          {status === "pending"
            ? "Deleting..."
            : isArray
              ? "Delete Selected User Groups"
              : "Delete User Group"}
        </Button>
      </div>
    </form>
  );
}
