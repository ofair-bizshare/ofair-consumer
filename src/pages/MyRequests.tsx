import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import RequestDialog from '@/components/dashboard/RequestDialog';
import { useMyRequests } from '@/hooks/useMyRequests';
import RequestsTabContent from '@/components/requests/RequestsTabContent';

const MyRequests = () => {
  const { 
    requests, 
    isLoading, 
    isRequestDialogOpen, 
    setIsRequestDialogOpen,
    handleCancelRequest,
    handleDeleteRequest,
    handleViewRequest
  } = useMyRequests();

  // Filter requests by status - UPDATED LOGIC
  const activeRequests = requests.filter(req => req.status === 'active');
  const waitingForRatingRequests = requests.filter(req => req.status === 'waiting_for_rating');
  const completedRequests = requests.filter(req => req.status === 'completed');
  const expiredOrCanceledRequests = requests.filter(req => 
    req.status === 'expired' || req.status === 'canceled'
  );

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">
                <span className="text-[#00D09E]">הפניות</span> שלי
              </h1>
              <p className="text-gray-600">
                צפה ונהל את כל הפניות שיצרת לבעלי מקצוע
              </p>
            </div>
            <Button 
              className="bg-[#00D09E] hover:bg-[#00C090] text-white"
              onClick={() => setIsRequestDialogOpen(true)}
            >
              פנייה חדשה +
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
            </div>
          ) : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="w-full max-w-md mb-6">
                <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                  פעילות ({activeRequests.length})
                </TabsTrigger>
                <TabsTrigger value="waiting" className="flex-1 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                  ממתינות לדירוג ({waitingForRatingRequests.length})
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                  הושלמו ({completedRequests.length})
                </TabsTrigger>
                <TabsTrigger value="expired" className="flex-1 data-[state=active]:bg-gray-50 data-[state=active]:text-gray-700">
                  בוטלו/פגו ({expiredOrCanceledRequests.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="active" className="mt-0">
                {/* Only show active requests */}
                <RequestsTabContent 
                  requests={activeRequests} 
                  onViewRequest={handleViewRequest}
                  onCancelRequest={handleCancelRequest}
                  onCreateRequest={() => setIsRequestDialogOpen(true)}
                  emptyText="אין לך כרגע פניות פעילות"
                />
              </TabsContent>
              
              <TabsContent value="waiting" className="mt-0">
                {/* Only show waiting for rating requests */}
                <RequestsTabContent 
                  requests={waitingForRatingRequests} 
                  onViewRequest={handleViewRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onCreateRequest={() => setIsRequestDialogOpen(true)}
                  emptyText="אין לך כרגע פניות ממתינות לדירוג"
                />
              </TabsContent>
              
              <TabsContent value="completed" className="mt-0">
                <RequestsTabContent 
                  requests={completedRequests} 
                  onViewRequest={handleViewRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onCreateRequest={() => setIsRequestDialogOpen(true)}
                  emptyText="אין לך כרגע פניות שהושלמו"
                />
              </TabsContent>
              
              <TabsContent value="expired" className="mt-0">
                <RequestsTabContent 
                  requests={expiredOrCanceledRequests} 
                  onViewRequest={handleViewRequest}
                  onDeleteRequest={handleDeleteRequest}
                  onCreateRequest={() => setIsRequestDialogOpen(true)}
                  emptyText="אין לך כרגע פניות שפגו או בוטלו"
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      
      <Footer />
      
      {/* Request Dialog */}
      <RequestDialog 
        isOpen={isRequestDialogOpen} 
        onOpenChange={setIsRequestDialogOpen}
      />
    </div>
  );
};

export default MyRequests;
