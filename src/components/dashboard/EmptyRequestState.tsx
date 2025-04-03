
import React from 'react';
import { MessageSquare } from 'lucide-react';
import RequestDialog from './RequestDialog';

interface EmptyRequestStateProps {
  isLoading: boolean;
  hasRequests: boolean;
  isRequestDialogOpen: boolean;
  setIsRequestDialogOpen: (open: boolean) => void;
}

const EmptyRequestState: React.FC<EmptyRequestStateProps> = ({
  isLoading,
  hasRequests,
  isRequestDialogOpen,
  setIsRequestDialogOpen
}) => {
  return (
    <div className="glass-card flex flex-col items-center justify-center text-center p-10">
      <MessageSquare className="h-12 w-12 text-blue-200 mb-4" />
      <h3 className="text-xl font-semibold text-blue-700 mb-2">
        {isLoading 
          ? "טוען בקשות..." 
          : hasRequests 
            ? "בחר בקשה לצפייה" 
            : "אין לך בקשות עדיין"}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {isLoading 
          ? "אנא המתן בזמן שאנו טוענים את הבקשות שלך" 
          : hasRequests 
            ? "בחר אחת מהבקשות מהרשימה משמאל כדי לצפות בפרטים ובהצעות המחיר שהתקבלו" 
            : "שלח את בקשתך הראשונה ובעלי מקצוע ישלחו לך הצעות מחיר"}
      </p>
      <RequestDialog 
        isOpen={isRequestDialogOpen} 
        onOpenChange={setIsRequestDialogOpen} 
        triggerClassName="bg-[#00d09e] hover:bg-[#00C090]"
        triggerLabel="שלח בקשה חדשה"
      />
    </div>
  );
};

export default EmptyRequestState;
