import * as React from "react";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ConfirmDeleteDialog({
    disabled = false,
    title,
    description,
    trigger,
    onConfirm,
    confirmText = "Deactivate",
    cancelText = "Cancel",
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {React.cloneElement(trigger, { disabled })}
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onConfirm}
                        className={cn(buttonVariants({ variant: "destructive" }))}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
