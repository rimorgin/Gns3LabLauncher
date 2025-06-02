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
          <AlertDialogTitle>Oops! Something went wrong...</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired because you have logged in to another device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => {
            invalidateUser()
            onOpenChange(!isOpen)
            }}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
