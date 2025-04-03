
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateCardProps {
  onCreateRequest: () => void;
  text?: string;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({ 
  onCreateRequest,
  text = "אין לך כרגע פניות פעילות"
}) => {
  return (
    <Card className="p-8 text-center bg-gray-50">
      <p className="text-lg text-gray-600 mb-4">{text}</p>
      <Button 
        className="bg-[#00D09E] hover:bg-[#00C090] text-white"
        onClick={onCreateRequest}
      >
        צור פנייה חדשה
      </Button>
    </Card>
  );
};

export default EmptyStateCard;
