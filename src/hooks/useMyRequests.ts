
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/providers/AuthProvider';
import { fetchUserRequests, updateRequestStatus, deleteRequest } from '@/services/requests';
import { RequestInterface } from '@/types/dashboard';
import { countQuotesForRequest } from '@/services/quotes';

export const useMyRequests = () => {
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    loadRequests();
  }, [user, navigate, toast]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      // Fetch requests from the database
      const data = await fetchUserRequests();
      
      // For each request, fetch the quotes count
      const requestsWithCounts = await Promise.all(
        data.map(async request => {
          const count = await countQuotesForRequest(request.id);
          return {
            ...request,
            quotesCount: count
          };
        })
      );
      
      setRequests(requestsWithCounts);
    } catch (error) {
      console.error('Error loading requests:', error);
      toast({
        title: "שגיאה בטעינת הבקשות",
        description: "אירעה שגיאה בטעינת הבקשות. אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את הבקשה?')) {
      // Update status in the database
      const success = await updateRequestStatus(id, 'canceled');
      
      if (!success) {
        toast({
          title: "שגיאה בביטול הבקשה",
          description: "אירעה שגיאה בביטול הבקשה. אנא נסה שוב.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      const updatedRequests = requests.map(req => 
        req.id === id ? {...req, status: 'canceled'} : req
      );
      
      setRequests(updatedRequests);
      
      toast({
        title: "הבקשה בוטלה",
        description: "הבקשה בוטלה בהצלחה",
      });
    }
  };

  const handleDeleteRequest = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הבקשה לצמיתות?')) {
      // Delete from the database
      const success = await deleteRequest(id);
      
      if (!success) {
        toast({
          title: "שגיאה במחיקת הבקשה",
          description: "אירעה שגיאה במחיקת הבקשה. אנא נסה שוב.",
          variant: "destructive"
        });
        return;
      }
      
      // Update local state
      const updatedRequests = requests.filter(req => req.id !== id);
      setRequests(updatedRequests);
      
      toast({
        title: "הבקשה נמחקה",
        description: "הבקשה נמחקה בהצלחה",
      });
    }
  };

  const handleViewRequest = (id: string) => {
    navigate(`/dashboard/request/${id}`);
  };

  return {
    requests,
    isLoading,
    isRequestDialogOpen,
    setIsRequestDialogOpen,
    handleCancelRequest,
    handleDeleteRequest,
    handleViewRequest
  };
};
