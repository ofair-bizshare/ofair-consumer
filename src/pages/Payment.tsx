
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Lock, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

const Payment = () => {
  const { quoteId } = useParams<{ quoteId: string }>();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [quoteDetails, setQuoteDetails] = useState<any>(null);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchQuoteDetails = async () => {
      if (!quoteId || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('accepted_quotes')
          .select('*')
          .eq('quote_id', quoteId)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setQuoteDetails(data);
        } else {
          toast({
            title: "שגיאה בטעינת פרטי ההזמנה",
            description: "לא נמצאו פרטי הזמנה תואמים",
            variant: "destructive",
          });
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching quote details:", error);
        toast({
          title: "שגיאה בטעינת פרטי ההזמנה",
          description: "אירעה שגיאה בטעינת פרטי ההזמנה. אנא נסה שוב.",
          variant: "destructive",
        });
      }
    };
    
    fetchQuoteDetails();
  }, [quoteId, user, toast, navigate]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces every 4 digits
    if (name === 'number') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setCardInfo(prev => ({ ...prev, number: formattedValue }));
      return;
    }
    
    // Format expiry date as MM/YY
    if (name === 'expiry') {
      const cleanValue = value.replace(/\D/g, '').slice(0, 4);
      let formattedValue = cleanValue;
      
      if (cleanValue.length > 2) {
        formattedValue = cleanValue.slice(0, 2) + '/' + cleanValue.slice(2);
      }
      
      setCardInfo(prev => ({ ...prev, expiry: formattedValue }));
      return;
    }
    
    // Limit CVC to 3 or 4 digits
    if (name === 'cvc') {
      const formattedValue = value.replace(/\D/g, '').slice(0, 4);
      setCardInfo(prev => ({ ...prev, cvc: formattedValue }));
      return;
    }
    
    setCardInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quoteId || !quoteDetails) return;
    
    // Validate card details
    if (cardInfo.number.replace(/\s/g, '').length < 16) {
      toast({
        title: "מספר כרטיס לא תקין",
        description: "אנא הזן מספר כרטיס אשראי תקין",
        variant: "destructive",
      });
      return;
    }
    
    if (cardInfo.expiry.length < 5) {
      toast({
        title: "תאריך תפוגה לא תקין",
        description: "אנא הזן תאריך תפוגה תקין",
        variant: "destructive",
      });
      return;
    }
    
    if (cardInfo.cvc.length < 3) {
      toast({
        title: "קוד אבטחה לא תקין",
        description: "אנא הזן קוד אבטחה תקין",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      
      toast({
        title: "התשלום התקבל בהצלחה",
        description: "הזמנתך אושרה ובעל המקצוע יצור איתך קשר בקרוב",
        variant: "default",
      });
    }, 2000);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };
  
  if (success) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        
        <main className="flex-grow flex items-center justify-center py-16 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl font-bold text-green-700">התשלום בוצע בהצלחה</CardTitle>
              <CardDescription>
                התשלום על סך {quoteDetails?.price} עבור שירותי {quoteDetails?.professional_name} התקבל בהצלחה
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center pb-2">
              <p className="text-gray-600 mb-4">
                קבלה נשלחה לכתובת האימייל שלך
              </p>
              <p className="text-gray-600 mb-2">
                בעל המקצוע יעודכן על התשלום ויצור איתך קשר בקרוב
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <Button className="bg-[#00D09E] hover:bg-[#00C090] w-full" onClick={handleBackToDashboard}>
                חזרה לדף הבקשות
              </Button>
            </CardFooter>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>תשלום מאובטח | oFair - תשלום עבור שירותי בעל מקצוע</title>
        <meta name="description" content="דף תשלום מאובטח עבור שירותים שהזמנת מבעל מקצוע באמצעות oFair" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-2xl font-bold text-blue-700">תשלום מאובטח</CardTitle>
              <Lock className="h-5 w-5 text-green-600" />
            </div>
            <CardDescription>
              {quoteDetails ? (
                <div className="mt-2">
                  <p>שירות: <span className="font-medium">{quoteDetails.description}</span></p>
                  <p>בעל מקצוע: <span className="font-medium">{quoteDetails.professional_name}</span></p>
                  <p>סכום לתשלום: <span className="font-bold">{quoteDetails.price}</span></p>
                </div>
              ) : (
                <p>טוען פרטי הזמנה...</p>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="number">מספר כרטיס</Label>
                  <div className="relative">
                    <Input
                      id="number"
                      name="number"
                      placeholder="0000 0000 0000 0000"
                      value={cardInfo.number}
                      onChange={handleInputChange}
                      className="pr-10"
                    />
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">שם בעל הכרטיס</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="ישראל ישראלי"
                    value={cardInfo.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">תוקף</Label>
                    <Input
                      id="expiry"
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      name="cvc"
                      placeholder="123"
                      value={cardInfo.cvc}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Button type="submit" className="bg-[#00D09E] hover:bg-[#00C090] w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="animate-spin mr-2">&#9696;</span>
                      מעבד תשלום...
                    </>
                  ) : (
                    <>שלם {quoteDetails?.price}</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          
          <CardFooter className="flex-col gap-4">
            <div className="text-xs text-gray-500 text-center">
              <p className="flex items-center justify-center">
                <Lock className="h-3 w-3 mr-1" />
                כל התשלומים מאובטחים ומוצפנים
              </p>
            </div>
            <Button variant="ghost" size="sm" className="w-full" onClick={handleBackToDashboard}>
              חזרה לדף הבקשות
            </Button>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
