
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ProfessionalInterface } from '@/services/professionals/types';
import ProfessionalForm, { ProfessionalFormValues } from '@/components/admin/professionals/ProfessionalForm';

interface ProfessionalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ProfessionalFormValues) => Promise<void>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
  professional: ProfessionalInterface | null;
  onClose: () => void;
}

const ProfessionalDialog: React.FC<ProfessionalDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  onImageChange,
  uploading,
  professional,
  onClose
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[800px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{professional ? 'עריכת בעל מקצוע' : 'הוספת בעל מקצוע חדש'}</DialogTitle>
          <DialogDescription>
            {professional 
              ? 'ערוך את פרטי בעל המקצוע'
              : 'מלא את הפרטים הבאים כדי להוסיף בעל מקצוע חדש למערכת'}
          </DialogDescription>
        </DialogHeader>
        
        <ProfessionalForm 
          professional={professional} 
          uploading={uploading}
          onSubmit={onSubmit}
          onCancel={onClose}
          onImageChange={onImageChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalDialog;
