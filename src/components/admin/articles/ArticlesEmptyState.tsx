
import React from 'react';
import { Button } from '@/components/ui/button';

interface ArticlesEmptyStateProps {
  onAddArticle: () => void;
}

const ArticlesEmptyState: React.FC<ArticlesEmptyStateProps> = ({ onAddArticle }) => {
  return (
    <div className="text-center py-8">
      <p className="text-gray-500 dark:text-gray-400">לא נמצאו מאמרים</p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={onAddArticle}
      >
        הוסף מאמר ראשון
      </Button>
    </div>
  );
};

export default ArticlesEmptyState;
