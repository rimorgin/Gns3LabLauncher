import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@clnt/components/ui/alert-dialog";
import { useLogout } from "@clnt/lib/auth";

type SessionExpiredAlertProps = {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function SessionKickedAlert({
  isOpen = false,
  onOpenChange = () => {},
}: SessionExpiredAlertProps) {
  const logoutUser = useLogout();
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oops! Something went wrong...</AlertDialogTitle>
          <AlertDialogDescription>
            Your session has expired because you have logged in to another
            device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={async () => {
              await logoutUser.mutateAsync({});
              onOpenChange(!isOpen);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
