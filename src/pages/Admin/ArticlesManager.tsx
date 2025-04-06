
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
import { articleCategoryOptions } from '@/components/admin/articles/articleSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ArticlesManager = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleInterface | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
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
      applyFilters(data || [], categoryFilter);
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

  const applyFilters = (articlesData: ArticleInterface[], category: string) => {
    let result = [...articlesData];
    
    if (category !== 'all') {
      result = result.filter(article => article.category === category);
    }
    
    setFilteredArticles(result);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
    applyFilters(articles, value);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Create sample articles for each category
  const createSampleArticles = async () => {
    if (!articles || articles.length > 0) {
      // Don't create sample articles if we already have articles
      return;
    }

    try {
      setLoading(true);
      
      const sampleArticles = [];
      
      // Generate 2 articles for each category
      for (const category of articleCategoryOptions) {
        const categoryName = category.label;
        const categoryValue = category.value;
        
        // Article 1
        sampleArticles.push({
          title: `מדריך מקיף ל${categoryName}`,
          summary: `מדריך מקיף לתחום ה${categoryName}. כל מה שצריך לדעת לפני שמתחילים עבודה עם בעל מקצוע בתחום.`,
          content: `<h2>מדריך מקיף לתחום ה${categoryName}</h2>
          <p>בחירת בעל מקצוע טוב בתחום ה${categoryName} היא משימה חשובה שיכולה להשפיע על איכות העבודה ועל התוצאה הסופית. במאמר זה נסקור את הנקודות החשובות שיעזרו לכם לבחור בעל מקצוע מתאים.</p>
          <h3>מה לחפש בבעל מקצוע</h3>
          <ul>
            <li>ניסיון וותק בתחום</li>
            <li>המלצות מלקוחות קודמים</li>
            <li>תעודות והסמכות רלוונטיות</li>
            <li>רישיון עבודה בתוקף</li>
            <li>ביטוח מקצועי</li>
          </ul>
          <h3>שאלות שכדאי לשאול</h3>
          <p>לפני שסוגרים עם בעל מקצוע, חשוב לשאול מספר שאלות מקדימות:</p>
          <ul>
            <li>האם יש אחריות על העבודה?</li>
            <li>כמה זמן תימשך העבודה?</li>
            <li>מה העלות המשוערת?</li>
            <li>האם העלות כוללת חומרים?</li>
          </ul>
          <p>זכרו תמיד לקבל הצעת מחיר מסודרת בכתב לפני תחילת העבודה!</p>`,
          author: 'צוות oFair',
          published: true,
          category: categoryValue,
          image: await getCategoryImage(categoryValue, 1)
        });
        
        // Article 2
        sampleArticles.push({
          title: `טיפים לבחירת ${categoryName} מקצועי`,
          summary: `טיפים פרקטיים לבחירת ${categoryName} מקצועי. כיצד להימנע מטעויות נפוצות ולבחור את בעל המקצוע המתאים ביותר.`,
          content: `<h2>טיפים לבחירת ${categoryName} מקצועי</h2>
          <p>בחירת ${categoryName} מקצועי ואמין היא משימה חשובה. במאמר זה נספק לכם מספר טיפים שיעזרו לכם לבחור נכון.</p>
          <h3>בדיקות מקדימות</h3>
          <ul>
            <li>בדקו מה אומרים עליו לקוחות קודמים</li>
            <li>בקשו לראות עבודות קודמות</li>
            <li>ודאו שיש לו את כל הרישיונות וההסמכות הנדרשים</li>
            <li>השוו מחירים בין מספר בעלי מקצוע</li>
          </ul>
          <h3>רגע לפני שסוגרים</h3>
          <p>לפני שסוגרים עם בעל מקצוע, ודאו שיש בידיכם:</p>
          <ul>
            <li>הצעת מחיר מפורטת בכתב</li>
            <li>לוח זמנים מוסכם</li>
            <li>תנאי תשלום ברורים</li>
            <li>הבנה מדויקת של היקף העבודה</li>
          </ul>
          <p>תכנון מדויק וליווי בעל המקצוע במהלך העבודה יסייעו לכם להגיע לתוצאה המיטבית!</p>`,
          author: 'צוות oFair',
          published: true,
          category: categoryValue,
          image: await getCategoryImage(categoryValue, 2)
        });
      }

      // Add the sample articles to the database
      for (const article of sampleArticles) {
        await createArticle(article);
      }

      toast({
        title: 'מאמרים לדוגמה נוצרו',
        description: 'נוצרו מאמרים לדוגמה לכל הקטגוריות',
      });

      // Fetch the articles again
      await fetchArticles();
    } catch (error) {
      console.error('Error creating sample articles:', error);
      toast({
        title: 'שגיאה ביצירת מאמרים לדוגמה',
        description: 'אירעה שגיאה ביצירת המאמרים לדוגמה',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Get image for specific category
  const getCategoryImage = async (category: string, index: number): Promise<string> => {
    // Define relevant images for each category
    const categoryImages = {
      'plumbing': [
        'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80'
      ],
      'electrical': [
        'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1558449033-fdc9ecfbc80e?auto=format&fit=crop&q=80'
      ],
      'renovation': [
        'https://images.unsplash.com/photo-1581165825586-bcceb7539f46?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1493606278519-11aa9f86e40a?auto=format&fit=crop&q=80'
      ],
      'gardening': [
        'https://images.unsplash.com/photo-1617576683096-00fc8eecb3af?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80'
      ],
      'cleaning': [
        'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80'
      ],
      'moving': [
        'https://images.unsplash.com/photo-1600518863233-5606e8122528?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80'
      ],
      'painting': [
        'https://images.unsplash.com/photo-1595815771614-ade501d22bd4?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?auto=format&fit=crop&q=80'
      ],
      'locksmith': [
        'https://images.unsplash.com/photo-1599508704512-2f19efd1e35f?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?auto=format&fit=crop&q=80'
      ],
      'ac': [
        'https://images.unsplash.com/photo-1596557072152-c2edcb6c7b04?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1654055802553-77e035ff08b4?auto=format&fit=crop&q=80'
      ],
      'general': [
        'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1572250383938-ed8c501a29d9?auto=format&fit=crop&q=80'
      ]
    };

    // Return the appropriate image or a default
    if (categoryImages[category] && categoryImages[category][index-1]) {
      return categoryImages[category][index-1];
    } else {
      return `https://via.placeholder.com/800x400?text=${encodeURIComponent(category)}`;
    }
  };

  useEffect(() => {
    // After fetching articles, create sample articles if needed
    if (!loading && articles.length === 0) {
      createSampleArticles();
    }
  }, [loading]);

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
          <Plus className="ml-2 h-4 w-4" />
          הוסף מאמר
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center">
          <Filter className="ml-2 h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium ml-2">סינון לפי קטגוריה:</span>
        </div>
        <Select value={categoryFilter} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר קטגוריה" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">הכל</SelectItem>
            {articleCategoryOptions.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
      ) : filteredArticles.length === 0 ? (
        <ArticlesEmptyState onAddArticle={() => setDialogOpen(true)} />
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
