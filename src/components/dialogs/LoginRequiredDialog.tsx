
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';

interface LoginRequiredDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onGoToLogin: () => void;
}

const LoginRequiredDialog: React.FC<LoginRequiredDialogProps> = ({
  isOpen,
  onOpenChange,
  onGoToLogin
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <DialogTitle>התחברות נדרשת</DialogTitle>
          <DialogDescription>
            עליך להתחבר כדי לראות את מספר הטלפון של בעל המקצוע
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            ההתחברות מאפשרת לנו לעקוב אחרי ההפניות שלך ולשפר את חווית השימוש באפליקציה
          </p>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto"
          >
            בטל
          </Button>
          <Button 
            onClick={onGoToLogin} 
            className="w-full sm:w-auto bg-[#00D09E] hover:bg-[#00C090]"
          >
            עבור לדף ההתחברות
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LoginRequiredDialog;
