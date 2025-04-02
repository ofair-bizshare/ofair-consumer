import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, X, ExternalLink } from 'lucide-react';
import RequestDialog from '@/components/dashboard/RequestDialog';
import { useToast } from '@/hooks/use-toast';

type RequestStatus = 'active' | 'complete' | 'expired' | 'canceled';

interface Request {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: RequestStatus;
  quotesCount: number;
}

const MyRequests = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    
    if (!hasSession) {
      navigate('/login');
      return;
    }
    
    const savedRequests = localStorage.getItem('myRequests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    } else {
      const sampleRequests: Request[] = [
        {
          id: "1001",
          title: "שיפוץ אמבטיה",
          description: "שיפוץ חדר אמבטיה כולל החלפת אסלה, כיור וריצוף",
          date: "01/05/2023",
          location: "תל אביב",
          status: "active",
          quotesCount: 3
        },
        {
          id: "1002",
          title: "התקנת מזגן",
          description: "התקנת מזגן עילי בחדר שינה",
          date: "15/04/2023",
          location: "רמת גן",
          status: "complete",
          quotesCount: 4
        },
        {
          id: "1003",
          title: "עבודות חשמל",
          description: "החלפת לוח חשמל ישן והוספת נקודות חשמל",
          date: "10/03/2023",
          location: "ירושלים",
          status: "expired",
          quotesCount: 0
        }
      ];
      setRequests(sampleRequests);
      localStorage.setItem('myRequests', JSON.stringify(sampleRequests));
    }
  }, [navigate]);

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">פעילה</Badge>;
      case 'complete':
        return <Badge className="bg-blue-500">הושלמה</Badge>;
      case 'expired':
        return <Badge className="bg-amber-500">פגה תוקף</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">בוטלה</Badge>;
      default:
        return <Badge>לא ידוע</Badge>;
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'active':
        return <Clock className="h-5 w-5 text-green-500" />;
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'canceled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const handleCancelRequest = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך לבטל את הבקשה?')) {
      const updatedRequests = requests.map(req => 
        req.id === id ? {...req, status: 'canceled' as RequestStatus} : req
      );
      
      setRequests(updatedRequests);
      localStorage.setItem('myRequests', JSON.stringify(updatedRequests));
      
      toast({
        title: "הבקשה בוטלה",
        description: "הבקשה בוטלה בהצלחה",
      });
    }
  };

  const handleDeleteRequest = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הבקשה לצמיתות?')) {
      const updatedRequests = requests.filter(req => req.id !== id);
      
      setRequests(updatedRequests);
      localStorage.setItem('myRequests', JSON.stringify(updatedRequests));
      
      toast({
        title: "הבקשה נמחקה",
        description: "הבקשה נמחקה בהצלחה",
      });
    }
  };

  const handleViewRequest = (id: string) => {
    navigate(`/dashboard/request/${id}`);
  };

  if (!isLoggedIn) {
    return null;
  }

  const activeRequests = requests.filter(req => req.status === 'active');
  const completedRequests = requests.filter(req => req.status === 'complete');
  const expiredOrCanceledRequests = requests.filter(req => ['expired', 'canceled'].includes(req.status));

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-blue-700 mb-2">
                <span className="text-[#00D09E]">הפניות המקצועיות</span> שלי
              </h1>
              <p className="text-gray-600">
                צפה ונהל את כל הפניות המקצועיות שיצרת לבעלי מקצוע
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
      
      <RequestDialog 
        isOpen={isRequestDialogOpen} 
        onOpenChange={setIsRequestDialogOpen}
      />
    </div>
  );
};

export default MyRequests;
