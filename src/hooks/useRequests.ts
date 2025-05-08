
import { useState, useEffect, useCallback } from 'react';
import { fetchUserRequests } from '@/services/requests';
import { countQuotesForRequest } from '@/services/quotes/quoteFetching';
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
      
      // Sort requests - active first, then waiting_for_rating, then completed/expired/canceled
      const sortedRequests = requestsWithQuotesCount.sort((a, b) => {
        // Priority order: active > waiting_for_rating > other statuses
        const statusPriority: Record<string, number> = {
          'active': 3,
          'waiting_for_rating': 2,
          'completed': 0, // Lower priority for completed requests (will appear at the bottom)
          'expired': 0,
          'canceled': 0
        };
        
        const priorityA = statusPriority[a.status] || 0;
        const priorityB = statusPriority[b.status] || 0;
        
        // Compare by priority, then by date (newest first)
        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }
        
        // For same status, sort by date (newest first)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA;
      });
      
      setRequests(sortedRequests);
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
