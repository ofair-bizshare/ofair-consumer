
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileQuestion, MousePointerClick, PlusCircle } from 'lucide-react';

interface EmptyRequestStateProps {
  isLoading: boolean;
  hasRequests: boolean;
  isRequestDialogOpen: boolean;
  setIsRequestDialogOpen: (open: boolean) => void;
}

const EmptyRequestState = ({ 
  isLoading, 
  hasRequests, 
  isRequestDialogOpen, 
  setIsRequestDialogOpen 
}: EmptyRequestStateProps) => {
  if (isLoading) {
    return (
      <div className="glass-card flex items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
      </div>
    );
  }

  if (!hasRequests) {
    return (
      <div className="glass-card text-center p-10">
        <FileQuestion className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-3">אין לך בקשות עדיין</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          שלח בקשה חדשה לקבלת הצעות מחיר מבעלי מקצוע באזורך
        </p>
        <Button 
          className="bg-[#00D09E] hover:bg-[#00C090] mb-4"
          onClick={() => setIsRequestDialogOpen(true)}
        >
          <PlusCircle className="ml-2 h-4 w-4" />
          צור בקשה חדשה
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card text-center p-10">
      <MousePointerClick className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-700 mb-3">בחר בקשה מהרשימה</h3>
      <p className="text-gray-500 mb-6">
        בחר בקשה מהרשימה כדי לצפות בפרטים ובהצעות המחיר
      </p>
    </div>
  );
};

export default EmptyRequestState;
