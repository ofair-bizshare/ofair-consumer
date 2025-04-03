
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { fetchArticles, uploadArticleImage } from '@/services/articles';
import { createArticle } from '@/services/admin';
import { ArticleInterface } from '@/types/dashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, FileText, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const articleFormSchema = z.object({
  title: z.string().min(5, { message: 'כותרת חייבת להכיל לפחות 5 תווים' }),
  summary: z.string().min(20, { message: 'תקציר חייב להכיל לפחות 20 תווים' }),
  content: z.string().min(50, { message: 'תוכן חייב להכיל לפחות 50 תווים' }),
  author: z.string().min(2, { message: 'שם המחבר חייב להכיל לפחות 2 תווים' }),
  published: z.boolean().default(true)
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

const ArticlesManager = () => {
  const [articles, setArticles] = React.useState<ArticleInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      summary: '',
      content: '',
      author: '',
      published: true
    }
  });

  const fetchData = React.useCallback(async () => {
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

  const onSubmit = async (data: ArticleFormValues) => {
    try {
      setUploading(true);
      
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        const uploadedUrl = await uploadArticleImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      // Create article
      const article = {
        title: data.title,
        summary: data.summary,
        content: data.content,
        author: data.author,
        published: data.published,
        image: imageUrl
      };
      
      const result = await createArticle(article);
      
      if (result) {
        toast({
          title: "מאמר נוצר בהצלחה",
          description: `המאמר "${data.title}" נוסף בהצלחה`
        });
        
        // Reset form and close dialog
        form.reset();
        setImageFile(null);
        setDialogOpen(false);
        
        // Refresh the list
        fetchData();
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "שגיאה ביצירת מאמר",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>כותרת</FormLabel>
                      <FormControl>
                        <Input placeholder="כותרת המאמר" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="author"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מחבר</FormLabel>
                        <FormControl>
                          <Input placeholder="שם המחבר" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="published"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>פרסום</FormLabel>
                          <FormDescription>
                            האם לפרסם את המאמר באתר
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormItem>
                  <FormLabel>תמונה</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
                
                <FormField
                  control={form.control}
                  name="summary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תקציר</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="תקציר קצר של המאמר (יוצג בתצוגת הרשימה)"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>תוכן</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="תוכן המאמר המלא"
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end mt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                    className="mr-2"
                    disabled={uploading}
                  >
                    ביטול
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'מעלה...' : 'הוסף מאמר'}
                  </Button>
                </div>
              </form>
            </Form>
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
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">לא נמצאו מאמרים</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                הוסף מאמר ראשון
              </Button>
            </div>
          ) : (
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
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default ArticlesManager;
