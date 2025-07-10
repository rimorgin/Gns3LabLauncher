import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { useUserDelete } from "@clnt/lib/mutations/user/user-delete-mutation";
import { UserDbData } from "@clnt/lib/validators/user-schema";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@clnt/components/ui/avatar";
import { useQuickDrawerStore } from "@clnt/lib/store/quick-drawer-store";

interface UserDeleteProps {
  initialData: Partial<UserDbData> | Array<Partial<UserDbData>>;
}

export function UserDeleteForm({ initialData }: UserDeleteProps) {
  const toggleQuickDrawer = useQuickDrawerStore(
    (state) => state.toggleQuickDrawer,
  );
  const { mutateAsync, status } = useUserDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
  console.log("🚀 ~ UserDeleteForm ~ dataList:", dataList);
  const firstUser = dataList[0]; // Used for showing name/email/username

  const onDelete = async () => {
    const ids = dataList.map((user) => user.id).filter(Boolean) as string[];

    if (ids.length === 0) {
      toast.error("No users selected for deletion.");
      return;
    }

    toast.promise(mutateAsync(ids), {
      loading: ids.length > 1 ? "Deleting users..." : "Deleting user...",
      success: () => {
        toggleQuickDrawer();
        return ids.length > 1 ? "Users deleted." : "User deleted.";
      },
      error: (err) =>
        err?.response?.data?.message || "Failed to delete user(s)",
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
            <Input disabled value={firstUser?.name || ""} />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <Input disabled value={firstUser?.email || ""} type="email" />
          </div>

          <div>
            <label className="block text-sm font-medium">Username</label>
            <Input disabled value={firstUser?.username || ""} />
          </div>
        </>
      )}

      {isArray && (
        <div>
          {dataList.map((user, index) => (
            <div
              key={user.id || user.email}
              className="flex items-center gap-2 py-2 text-md"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {`${index + 1}`}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-800">
          {isArray
            ? `This will permanently delete ${dataList.length} users and all associated data.`
            : "This will permanently delete this user and all associated data."}
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
              ? "Delete Selected Users"
              : "Delete User"}
        </Button>
      </div>
    </form>
  );
}
