
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, Eye } from 'lucide-react';
import { QuoteInterface } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';

interface QuotesListProps {
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
}

const QuotesList: React.FC<QuotesListProps> = ({ 
  quotes, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile 
}) => {
  return (
    <div className="space-y-4">
      {quotes.map(quote => (
        <QuoteCard 
          key={quote.id} 
          quote={quote} 
          onAcceptQuote={onAcceptQuote}
          onRejectQuote={onRejectQuote}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

interface QuoteCardProps {
  quote: QuoteInterface;
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ 
  quote, 
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile 
}) => {
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
              onClick={() => onRejectQuote(quote.id)}
            >
              דחה הצעה
            </Button>
            
            <Button 
              size="sm"
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => onAcceptQuote(quote.id)}
            >
              קבל הצעה
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotesList;
