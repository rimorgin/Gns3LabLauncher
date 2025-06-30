import { ReactNode } from "react";
import { useMediaQuery } from "@clnt/hooks/use-media-query";
import { Button } from "@clnt/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@clnt/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@clnt/components/ui/drawer";

type DrawerDialogProps = {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
  title?: string | ReactNode;
  description?: string;
  button?: ReactNode;
  renderHeaderContent?: ReactNode;
} & (
  | { buttonText: string; button?: never }
  | { buttonText?: never; button: ReactNode }
);

export function ResponsiveDrawerDialog(props: DrawerDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const triggerButton = props.button ? (
    props.button
  ) : (
    <Button variant="outline">{props.buttonText}</Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={props.open} onOpenChange={props.onOpenChange}>
        <DialogTrigger asChild>{triggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{props.title}</DialogTitle>
            {props.renderHeaderContent}
            <DialogDescription>{props.description}</DialogDescription>
          </DialogHeader>
          {props.children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={props.open} onOpenChange={props.onOpenChange}>
      <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{props.title}</DrawerTitle>
          {props.renderHeaderContent}
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>
        {props.children}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

/* function ProfileForm({ className }: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
 */
