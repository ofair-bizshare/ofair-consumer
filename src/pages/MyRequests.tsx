import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import RequestDialog from '@/components/dashboard/RequestDialog';
import { useToast } from '@/hooks/use-toast';
import { fetchUserRequests, updateRequestStatus, deleteRequest } from '@/services/requests';
import { useAuth } from '@/providers/AuthProvider';
import { RequestInterface } from '@/types/dashboard';
import { countQuotesForRequest } from '@/services/quotes';

const MyRequests = () => {
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requests, setRequests] = useState<RequestInterface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
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
    
    loadRequests();
  }, [user, navigate, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">פעילה</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">הושלמה</Badge>;
      case 'expired':
        return <Badge className="bg-amber-500">פגה תוקף</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">בוטלה</Badge>;
      default:
        return <Badge>לא ידוע</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'canceled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
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

  if (!user) {
    return null; // Will redirect to login
  }

  const activeRequests = requests.filter(req => req.status === 'active');
  const completedRequests = requests.filter(req => req.status === 'completed');
  const expiredOrCanceledRequests = requests.filter(req => ['expired', 'canceled'].includes(req.status));

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
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="w-full max-w-md mb-6">
              <TabsTrigger value="active" className="flex-1 data-[state=active]:bg-green-50 data-[state=active]:text-green-700">
                פניות פעילות ({activeRequests.length})
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                פניות שהושלמו ({completedRequests.length})
              </TabsTrigger>
              <TabsTrigger value="expired" className="flex-1 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                פניות שפגו/בוטלו ({expiredOrCanceledRequests.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="mt-0">
              {activeRequests.length > 0 ? (
                <div className="space-y-4">
                  {activeRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="border-r-4 border-green-500 h-full">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
                            <div className="md:col-span-3">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(request.status)}
                                <h3 className="text-xl font-medium mr-2">{request.title}</h3>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                              <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1 mt-2">
                                <span>תאריך: {request.date}</span>
                                <span>מיקום: {request.location}</span>
                                <span>הצעות מחיר: {request.quotesCount}</span>
                              </div>
                            </div>
                            <div className="md:col-span-2 flex flex-wrap items-center justify-start md:justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                onClick={() => handleViewRequest(request.id)}
                              >
                                <ExternalLink className="h-4 w-4 ml-1" />
                                פרטים מלאים
                              </Button>
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleCancelRequest(request.id)}
                              >
                                <X className="h-4 w-4 ml-1" />
                                ביטול
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <p className="text-lg text-gray-600 mb-4">אין לך כרגע פניות פעילות</p>
                  <Button 
                    className="bg-[#00D09E] hover:bg-[#00C090] text-white"
                    onClick={() => setIsRequestDialogOpen(true)}
                  >
                    צור פנייה חדשה
                  </Button>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {completedRequests.length > 0 ? (
                <div className="space-y-4">
                  {completedRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className="border-r-4 border-blue-500 h-full">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
                            <div className="md:col-span-3">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(request.status)}
                                <h3 className="text-xl font-medium mr-2">{request.title}</h3>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                              <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1 mt-2">
                                <span>תאריך: {request.date}</span>
                                <span>מיקום: {request.location}</span>
                                <span>הצעות מחיר: {request.quotesCount}</span>
                              </div>
                            </div>
                            <div className="md:col-span-2 flex flex-wrap items-center justify-start md:justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                onClick={() => handleViewRequest(request.id)}
                              >
                                <ExternalLink className="h-4 w-4 ml-1" />
                                פרטים מלאים
                              </Button>
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <X className="h-4 w-4 ml-1" />
                                מחיקה
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <p className="text-lg text-gray-600">אין לך כרגע פניות שהושלמו</p>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="expired" className="mt-0">
              {expiredOrCanceledRequests.length > 0 ? (
                <div className="space-y-4">
                  {expiredOrCanceledRequests.map((request) => (
                    <Card key={request.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      <div className={`border-r-4 ${request.status === 'expired' ? 'border-amber-500' : 'border-red-500'} h-full`}>
                        <CardContent className="p-0">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-6">
                            <div className="md:col-span-3">
                              <div className="flex items-center mb-3">
                                {getStatusIcon(request.status)}
                                <h3 className="text-xl font-medium mr-2">{request.title}</h3>
                                {getStatusBadge(request.status)}
                              </div>
                              <p className="text-gray-600 mb-2 line-clamp-2">{request.description}</p>
                              <div className="flex flex-wrap text-sm text-gray-500 gap-x-4 gap-y-1 mt-2">
                                <span>תאריך: {request.date}</span>
                                <span>מיקום: {request.location}</span>
                                <span>הצעות מחיר: {request.quotesCount}</span>
                              </div>
                            </div>
                            <div className="md:col-span-2 flex flex-wrap items-center justify-start md:justify-end gap-2">
                              <Button 
                                variant="outline" 
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                                onClick={() => handleViewRequest(request.id)}
                              >
                                <ExternalLink className="h-4 w-4 ml-1" />
                                פרטים מלאים
                              </Button>
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-300 hover:bg-red-50"
                                onClick={() => handleDeleteRequest(request.id)}
                              >
                                <X className="h-4 w-4 ml-1" />
                                מחיקה
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center bg-gray-50">
                  <p className="text-lg text-gray-600">אין לך כרגע פניות שפגו או בוטלו</p>
                </Card>
              )}
            </TabsContent>
          </Tabs>
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
