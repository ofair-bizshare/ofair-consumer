
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CreditCardProps {
  creditAmount: number;
}

const CreditCard: React.FC<CreditCardProps> = ({ creditAmount }) => {
  return (
    <Card className="border-blue-100 shadow-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-600 text-white pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Gift className="h-5 w-5 ml-2" />
            הקרדיט שלי
          </CardTitle>
          <div className="text-sm bg-white/20 px-2 py-1 rounded-lg">
            5% חזרה
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600">יתרת קרדיט זמינה:</div>
          <div className="text-2xl font-bold text-teal-600">{creditAmount} ₪</div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-gray-700 mb-4">
          <p className="mb-2">
            <strong>איך זה עובד?</strong>
          </p>
          <p>
            על כל עבודה שתבצעו דרכנו, תקבלו 5% מהסכום בחזרה כקרדיט לשימוש בעבודה הבאה שלכם דרך oFair.
          </p>
        </div>
        
        <div className="text-center">
          <Button asChild variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50">
            <Link to="/">
              מצא בעל מקצוע לעבודה הבאה
              <ArrowRight className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditCard;
