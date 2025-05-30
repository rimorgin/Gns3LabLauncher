import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@clnt/components/ui/alert-dialog";
import { useUserStore } from "@clnt/lib/store/user-store";

type SessionExpiredAlertProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SessionExpiredAlert({
  isOpen = false,
  onOpenChange = () => {},
}: SessionExpiredAlertProps) {
  const { invalidateUser } = useUserStore();
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Session Expired</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired. Please sign in again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            invalidateUser()
            }}>
            Sign In
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
