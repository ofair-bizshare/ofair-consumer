
import { useState, useEffect, useCallback } from 'react';
import { fetchUserRequests } from '@/services/requests';
import { countQuotesForRequest } from '@/services/quotes';
import { RequestInterface } from '@/types/dashboard';
import { useAuth } from '@/providers/AuthProvider';

export const useRequests = () => {
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      const userRequests = await fetchUserRequests();
      
      // Fetch quotes count for each request
      const requestsWithQuotesCount = await Promise.all(
        userRequests.map(async (request) => {
          try {
            const quotesCount = await countQuotesForRequest(request.id);
            return { ...request, quotesCount };
          } catch (error) {
            console.error(`Error fetching quotes count for request ${request.id}:`, error);
            return { ...request, quotesCount: 0 };
          }
        })
      );
      
      setRequests(requestsWithQuotesCount);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user, fetchRequests]);
  
  // Refresh function
  const refreshRequests = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  return { 
    requests, 
    isLoading,
    refreshRequests
  };
};
