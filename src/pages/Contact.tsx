
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PhoneInput } from '@/components/PhoneInput';
import { Map, Mail, Phone } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'שם חייב להכיל לפחות 2 תווים' }),
  email: z.string().email({ message: 'אנא הזן כתובת אימייל תקינה' }),
  phone: z.string().min(9, { message: 'מספר טלפון חייב להכיל לפחות 9 ספרות' }),
  subject: z.string().min(5, { message: 'נושא חייב להכיל לפחות 5 תווים' }),
  message: z.string().min(10, { message: 'הודעה חייבת להכיל לפחות 10 תווים' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const Contact = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '',
      subject: '',
      message: ''
    }
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Add message to the user_messages table
      const { error } = await supabase.from('user_messages').insert({
        sender_id: user?.id || '00000000-0000-0000-0000-000000000000',
        recipient_email: 'contact@ofair.co.il', // Admin contact email
        subject: `פנייה מהאתר: ${data.subject}`,
        content: `
          שם: ${data.name}
          אימייל: ${data.email}
          טלפון: ${data.phone}
          
          ${data.message}
        `,
        read: false
      });
      
      if (error) throw error;
      
      toast({
        title: 'הודעתך נשלחה בהצלחה',
        description: 'תודה על פנייתך, נחזור אליך בהקדם האפשרי',
      });
      
      form.reset({
        name: user?.user_metadata?.full_name || '',
        email: user?.email || '',
        phone: user?.user_metadata?.phone || '',
        subject: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'שגיאה בשליחת הטופס',
        description: 'אירעה שגיאה בעת שליחת הטופס, אנא נסה שוב מאוחר יותר',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>צור קשר | oFair - אנחנו כאן לעזור</title>
        <meta 
          name="description" 
          content="צור איתנו קשר עם כל שאלה, הצעה או בקשה. צוות התמיכה שלנו זמין לענות לכל פנייה."
        />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-3">צור קשר</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                יש לך שאלות או הצעות לשיפור? אנחנו תמיד שמחים לשמוע ממך. מלא את הטופס ונחזור אליך בהקדם האפשרי.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-1 space-y-6 md:order-2">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">פרטי יצירת קשר</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Mail className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold">דוא"ל</h4>
                        <p className="text-gray-600">contact@ofair.co.il</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Phone className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold">טלפון</h4>
                        <p className="text-gray-600">03-123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <Map className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold">כתובת</h4>
                        <p className="text-gray-600">רחוב הברזל 30, תל אביב</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold mb-4 text-blue-700">שעות פעילות</h3>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>ימים א'-ה'</span>
                      <span>09:00 - 18:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>יום ו'</span>
                      <span>09:00 - 13:00</span>
                    </li>
                    <li className="flex justify-between">
                      <span>שבת</span>
                      <span>סגור</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="md:col-span-2 md:order-1">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-6 text-blue-700">שלח לנו הודעה</h2>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>שם מלא</FormLabel>
                              <FormControl>
                                <Input placeholder="השם המלא שלך" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>דוא"ל</FormLabel>
                              <FormControl>
                                <Input placeholder="האימייל שלך" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>טלפון</FormLabel>
                              <FormControl>
                                <Input placeholder="מספר הטלפון שלך" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>נושא</FormLabel>
                              <FormControl>
                                <Input placeholder="נושא הפנייה" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>הודעה</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="תוכן ההודעה שלך" 
                                {...field} 
                                className="min-h-[150px]"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full bg-[#00d09e] hover:bg-[#00b389]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'שולח...' : 'שלח הודעה'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
