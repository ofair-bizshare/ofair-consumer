import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Star, Trash2 } from 'lucide-react';
import { RequestInterface, QuoteInterface } from '@/types/dashboard';
import QuotesList from './QuotesList';
import { useToast } from '@/hooks/use-toast';
import { deleteRequest } from '@/services/requests';
import ProfessionalRatingDialog from './rating/ProfessionalRatingDialog';
import ErrorBoundary from '@/components/ui/error-boundary';

interface RequestDetailProps {
  request: RequestInterface;
  quotes: QuoteInterface[];
  onAcceptQuote: (quoteId: string) => void;
  onRejectQuote: (quoteId: string) => void;
  onViewProfile: (professionalId: string) => void;
  onRefresh?: () => void;
}

const RequestDetail: React.FC<RequestDetailProps> = ({ 
  request, 
  quotes = [], // Add a default empty array to prevent undefined issues
  onAcceptQuote, 
  onRejectQuote, 
  onViewProfile,
  onRefresh
}) => {
  const { toast } = useToast();
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedQuoteForRating, setSelectedQuoteForRating] = useState<string | null>(null);
  const ratingButtonRef = useRef<HTMLDivElement>(null);
  
  // Safe logging with null checks
  console.log("RequestDetail rendered with request:", request);
  console.log("RequestDetail rendered with quotes:", quotes || []);
  
  // Find the accepted quote (if any), ensure quotes is an array before finding
  const safeQuotes = Array.isArray(quotes) ? quotes : [];
  const acceptedQuote = safeQuotes.length > 0 ? safeQuotes.find(q => q?.status === 'accepted') : undefined;
  console.log("Found accepted quote:", acceptedQuote);

  // Auto-open rating dialog if the request is waiting for rating and URL has hash
  useEffect(() => {
    if (window.location.hash === '#rating-section' && 
        request?.status === 'waiting_for_rating' && 
        acceptedQuote && 
        !isRatingDialogOpen) {
      console.log("Auto-opening rating dialog because of #rating-section hash");
      setIsRatingDialogOpen(true);
      setSelectedQuoteForRating(acceptedQuote.id);
    }
  }, [request?.status, acceptedQuote, isRatingDialogOpen]);

  // Handle quote rating click
  const handleQuoteRatingClick = (quoteId: string) => {
    console.log(`Opening rating dialog for quote ${quoteId}`);
    
    // Find the quote data by ID
    const quoteToRate = safeQuotes.find(q => q.id === quoteId);
    
    if (quoteToRate && quoteToRate.professional && quoteToRate.professional.id) {
      setSelectedQuoteForRating(quoteId);
      setIsRatingDialogOpen(true);
    } else {
      console.error("Cannot open rating dialog: quote or professional data is missing");
      toast({
        title: "שגיאה",
        description: "לא ניתן לדרג את בעל המקצוע כרגע, אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteRequest = async () => {
    if (!request?.id) return;
    
    // Confirm deletion with the user
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הבקשה?')) {
      return;
    }
    
    setIsDeleting(true);
    console.log(`Attempting to delete request with ID: ${request.id}`);
    
    try {
      const success = await deleteRequest(request.id);
      console.log("Delete request result:", success);
      
      if (success) {
        toast({
          title: "הבקשה נמחקה",
          description: "הבקשה נמחקה בהצלחה מהמערכת",
          variant: "default",
        });
        
        if (onRefresh) {
          onRefresh();
        }
        
        // Redirect to dashboard after deletion
        window.location.href = "/dashboard";
      } else {
        toast({
          title: "שגיאה במחיקת הבקשה",
          description: "אירעה שגיאה במחיקת הבקשה, אנא נסה שוב",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting request:", error);
      toast({
        title: "שגיאה במחיקת הבקשה",
        description: "אירעה שגיאה במחיקת הבקשה, אנא נסה שוב",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Handler for the prominent rating button in RequestDetail
  const handleOpenRatingDialog = () => {
    if (!acceptedQuote?.professional) {
      console.error("Cannot open rating dialog: professional data is missing");
      toast({
        title: "שגיאה",
        description: "לא ניתן לדרג את בעל המקצוע כרגע, אנא נסה שוב מאוחר יותר",
        variant: "destructive",
      });
      return;
    }
    
    console.log("Opening rating dialog from main rating button for professional:", acceptedQuote.professional);
    setSelectedQuoteForRating(acceptedQuote.id);
    setIsRatingDialogOpen(true);
  };

  // Early return if request is undefined
  if (!request) {
    return <div className="text-gray-500 text-center py-4">Loading request details...</div>;
  }

  // Get the currently selected quote for rating (either the explicitly selected one or the accepted quote)
  const selectedQuoteData = selectedQuoteForRating 
    ? safeQuotes.find(q => q.id === selectedQuoteForRating) 
    : acceptedQuote;

  // Prepare the rating button prominent display for waiting_for_rating status
  // אם יש סטטוס ממתין לדירוג והצעה מאושרת עם professional - מציגים דירוג תמיד, לא משנה התאריך
  const showRatingPrompt = request.status === 'waiting_for_rating' && acceptedQuote && acceptedQuote.professional;

  return (
    <div className="space-y-6 animate-fade-in font-assistant">
      <div className="glass-card p-6 font-assistant">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-blue-700">{request.title}</h2>
            <p className="text-gray-500">{request.date} | {request.location}</p>
          </div>
          <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
            {request.status === 'active' ? (
              <>
                <Clock className="h-4 w-4 ml-1" />
                פעיל
              </>
            ) : request.status === 'waiting_for_rating' ? (
              <>
                <Star className="h-4 w-4 ml-1" />
                ממתין לדירוג
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
          {request.description}
        </p>
        
        {/* Show rating button prominently when status is waiting_for_rating */}
        {showRatingPrompt && (
          <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-md" ref={ratingButtonRef}>
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="text-amber-800 font-semibold">נדרש דירוג לסיום התהליך</h3>
            </div>
            <p className="text-amber-800 mb-3 text-sm">
              אנא דרג את החוויה שלך עם {acceptedQuote?.professional?.name || "בעל המקצוע"} כדי לסייע למשתמשים אחרים ולסיים את תהליך הבקשה
            </p>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white w-full md:w-auto"
              onClick={handleOpenRatingDialog}
              id="rating-section-button"
            >
              <Star className="h-4 w-4 ml-1" />
              דרג את בעל המקצוע
            </Button>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
          <p className="text-gray-500 text-sm">
            הצעות מחיר: <span className="font-medium text-blue-700">{safeQuotes.length}</span>
          </p>
          <Button 
            variant="outline" 
            size="sm"
            className="text-red-500 border-red-200 hover:bg-red-50 flex items-center gap-1"
            onClick={handleDeleteRequest}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-red-500 animate-spin mr-1" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            מחק בקשה
          </Button>
        </div>
      </div>
      
      <ErrorBoundary fallback={<div className="p-4 bg-red-50 text-red-700 rounded-md">שגיאה בטעינת הצעות המחיר</div>}>
        {safeQuotes.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4">הצעות מחיר שהתקבלו</h3>
            <QuotesList 
              quotes={safeQuotes} 
              onAcceptQuote={onAcceptQuote} 
              onRejectQuote={onRejectQuote} 
              onViewProfile={onViewProfile}
              requestStatus={request.status} // Pass request status to QuotesList
              onRatingClick={handleQuoteRatingClick} // Pass rating handler to QuotesList
            />
          </div>
        ) : (
          <NoQuotesMessage onRefresh={onRefresh} />
        )}
      </ErrorBoundary>
      
      {/* Professional Rating Dialog - Only render when we have a valid professional */}
      {selectedQuoteData && selectedQuoteData.professional && selectedQuoteData.professional.id && (
        <ProfessionalRatingDialog
          open={isRatingDialogOpen}
          onOpenChange={(isOpen) => {
            setIsRatingDialogOpen(isOpen);
            if (!isOpen) {
              // Reset selected quote when dialog closes
              setSelectedQuoteForRating(null);
            }
          }}
          professional={{
            id: selectedQuoteData.professional.id,
            name: selectedQuoteData.professional.name || "בעל מקצוע",
            phone: selectedQuoteData.professional.phoneNumber || selectedQuoteData.professional.phone || '',
            companyName: selectedQuoteData.professional.company_name || selectedQuoteData.professional.companyName || ''
          }}
          requestId={request.id}
          onRatingComplete={() => {
            if (onRefresh) {
              onRefresh();
            }
          }}
        />
      )}
    </div>
  );
};

const NoQuotesMessage = ({ onRefresh }: { onRefresh?: () => void }) => (
  <div className="text-center py-12 glass-card">
    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-700 mb-2">אין הצעות מחיר עדיין</h3>
    <p className="text-gray-500 mb-4">
      עדיין לא התקבלו הצעות מחיר לבקשה זו. בדרך כלל לוקח 24-48 שעות לקבלת הצעות.
    </p>
    <Button 
      variant="outline" 
      className="border-[#00D09E] text-[#00D09E] hover:bg-[#00D09E]/10"
      onClick={onRefresh}
    >
      רענן
    </Button>
  </div>
);

export default RequestDetail;
