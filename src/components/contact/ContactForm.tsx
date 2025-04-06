
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/providers/AuthProvider';

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user) {
      const fetchUserProfile = async () => {
        try {
          const {
            data,
            error
          } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
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
      const {
        data,
        error
      } = await supabase.from('user_messages').insert({
        sender_id: user?.id || '00000000-0000-0000-0000-000000000000',
        subject: subject || 'פנייה מדף צור קשר',
        content: message,
        recipient_email: 'contact@ofair.co.il',
        read: false
      });
      if (error) throw error;

      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setSubject('');
      toast({
        title: "תודה על פנייתך",
        description: "הודעתך התקבלה בהצלחה. נחזור אליך בהקדם."
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
    <Card className={isMobile ? "mx-0" : "mx-[86px]"}>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-6">שלח לנו הודעה</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                שם מלא <span className="text-red-500">*</span>
              </label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="הזן את שמך המלא" required />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                דוא״ל <span className="text-red-500">*</span>
              </label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="הזן את כתובת הדוא״ל שלך" required />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                טלפון
              </label>
              <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} placeholder="הזן את מספר הטלפון שלך" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">
                נושא
              </label>
              <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="הזן את נושא הפנייה" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              הודעה <span className="text-red-500">*</span>
            </label>
            <Textarea id="message" value={message} onChange={e => setMessage(e.target.value)} placeholder="הזן את הודעתך כאן..." rows={6} required />
          </div>
          
          <div className={isMobile ? "mt-6" : "mt-6 mx-[218px]"}>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full md:w-auto bg-[#00D09E] hover:bg-[#00C090] px-6 py-2 text-sm font-medium"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin ml-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  שולח...
                </>
              ) : (
                <>
                  שלח הודעה
                  <Send className="mr-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
