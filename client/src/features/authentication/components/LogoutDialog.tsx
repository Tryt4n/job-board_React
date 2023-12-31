import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type LogoutDialogPropsType = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function LogoutDialog({ isOpen, onOpenChange }: LogoutDialogPropsType) {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logging Out</DialogTitle>
        </DialogHeader>
        <LoadingSpinner className="w-12 h-12" />
      </DialogContent>
    </Dialog>
  );
}
