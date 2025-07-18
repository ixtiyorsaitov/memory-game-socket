"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IUser } from "@/types";
import React, { FC, useEffect } from "react";

const ReceivingAlert: FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  user: IUser | null;
  onResponseToInvite: (response: boolean) => void;
}> = ({ open, setOpen, user, onResponseToInvite }) => {
  useEffect(() => {
    if (open) {
      const audio = new Audio("/sounds/invite-sound.mp3");
      audio.play().catch((err) => console.log("Audio error:", err));
    }
  }, [open]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <span className="font-bold">{user?.name}</span> Wants to Play
          </AlertDialogTitle>
          <AlertDialogDescription>
            Click to accept or decline the invite from{" "}
            <span className="font-bold">{user?.name}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onResponseToInvite(false)}>
            Decline
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onResponseToInvite(true)}>
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReceivingAlert;
