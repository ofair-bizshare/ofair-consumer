import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface PopupNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  type: 'success' | 'error' | 'warning' | 'info';
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

const PopupNotification: React.FC<PopupNotificationProps> = ({
  isOpen,
  onClose,
  title,
  description,
  type,
  actionButton
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case 'error':
        return <XCircle className="w-12 h-12 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-12 h-12 text-yellow-500" />;
      case 'info':
        return <Info className="w-12 h-12 text-blue-500" />;
      default:
        return <Info className="w-12 h-12 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-md text-center ${getBgColor()} border-2`}>
        <DialogHeader className="items-center space-y-4">
          <div className="animate-scale-in">
            {getIcon()}
          </div>
          <DialogTitle className="text-xl font-bold">
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 justify-center mt-6">
          {actionButton && (
            <Button
              onClick={() => {
                actionButton.onClick();
                onClose();
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold"
            >
              {actionButton.label}
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            סגור
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PopupNotification;