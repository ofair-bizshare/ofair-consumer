import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { createArticle, uploadArticleImage } from '@/services/admin';
import ArticlesTable from '@/components/admin/articles/ArticlesTable';
import ArticlesEmptyState from '@/components/admin/articles/ArticlesEmptyState';
import ArticlesLoading from '@/components/admin/articles/ArticlesLoading';
import ArticleForm from '@/components/admin/articles/ArticleForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArticleInterface } from '@/types/dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const ArticlesManager = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchArticles = async () => {
    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('אירעה שגיאה בטעינת המאמרים, אנא נסה שוב מאוחר יותר.');
      toast({
        title: 'שגיאה בטעינת מאמרים',
        description: 'אירעה שגיאה בטעינת המאמרים מהשרת',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (articleData: any, imageFile: File | null) => {
    try {
      setSubmitting(true);
      
      let imageUrl = undefined;
      if (imageFile) {
        imageUrl = await uploadArticleImage(imageFile);
      }
      
      const article = await createArticle({
        ...articleData,
        image: imageUrl
      });
      
      if (article) {
        toast({
          title: 'מאמר נוצר בהצלחה',
          description: 'המאמר נוסף למערכת בהצלחה',
        });
        
        setDialogOpen(false);
        fetchArticles();
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: 'שגיאה ביצירת מאמר',
        description: 'אירעה שגיאה בעת יצירת המאמר',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: 'מאמר נמחק בהצלחה',
        description: 'המאמר הוסר מהמערכת',
      });
      
      fetchArticles();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: 'שגיאה במחיקת מאמר',
        description: 'אירעה שגיאה בעת מחיקת המאמר',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול מאמרים</h1>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          הוסף מאמר
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {loading ? (
        <ArticlesLoading />
      ) : articles.length === 0 ? (
        <ArticlesEmptyState onAddArticle={() => setDialogOpen(true)} />
      ) : (
        <ArticlesTable 
          articles={articles} 
          onDeleteArticle={handleDeleteArticle} 
          onRefetch={fetchArticles}
        />
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>הוספת מאמר חדש</DialogTitle>
            <DialogDescription>
              מלא את הפרטים הבאים כדי ליצור מאמר חדש.
            </DialogDescription>
          </DialogHeader>
          
          <ArticleForm 
            onSubmit={handleCreateArticle} 
            isSubmitting={submitting}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ArticlesManager;
