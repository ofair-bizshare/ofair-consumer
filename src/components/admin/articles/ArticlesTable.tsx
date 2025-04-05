
import React from 'react';
import { ArticleInterface } from '@/types/dashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface ArticlesTableProps {
  articles: ArticleInterface[];
  onEditArticle?: (article: ArticleInterface) => void;
  onDeleteArticle?: (id: string) => Promise<void>;
  onRefetch?: () => Promise<void>;
}

const ArticlesTable: React.FC<ArticlesTableProps> = ({ 
  articles,
  onEditArticle,
  onDeleteArticle,
  onRefetch
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleDelete = async (id: string) => {
    if (onDeleteArticle) {
      await onDeleteArticle(id);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>כותרת</TableHead>
          <TableHead>מחבר</TableHead>
          <TableHead>תאריך</TableHead>
          <TableHead>סטטוס</TableHead>
          <TableHead>פעולות</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.map((article) => (
          <TableRow key={article.id}>
            <TableCell className="font-medium">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-gray-400" />
                {article.title}
              </div>
            </TableCell>
            <TableCell>{article.author || 'ללא'}</TableCell>
            <TableCell>{formatDate(article.created_at)}</TableCell>
            <TableCell>
              {article.published ? (
                <div className="flex items-center text-green-600">
                  <Eye className="h-4 w-4 mr-1" />
                  מפורסם
                </div>
              ) : (
                <div className="flex items-center text-gray-400">
                  <EyeOff className="h-4 w-4 mr-1" />
                  טיוטה
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                {onEditArticle && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEditArticle(article)}
                    className="ml-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDelete(article.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ArticlesTable;
