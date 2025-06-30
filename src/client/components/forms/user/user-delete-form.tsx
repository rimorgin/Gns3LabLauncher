import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { useUserDelete } from "@clnt/lib/mutations/user/user-delete-mutation";
import { UserDbData } from "@clnt/lib/validators/user-schema";
import { toast } from "sonner";

interface UserDeleteProps {
  initialData: Partial<UserDbData> | Array<Partial<UserDbData>>;
}

export function UserDeleteForm({ initialData }: UserDeleteProps) {
  const { toggleQuickEditDrawer } = useAppStateStore();
  const { mutateAsync, status } = useUserDelete();

  const isArray = Array.isArray(initialData);
  const dataList = isArray ? initialData : [initialData];
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
        toggleQuickEditDrawer();
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
      {!isArray && (
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
        <div className="text-sm text-muted-foreground">
          You are about to delete <strong>{dataList.length}</strong> users.
        </div>
      )}

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
