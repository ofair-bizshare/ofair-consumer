
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, AlertCircle, Eye, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';

// Import requests from mock data
import { requests } from '@/data/dashboardData';

interface Referral {
  professionalId: string;
  professionalName: string;
  phoneNumber: string;
  date: string;
  status: string;
  profession?: string;
}

const ReferralsPage = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is logged in
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    
    if (!hasSession) {
      toast({
        title: "התחברות נדרשת",
        description: "עליך להתחבר כדי לצפות בהפניות שלך",
        variant: "destructive",
      });
      navigate('/login', { state: { returnUrl: '/referrals' } });
      return;
    }
    
    // Get referrals from localStorage
    const storedReferrals = localStorage.getItem('myReferrals');
    if (storedReferrals) {
      try {
        const parsedReferrals = JSON.parse(storedReferrals);
        setReferrals(parsedReferrals);
      } catch (error) {
        console.error('Error parsing referrals:', error);
        setReferrals([]);
      }
    }
  }, [navigate, toast]);

  const markAsContacted = (id: string) => {
    const updatedReferrals = referrals.map(referral => {
      if (referral.professionalId === id) {
        return { ...referral, status: 'contacted' };
      }
      return referral;
    });
    
    setReferrals(updatedReferrals);
    localStorage.setItem('myReferrals', JSON.stringify(updatedReferrals));
    
    toast({
      title: "סטטוס עודכן",
      description: "ההפניה סומנה כ'נוצר קשר'",
      variant: "default",
    });
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
              צפה בבקשות הקודמות שלך, הצעות המחיר והפניות לבעלי מקצוע
            </p>
          </div>
          
          <Tabs defaultValue="professionals" className="mb-10">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="professionals" className="flex-1">הפניות לבעלי מקצוע</TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">הבקשות שלי</TabsTrigger>
            </TabsList>
            
            <TabsContent value="professionals">
              <div className="glass-card p-6">
                {referrals.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {referrals.map((referral, index) => (
                      <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h3 className="text-lg font-semibold">{referral.professionalName}</h3>
                                <p className="text-gray-500 text-sm">{referral.profession || "בעל מקצוע"}</p>
                              </div>
                              <div className="flex items-center text-sm">
                                {referral.status === 'new' ? (
                                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">חדש</span>
                                ) : (
                                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">נוצר קשר</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-gray-700 mb-3">
                              <div className="flex items-center mb-1">
                                <Phone className="h-4 w-4 text-[#00D09E] ml-2" />
                                <p className="font-medium">{referral.phoneNumber}</p>
                              </div>
                              <p className="text-sm text-gray-500">{referral.date}</p>
                            </div>
                            
                            <div className="flex justify-between pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-blue-700 border-blue-200 hover:bg-blue-50"
                                onClick={() => window.open(`/professional/${referral.professionalId}`, '_blank')}
                              >
                                <Eye size={16} className="ml-1" />
                                צפה בפרופיל
                              </Button>
                              
                              {referral.status === 'new' && (
                                <Button 
                                  size="sm"
                                  className="bg-[#00D09E] hover:bg-[#00C090]"
                                  onClick={() => markAsContacted(referral.professionalId)}
                                >
                                  סמן כנוצר קשר
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הפניות עדיין</h3>
                    <p className="text-gray-500 mb-4">
                      כאשר תיצור הפניות לבעלי מקצוע, הן יופיעו כאן כדי שתוכל לעקוב אחריהן
                    </p>
                    <Link to="/search">
                      <Button className="bg-[#00D09E] hover:bg-[#00C090]">
                        חפש בעלי מקצוע
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="requests">
              <div className="glass-card p-6">
                {requests.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>כותרת</TableHead>
                        <TableHead>תאריך</TableHead>
                        <TableHead>מיקום</TableHead>
                        <TableHead>סטטוס</TableHead>
                        <TableHead className="text-left">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.title}</TableCell>
                          <TableCell>{request.date}</TableCell>
                          <TableCell>{request.location}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {request.status === 'active' ? (
                                <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">פעיל</span>
                              ) : (
                                <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">הושלם</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                              onClick={() => navigate(`/dashboard#${request.id}`)}
                            >
                              <MessageSquare size={14} className="ml-1" />
                              צפה בפרטים
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">אין בקשות עדיין</h3>
                    <p className="text-gray-500 mb-4">
                      כאשר תיצור בקשות לבעלי מקצוע, הן יופיעו כאן
                    </p>
                    <Link to="/">
                      <Button className="bg-[#00D09E] hover:bg-[#00C090]">
                        שלח בקשה חדשה
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReferralsPage;
