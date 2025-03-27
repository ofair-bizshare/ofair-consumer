import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProfessionalCard from '@/components/ProfessionalCard';
import { Clock, CheckCircle, AlertCircle, Star, MessageSquare, Eye, ArrowRight, Send } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreditCard from '@/components/dashboard/CreditCard';
import RequestForm from '@/components/RequestForm';

const requests = [
  {
    id: '1',
    title: 'תיקון מזגן',
    description: 'המזגן לא מקרר, רועש ונדרש תיקון בהקדם',
    date: '15.05.2023',
    location: 'תל אביב והמרכז',
    status: 'active',
    quotesCount: 3,
  },
  {
    id: '2',
    title: 'שיפוץ מטבח',
    description: 'החלפת ארונות מטבח, חיפוי קירות ושיש',
    date: '10.04.2023',
    location: 'ירושלים והסביבה',
    status: 'completed',
    quotesCount: 5,
  },
  {
    id: '3',
    title: 'צביעת דירה',
    description: 'צביעה של דירת 4 חדרים, כולל תקרות וקירות',
    date: '02.03.2023',
    location: 'השרון',
    status: 'active',
    quotesCount: 0,
  },
];

const quotes = [
  {
    id: '1',
    requestId: '1',
    professional: {
      id: '1',
      name: 'אבי כהן',
      profession: 'טכנאי מזגנים',
      rating: 4.8,
      reviewCount: 124,
      location: 'תל אביב והמרכז',
      image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
      verified: true,
      specialties: ['תיקוני מזגנים', 'התקנות מזגנים', 'ניקוי מזגנים'],
    },
    price: '450',
    estimatedTime: 'יום אחד',
    description: 'אבדוק את המזגן, אבצע ניקוי יסודי ואתקן את התקלה. כולל אחריות של 3 חודשים על התיקון.',
    status: 'pending',
  },
  {
    id: '2',
    requestId: '1',
    professional: {
      id: '2',
      name: 'יוסי לוי',
      profession: 'טכנאי מזגנים',
      rating: 4.6,
      reviewCount: 87,
      location: 'תל אביב והמרכז',
      image: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2122&q=80',
      verified: true,
      specialties: ['תיקוני מזגנים', 'התקנות מזגנים'],
    },
    price: '350',
    estimatedTime: '2-3 שעות',
    description: 'בדיקה וטיפול בתקלה באותו יום. עלות כוללת חלקים במידת הצורך.',
    status: 'pending',
  },
  {
    id: '3',
    requestId: '1',
    professional: {
      id: '3',
      name: 'דני שטרן',
      profession: 'טכנאי מיזוג אוויר',
      rating: 4.9,
      reviewCount: 112,
      location: 'רמת גן',
      image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      verified: false,
      specialties: ['תיקון מזגנים', 'מזגנים מרכזיים'],
    },
    price: '500',
    estimatedTime: 'יומיים',
    description: 'בדיקה מקיפה של המזגן, טיפול בתקלה ושדרוג המערכת במידת הצורך. אחריות של 6 חודשים.',
    status: 'pending',
  },
];

