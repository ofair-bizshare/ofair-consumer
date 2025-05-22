
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import RequestDialog from './RequestDialog';
import RequestsList from './RequestsList';

interface RequestsSidebarProps {
  isLoading: boolean;
  requests: any[];
  filteredRequests: any[];
  isRequestDialogOpen: boolean;
  setIsRequestDialogOpen: (open: boolean) => void;
  onCreateRequest: () => void;
  onSelectRequest: (id: string) => Promise<void>;
  selectedRequestId: string | null;
  handleRefresh: () => Promise<void>; // FIX: Was () => void, must match actual function & usages!
}

const RequestsSidebar: React.FC<RequestsSidebarProps> = ({
  isLoading,
  filteredRequests,
  isRequestDialogOpen,
  setIsRequestDialogOpen,
  onCreateRequest,
  onSelectRequest,
  selectedRequestId,
  handleRefresh,
}) => {
  return (
    <div className="w-full lg:w-1/3">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-blue-700">הבקשות שלי</h2>
        <Button onClick={onCreateRequest} className="bg-[#00D09E] hover:bg-[#00C090] text-white flex items-center gap-1 rounded">
          <PlusCircle size={16} />
          בקשה חדשה
        </Button>
        <RequestDialog isOpen={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen} onRequestCreated={handleRefresh} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
        </div>
      ) : (
        <RequestsList
          requests={filteredRequests}
          onSelect={onSelectRequest}
          selectedRequestId={selectedRequestId}
        />
      )}
    </div>
  );
};

export default RequestsSidebar;
