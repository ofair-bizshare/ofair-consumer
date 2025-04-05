
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Pre-populate fields if user is logged in
  React.useEffect(() => {
    if (user) {
      // Try to get user profile
      const fetchUserProfile = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (data && !error) {
            setName(data.name || '');
            setEmail(data.email || user.email || '');
            setPhone(data.phone || '');
          } else {
            setEmail(user.email || '');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setEmail(user.email || '');
        }
      };
      
      fetchUserProfile();
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: "שגיאה",
        description: "יש למלא את כל השדות המסומנים בכוכבית",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Store the contact form submission
      const { data, error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user?.id || '00000000-0000-0000-0000-000000000000',
          subject: subject || 'פנייה מדף צור קשר', 
          content: message,
          recipient_email: 'contact@ofair.co.il', // Admin contact email
          read: false
        });
        
      if (error) throw error;
      
      // Clear the form
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject('');
      
      toast({
        title: "תודה על פנייתך",
        description: "הודעתך התקבלה בהצלחה. נחזור אליך בהקדם.",
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "שגיאה בשליחת הפנייה",
        description: "אירעה שגיאה בעת שליחת הפנייה. אנא נסה שוב מאוחר יותר.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>צור קשר | oFair - נשמח לענות לשאלות ולסייע לך</title>
        <meta name="description" content="צור קשר עם צוות oFair בכל שאלה, הצעה או בקשה. אנחנו כאן לשירותך." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#00D09E]">צור</span> קשר
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              יש לך שאלה? רוצה לדעת עוד? נשמח לשמוע ממך ולעזור בכל עניין.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <Card className="h-full">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold mb-4">פרטי התקשרות</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="bg-[#00D09E]/10 p-3 rounded-full mr-4">
                        <Mail className="h-5 w-5 text-[#00D09E]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">דוא״ל</p>
                        <a href="mailto:contact@ofair.co.il" className="font-medium text-blue-600 hover:underline">
                          contact@ofair.co.il
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-[#00D09E]/10 p-3 rounded-full mr-4">
                        <Phone className="h-5 w-5 text-[#00D09E]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">טלפון</p>
                        <a href="tel:03-000-0000" className="font-medium">
                          03-000-0000
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="bg-[#00D09E]/10 p-3 rounded-full mr-4">
                        <MapPin className="h-5 w-5 text-[#00D09E]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">כתובת</p>
                        <p className="font-medium">
                          תל אביב, ישראל
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-gray-200">
                    <h3 className="font-medium mb-2">שעות פעילות</h3>
                    <p className="text-sm text-gray-600">
                      ימים א׳-ה׳: 9:00 - 18:00<br />
                      יום ו׳: 9:00 - 13:00
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">שלח לנו הודעה</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          שם מלא <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="הזן את שמך המלא"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          דוא״ל <span className="text-red-500">*</span>
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="הזן את כתובת הדוא״ל שלך"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                          טלפון
                        </label>
                        <Input
                          id="phone"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="הזן את מספר הטלפון שלך"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          נושא
                        </label>
                        <Input
                          id="subject"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="הזן את נושא הפנייה"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        הודעה <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="הזן את הודעתך כאן..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <div className="mt-6">
                      <Button 
                        type="submit" 
                        className="w-full md:w-auto bg-[#00D09E] hover:bg-[#00C090]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            שולח...
                          </>
                        ) : (
                          <>
                            <Send className="ml-2 h-4 w-4" />
                            שלח הודעה
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