interface RequestCardProps {
  request: any;
  onSelect: (id: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ request, onSelect }) => {
  const getStatusIcon = () => {
    switch (request.status) {
      case 'active':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-teal-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (request.status) {
      case 'active':
        return 'פעיל';
      case 'completed':
        return 'הושלם';
      default:
        return 'ממתין';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="text-lg font-semibold">{request.title}</h3>
              <p className="text-gray-500 text-sm">{request.date}</p>
            </div>
            <div className="flex items-center text-sm">
              {getStatusIcon()}
              <span className="mr-1">{getStatusText()}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3 line-clamp-2">
            {request.description}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {request.location}
            </div>
            
            <div className="flex items-center text-sm">
              {request.quotesCount > 0 ? (
                <>
                  <span className="text-blue-700 font-medium">{request.quotesCount}</span>
                  <span className="text-gray-500 mr-1">הצעות מחיר</span>
                </>
              ) : (
                <span className="text-gray-500">אין הצעות עדיין</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 p-3 bg-gray-50 flex justify-end">
          <Button 
            onClick={() => onSelect(request.id)}
            variant="ghost" 
            className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-sm"
          >
            הצג פרטים
            <ArrowRight size={16} className="mr-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

interface QuoteCardProps {
  quote: any;
  onAccept: (quoteId: string) => void;
  onReject: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ quote, onAccept, onReject, onViewProfile }) => {
  return (
    <Card className="overflow-hidden mb-8">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{quote.professional.name}</h3>
              <p className="text-gray-500 text-sm">{quote.professional.profession}</p>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium">{quote.professional.rating}</span>
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-gray-500">({quote.professional.reviewCount})</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">מחיר מוצע</p>
              <p className="font-semibold text-blue-700">{quote.price} ₪</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">זמן משוער</p>
              <p className="font-semibold">{quote.estimatedTime}</p>
            </div>
          </div>
          
          <div className="mb-3">
            <p className="text-gray-700">
              {quote.description}
            </p>
          </div>
        </div>
        
        <div className="p-4 flex flex-wrap justify-between items-center gap-2 bg-gray-50">
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              size="sm"
              className="space-x-1 space-x-reverse border-gray-300"
            >
              <MessageSquare size={16} />
              <span>שלח הודעה</span>
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="space-x-1 space-x-reverse border-gray-300"
                >
                  <Eye size={16} />
                  <span>צפה בפרופיל</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">פרופיל בעל מקצוע</DialogTitle>
                  <DialogDescription>
                    מידע מפורט על בעל המקצוע
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <iframe 
                    src={`/professional/${quote.professional.id}`} 
                    className="w-full h-[70vh] border-none"
                    title={`פרופיל של ${quote.professional.name}`}
                  />
                </div>
                <div className="flex justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">סגור</Button>
                  </DialogClose>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onViewProfile(quote.professional.id)}
                  >
                    פתח בעמוד מלא
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-500 text-red-500 hover:bg-red-50"
              onClick={() => onReject(quote.id)}
            >
              דחה הצעה
            </Button>
            
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => onAccept(quote.id)}
            >
              קבל הצעה
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [quotesData, setQuotesData] = useState(quotes);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();
  const selectedRequestRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
  }, []);
  
  const selectedRequest = requests.find(r => r.id === selectedRequestId);
  const requestQuotes = quotesData.filter(q => q.requestId === selectedRequestId);

  useEffect(() => {
    if (selectedRequestId && selectedRequestRef.current) {
      setTimeout(() => {
        selectedRequestRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedRequestId]);

  const handleAcceptQuote = (quoteId: string) => {
    setQuotesData(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'accepted' } 
          : quote.requestId === quotesData.find(q => q.id === quoteId)?.requestId
            ? { ...quote, status: 'rejected' }
            : quote
      )
    );
    
    toast({
      title: "הצעה התקבלה",
      description: "הודעה נשלחה לבעל המקצוע. הוא יצור איתך קשר בהקדם.",
      variant: "default",
    });
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotesData(prevQuotes => 
      prevQuotes.map(quote => 
        quote.id === quoteId 
          ? { ...quote, status: 'rejected' } 
          : quote
      )
    );
    
    toast({
      title: "הצעה נדחתה",
      description: "הודעה נשלחה לבעל המקצוע.",
      variant: "default",
    });
  };

  const handleViewProfile = (professionalId: string) => {
    window.open(`/professional/${professionalId}`, '_blank');
  };

  const getReferrals = () => {
    const storedReferrals = localStorage.getItem('myReferrals');
    if (storedReferrals) {
      try {
        return JSON.parse(storedReferrals);
      } catch (error) {
        console.error('Error parsing referrals:', error);
        return [];
      }
    }
    return [];
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">האזור</span> האישי שלי
            </h1>
            <p className="text-gray-600">
              צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת והסטטוס שלהן
            </p>
          </div>
          
          <Tabs defaultValue="requests" className="mb-8">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="requests" className="flex-1">הבקשות והצעות שלי</TabsTrigger>
              <TabsTrigger value="referrals" className="flex-1">
                <Link to="/referrals" className="w-full h-full flex items-center justify-center">
                  ההפניות שלי
                </Link>
              </TabsTrigger>
              {isLoggedIn && <TabsTrigger value="credits" className="flex-1">הקרדיט שלי</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="requests">
              <div className="flex flex-col-reverse lg:flex-row gap-8">
                <div className="w-full lg:w-1/3">
                  <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-blue-700">הבקשות שלי</h2>
                    
                    <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="text-white bg-[#00D09E] hover:bg-[#00C090] text-sm font-medium">
                          בקשה חדשה +
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">יצירת בקשה חדשה</DialogTitle>
                          <DialogDescription>
                            מלא את הפרטים כדי ליצור בקשה חדשה לבעלי מקצוע
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <RequestForm />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <div className="space-y-4">
                    {requests.map(request => (
                      <RequestCard 
                        key={request.id} 
                        request={request} 
                        onSelect={setSelectedRequestId}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="w-full lg:w-2/3" ref={selectedRequestRef}>
                  {selectedRequest ? (
                    <div className="space-y-6 animate-fade-in">
                      <div className="glass-card p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h2 className="text-2xl font-semibold text-blue-700">{selectedRequest.title}</h2>
                            <p className="text-gray-500">{selectedRequest.date} | {selectedRequest.location}</p>
                          </div>
                          <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            {selectedRequest.status === 'active' ? (
                              <>
                                <Clock className="h-4 w-4 ml-1" />
                                פעיל
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 ml-1" />
                                הושלם
                              </>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">
                          {selectedRequest.description}
                        </p>
                        
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-gray-500 text-sm">
                            הצעות מחיר: <span className="font-medium text-blue-700">{requestQuotes.length}</span>
                          </p>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500 border-red-200 hover:bg-red-50"
                          >
                            מחק בקשה
                          </Button>
                        </div>
                      </div>
                      
                      {requestQuotes.length > 0 ? (
                        <div>
                          <h3 className="text-xl font-semibold mb-4">הצעות מחיר שהתקבלו</h3>
                          
                          <div className="space-y-4">
                            {requestQuotes.map(quote => (
                              <QuoteCard 
                                key={quote.id} 
                                quote={quote} 
                                onAccept={handleAcceptQuote}
                                onReject={handleRejectQuote}
                                onViewProfile={handleViewProfile}
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12 glass-card">
                          <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הצעות מחיר עדיין</h3>
                          <p className="text-gray-500 mb-4">
                            עדיין לא התקבלו הצעות מחיר לבקשה זו. בדרך כלל לוקח 24-48 שעות לקבלת הצעות.
                          </p>
                          <Button variant="outline" className="border-[#00D09E] text-[#00D09E] hover:bg-[#00D09E]/10">
                            רענן
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="glass-card flex flex-col items-center justify-center text-center p-10">
                      <MessageSquare className="h-12 w-12 text-blue-200 mb-4" />
                      <h3 className="text-xl font-semibold text-blue-700 mb-2">בחר בקשה לצפייה</h3>
                      <p className="text-gray-600 mb-6 max-w-md">
                        בחר אחת מהבקשות מהרשימה משמאל כדי לצפות בפרטים ובהצעות המחיר שהתקבלו
                      </p>
                      <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="bg-[#00D09E] hover:bg-[#00C090]">
                            שלח בקשה חדשה
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">יצירת בקשה חדשה</DialogTitle>
                            <DialogDescription>
                              מלא את הפרטים כדי ליצור בקשה חדשה לבעלי מקצוע
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <RequestForm />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="referrals">
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h2 className="text-2xl font-semibold text-blue-700 mb-4">ההפניות שלי</h2>
                  <p className="text-gray-600 mb-6">
                    כאן תוכל לראות את ההפניות שיצרת לבעלי מקצוע, את הסטטוס שלהן ואת הפרטים שנשלחו
                  </p>
                  
                  <div className="text-center p-6">
                    <p className="text-lg mb-4">לצפייה בהפניות שלך, עבור לעמוד ההפניות המלא</p>
                    <Link to="/referrals">
                      <Button className="bg-[#00D09E] hover:bg-[#00C090]">
                        עבור להפניות שלי
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="credits">
              <div className="max-w-md mx-auto">
                <CreditCard creditAmount={250} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
