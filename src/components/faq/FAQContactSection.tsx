
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const FAQContactSection = () => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 mb-10">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold text-blue-700 mb-2">לא מצאת את התשובה שחיפשת?</h2>
          <p className="text-gray-600 max-w-md">
            צוות התמיכה שלנו זמין לענות על כל שאלה. שלח לנו הודעה ונחזור אליך בהקדם.
          </p>
        </div>
        <Button className="bg-blue-700 hover:bg-blue-800">
          <MessageCircle className="mr-2 h-4 w-4" />
          צור קשר עם התמיכה
        </Button>
      </div>
    </div>
  );
};

export default FAQContactSection;
