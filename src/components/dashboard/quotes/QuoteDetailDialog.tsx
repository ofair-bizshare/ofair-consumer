
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

interface QuoteDetailDialogProps {
  professional: ProfessionalInterface;
  onViewProfile: (professionalId: string) => void;
}

const QuoteDetailDialog: React.FC<QuoteDetailDialogProps> = ({ 
  professional,
  onViewProfile
}) => {
  const navigate = useNavigate();
  
  // Handle direct navigation to professional profile
  const handleViewProfile = () => {
    navigate(`/professional/${professional.id}`);
  };

  return (
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
                <img src={professional.image} alt={professional.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-bold">{professional.name}</h3>
                <p className="text-gray-600">{professional.profession}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-1">מיקום:</h4>
              <p>{professional.location}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-semibold mb-1">התמחויות:</h4>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <span key={index} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                    {specialty}
                  </span>
                ))}
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
  );
};

export default QuoteDetailDialog;
