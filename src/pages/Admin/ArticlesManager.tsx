
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { createArticle, updateArticle, uploadArticleImage } from '@/services/admin';
import ArticlesTable from '@/components/admin/articles/ArticlesTable';
import ArticlesEmptyState from '@/components/admin/articles/ArticlesEmptyState';
import ArticlesLoading from '@/components/admin/articles/ArticlesLoading';
import ArticleForm from '@/components/admin/articles/ArticleForm';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArticleInterface } from '@/types/dashboard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { articleCategoryOptions } from '@/components/admin/articles/articleSchema';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const ArticlesManager = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleInterface | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
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
      setFilteredArticles(data || []);
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

  // Filter articles when search term or category changes
  useEffect(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = 
        !searchTerm || 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.content && article.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()));
        
      const matchesCategory = !categoryFilter || article.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    });
    
    setFilteredArticles(filtered);
  }, [articles, searchTerm, categoryFilter]);

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

  const handleUpdateArticle = async (articleData: any, imageFile: File | null) => {
    if (!editingArticle) return;
    
    try {
      setSubmitting(true);
      
      let imageUrl = editingArticle.image;
      if (imageFile) {
        const uploadedUrl = await uploadArticleImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const updatedArticle = await updateArticle(editingArticle.id, {
        ...articleData,
        image: imageUrl
      });
      
      if (updatedArticle) {
        toast({
          title: 'מאמר עודכן בהצלחה',
          description: 'המאמר עודכן במערכת בהצלחה',
        });
        
        setDialogOpen(false);
        setEditingArticle(null);
        fetchArticles();
      }
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: 'שגיאה בעדכון מאמר',
        description: 'אירעה שגיאה בעת עדכון המאמר',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditArticle = (article: ArticleInterface) => {
    setEditingArticle(article);
    setDialogOpen(true);
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

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArticle(null);
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
      
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/2">
            <Label htmlFor="search" className="mb-2 block">חיפוש מאמרים</Label>
            <Input 
              id="search" 
              placeholder="חפש לפי כותרת או תוכן..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-1/4">
            <Label htmlFor="category" className="mb-2 block">סינון לפי קטגוריה</Label>
            <select
              id="category"
              className="w-full h-10 px-3 py-2 text-base rounded-md border border-input bg-background"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">כל הקטגוריות</option>
              {articleCategoryOptions.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="w-full md:w-1/4 flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('');
              }}
            >
              נקה סינון
            </Button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <ArticlesLoading />
      ) : filteredArticles.length === 0 ? (
        searchTerm || categoryFilter ? (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">לא נמצאו תוצאות</h3>
            <p className="text-gray-500">
              לא נמצאו מאמרים התואמים את החיפוש שלך. נסה לשנות את מונחי החיפוש או הסינון.
            </p>
          </div>
        ) : (
          <ArticlesEmptyState onAddArticle={() => setDialogOpen(true)} />
        )
      ) : (
        <ArticlesTable 
          articles={filteredArticles} 
          onEditArticle={handleEditArticle}
          onDeleteArticle={handleDeleteArticle} 
          onRefetch={fetchArticles}
        />
      )}
      
      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>
              {editingArticle ? 'עריכת מאמר' : 'הוספת מאמר חדש'}
            </DialogTitle>
            <DialogDescription>
              {editingArticle 
                ? 'ערוך את הפרטים כדי לעדכן את המאמר.'
                : 'מלא את הפרטים הבאים כדי ליצור מאמר חדש.'}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="max-h-[calc(90vh-120px)]">
            <div className="p-6 pt-2">
              <ArticleForm 
                defaultValues={editingArticle || undefined}
                onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle} 
                isSubmitting={submitting}
                onCancel={handleCloseDialog}
              />
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default ArticlesManager;
