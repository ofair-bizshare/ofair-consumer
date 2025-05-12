
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { ProfessionalInterface } from '@/types/dashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger
} from '@/components/ui/dialog';
import { useNavigate } from 'react-router-dom';
import ErrorBoundary from '@/components/ui/error-boundary';

interface QuoteDetailDialogProps {
  professional: ProfessionalInterface;
  onViewProfile: (professionalId: string) => void;
}

const QuoteDetailDialog: React.FC<QuoteDetailDialogProps> = ({ 
  professional,
  onViewProfile
}) => {
  const navigate = useNavigate();
  
  // Safety check for professional data
  if (!professional || !professional.id) {
    console.error("Cannot render QuoteDetailDialog: Missing professional data", professional);
    return null;
  }
  
  // Handle direct navigation to professional profile
  const handleViewProfile = () => {
    navigate(`/professional/${professional.id}`);
  };

  // Ensure professional and specialties exist and are valid before rendering them
  const hasSpecialties = professional && 
    professional.specialties && 
    Array.isArray(professional.specialties) && 
    professional.specialties.length > 0;

  return (
    <ErrorBoundary fallback={<div>שגיאה בטעינת פרטי בעל המקצוע</div>}>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">פרופיל בעל מקצוע</DialogTitle>
            <DialogDescription>
              מידע מפורט על בעל המקצוע
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 px-2">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full overflow-hidden bg-blue-100">
                  <img 
                    src={professional.image || professional.image_url} 
                    alt={professional.name || 'בעל מקצוע'} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ctext x='50' y='50' font-size='12' text-anchor='middle' alignment-baseline='middle' font-family='Arial' fill='%23a1a1aa'%3ENo image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{professional.name || 'שם לא זמין'}</h3>
                  <p className="text-gray-600">{professional.profession || 'מקצוע לא זמין'}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-1">מיקום:</h4>
                <p>{professional.location || 'לא צוין'}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold mb-1">התמחויות:</h4>
                <div className="flex flex-wrap gap-2">
                  {hasSpecialties ? (
                    professional.specialties.map((specialty, index) => (
                      <span key={index} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                        {specialty}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">לא צוינו התמחויות</span>
                  )}
                </div>
              </div>
              
              <div className="text-center mt-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                  onClick={handleViewProfile}
                >
                  צפה בפרופיל המלא
                </Button>
              </div>
            </div>
          </div>
          <div className="flex justify-between">
            <DialogClose asChild>
              <Button variant="outline">סגור</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default QuoteDetailDialog;
