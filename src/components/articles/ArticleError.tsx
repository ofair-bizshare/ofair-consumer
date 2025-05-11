
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ArticleErrorProps {
  message?: string;
}

const ArticleError: React.FC<ArticleErrorProps> = ({ message = "שגיאה בטעינת המאמר" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 max-w-lg mx-auto text-center px-4">
      <AlertTriangle size={64} className="text-amber-500 mb-6" />
      <h1 className="text-2xl font-bold text-gray-800 mb-3">שגיאה בטעינת המאמר</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Button asChild variant="outline">
          <Link to="/articles">חזרה לרשימת המאמרים</Link>
        </Button>
        <Button className="bg-[#00d09e] hover:bg-[#00b08a]" onClick={() => window.location.reload()}>
          נסה שוב
        </Button>
      </div>
    </div>
  );
};

export default ArticleError;
