
import React from 'react';
import { ProfessionalInterface } from '@/services/professionals/types';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ProfessionalForm, { ProfessionalFormValues } from './ProfessionalForm';

interface ProfessionalFormDialogProps {
  editingProfessional: ProfessionalInterface | null;
  uploading: boolean;
  onSubmit: (data: ProfessionalFormValues) => Promise<void>;
  onCancel: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfessionalFormDialog: React.FC<ProfessionalFormDialogProps> = ({
  editingProfessional,
  uploading,
  onSubmit,
  onCancel,
  onImageChange
}) => {
  return (
    <DialogContent className="max-w-[800px] max-h-[90vh]">
      <DialogHeader>
        <DialogTitle>
          {editingProfessional ? 'עריכת בעל מקצוע' : 'הוספת בעל מקצוע חדש'}
        </DialogTitle>
        <DialogDescription>
          {editingProfessional
            ? 'ערוך את פרטי בעל המקצוע'
            : 'מלא את הפרטים הבאים כדי להוסיף בעל מקצוע חדש למערכת'}
        </DialogDescription>
      </DialogHeader>
      
      <ProfessionalForm 
        professional={editingProfessional} 
        uploading={uploading}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onImageChange={onImageChange}
      />
    </DialogContent>
  );
};

export default ProfessionalFormDialog;
