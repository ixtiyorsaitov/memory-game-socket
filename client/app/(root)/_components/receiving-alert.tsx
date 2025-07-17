import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { IUser } from "@/types";
import React, { FC } from "react";

const ReceivingAlert: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser | null;
}> = ({ open, setOpen, user }) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="font-bold">{user?.name}</span> Wants to Play
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click to accept or decline the invite from
            <span className="font-bold">{user?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Decline</AlertDialogCancel>
          <AlertDialogAction>Accept</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReceivingAlert;
