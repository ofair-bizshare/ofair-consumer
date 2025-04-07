
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { createTestQuote } from '@/scripts/createTestQuote';
import { useToast } from '@/hooks/use-toast';

const TestQuoteButton = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleCreateTestQuote = async () => {
    setLoading(true);
    try {
      const result = await createTestQuote();
      if (result) {
        toast({
          title: "הצעת מחיר לדוגמה נוצרה",
          description: "הצעת מחיר חדשה נוספה לבקשה הפעילה שלך",
          variant: "default",
        });
      } else {
        toast({
          title: "לא ניתן ליצור הצעה לדוגמה",
          description: "ייתכן שכבר קיימת הצעה או שחסרים נתונים. בדוק את הקונסול לפרטים נוספים.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating test quote:", error);
      toast({
        title: "שגיאה ביצירת הצעה לדוגמה",
        description: "אירעה שגיאה בלתי צפויה. בדוק את הקונסול לפרטים נוספים.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-[#00D09E] text-[#00D09E] hover:bg-[#00D09E]/10"
      onClick={handleCreateTestQuote}
      disabled={loading}
    >
      <Sparkles className="h-4 w-4 mr-1" />
      {loading ? 'יוצר הצעה...' : 'צור הצעה לדוגמה'}
    </Button>
  );
};

export default TestQuoteButton;
