
import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { fetchArticles } from '@/services/articles';
import { ArticleInterface } from '@/types/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// Import components
import ArticleForm from '@/components/admin/articles/ArticleForm';
import ArticlesTable from '@/components/admin/articles/ArticlesTable';
import ArticlesEmptyState from '@/components/admin/articles/ArticlesEmptyState';
import ArticlesLoading from '@/components/admin/articles/ArticlesLoading';

const ArticlesManager = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "אירעה שגיאה בטעינת המאמרים",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditArticle = (article: ArticleInterface) => {
    // This function will be implemented in a future update
    toast({
      title: "עריכת מאמר",
      description: "פונקציונליות עריכת מאמר תהיה זמינה בקרוב"
    });
  };

  const handleDeleteArticle = (article: ArticleInterface) => {
    // This function will be implemented in a future update
    toast({
      title: "מחיקת מאמר",
      description: "פונקציונליות מחיקת מאמר תהיה זמינה בקרוב"
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול מאמרים</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הוסף מאמר
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>הוספת מאמר חדש</DialogTitle>
              <DialogDescription>
                מלא את הפרטים הבאים כדי להוסיף מאמר חדש למערכת
              </DialogDescription>
            </DialogHeader>
            
            <ArticleForm 
              onSuccess={() => {
                setDialogOpen(false);
                fetchData();
              }}
              onCancel={() => setDialogOpen(false)}
              uploading={uploading}
              setUploading={setUploading}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>רשימת מאמרים</CardTitle>
          <CardDescription>ניהול המאמרים במערכת</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <ArticlesLoading />
          ) : articles.length === 0 ? (
            <ArticlesEmptyState onAddArticle={() => setDialogOpen(true)} />
          ) : (
            <ArticlesTable 
              articles={articles} 
              onEdit={handleEditArticle}
              onDelete={handleDeleteArticle}
            />
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ArticlesManager;
