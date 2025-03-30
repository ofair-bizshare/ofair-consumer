
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
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';

interface QuoteDetailDialogProps {
  professional: ProfessionalInterface;
  onViewProfile: (professionalId: string) => void;
}

const QuoteDetailDialog: React.FC<QuoteDetailDialogProps> = ({ 
  professional,
  onViewProfile
}) => {
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-lg bg-white/95" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">פרופיל בעל מקצוע</DialogTitle>
          <DialogDescription>
            מידע מפורט על בעל המקצוע
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <iframe 
            src={`/professional/${professional.id}`} 
            className="w-full h-[70vh] border-none rounded-md shadow-md"
            title={`פרופיל של ${professional.name}`}
          />
        </div>
        <div className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">סגור</Button>
          </DialogClose>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => onViewProfile(professional.id)}
          >
            פתח בעמוד מלא
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteDetailDialog;
