import React, { cloneElement, forwardRef, ReactElement, ReactNode, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './button'

interface ConfirmDialogProps {
    children: ReactElement;
    confirmAction: () => void;
}

const ConfirmDialog = forwardRef<HTMLButtonElement, ConfirmDialogProps>(({ children, confirmAction }, ref) => {
    const [isOpen, setIsOpen] = useState(false);


    const handleConfirm = () => {
        confirmAction();
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen}>
            <DialogTrigger ref={ref}>
                {cloneElement(children, { onClick: () => setIsOpen(true) })}
                {/* {children} */}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleConfirm}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
})

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog
