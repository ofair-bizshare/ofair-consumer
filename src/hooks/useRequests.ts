
import { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { fetchUserRequests } from '@/services/requests';
import { RequestInterface } from '@/types/dashboard';

export const useRequests = () => {
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching requests for user:", user.id);
        
        // Fetch requests from the database
        const userRequests = await fetchUserRequests();
        setRequests(userRequests);
      } catch (error) {
        console.error("Error loading requests:", error);
        toast({
          title: "שגיאה בטעינת הבקשות",
          description: "לא ניתן לטעון את הבקשות שלך כרגע. נסה שוב מאוחר יותר.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  return { requests, setRequests, isLoading };
};
