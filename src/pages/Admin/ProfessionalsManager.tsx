import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { getProfessionals } from '@/services/professionals';
import { createProfessional, uploadProfessionalImage } from '@/services/admin';
import { ProfessionalInterface } from '@/types/dashboard';
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
import { Plus, Edit, Trash2, Star, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const professionalFormSchema = z.object({
  name: z.string().min(2, { message: 'שם חייב להכיל לפחות 2 תווים' }),
  profession: z.string().min(2, { message: 'מקצוע חייב להכיל לפחות 2 תווים' }),
  location: z.string().min(2, { message: 'מיקום חייב להכיל לפחות 2 תווים' }),
  specialties: z.string().min(2, { message: 'התמחויות חייבות להכיל לפחות 2 תווים' }),
  phoneNumber: z.string().min(9, { message: 'מספר טלפון חייב להכיל לפחות 9 תווים' }),
  about: z.string().min(20, { message: 'תיאור חייב להכיל לפחות 20 תווים' }),
  rating: z.number().min(0).max(5)
});

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

const ProfessionalsManager = () => {
  const [professionals, setProfessionals] = React.useState<ProfessionalInterface[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: '',
      profession: '',
      location: '',
      specialties: '',
      phoneNumber: '',
      about: '',
      rating: 5
    }
  });

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProfessionals();
      setProfessionals(data);
    } catch (error) {
      console.error('Error fetching professionals:', error);
      setError('אירעה שגיאה בטעינת בעלי המקצוע. אנא נסה שוב מאוחר יותר.');
      toast({
        title: "שגיאה בטעינת נתונים",
        description: "אירעה שגיאה בטעינת בעלי המקצוע",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onSubmit = async (data: ProfessionalFormValues) => {
    try {
      setUploading(true);
      setError(null);
      
      let imageUrl = 'https://via.placeholder.com/150';
      if (imageFile) {
        const uploadedUrl = await uploadProfessionalImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }
      
      const professional = {
        name: data.name,
        profession: data.profession,
        location: data.location,
        specialties: data.specialties.split(',').map(s => s.trim()),
        phoneNumber: data.phoneNumber,
        about: data.about,
        rating: data.rating,
        image: imageUrl
      };
      
      const result = await createProfessional(professional);
      
      if (result) {
        toast({
          title: "בעל מקצוע נוצר בהצלחה",
          description: `${data.name} נוסף למערכת`
        });
        
        form.reset();
        setImageFile(null);
        setDialogOpen(false);
        
        fetchData();
      } else {
        toast({
          title: "שגיאה ביצירת בעל מקצוע",
          description: "אירעה שגיאה ביצירת בעל מקצוע. אנא נסה שוב.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating professional:', error);
      setError('אירעה שגיאה ביצירת בעל מקצוע. אנא נסה שוב מאוחר יותר.');
      toast({
        title: "שגיאה ביצירת בעל מקצוע",
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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול בעלי מקצוע</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              הוסף בעל מקצוע
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>הוספת בעל מקצוע חדש</DialogTitle>
              <DialogDescription>
                מלא את הפרטים הבאים כדי להוסיף בעל מקצוע חדש למערכת
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>שם מלא</FormLabel>
                        <FormControl>
                          <Input placeholder="ישראל ישראלי" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="profession"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מקצוע</FormLabel>
                        <FormControl>
                          <Input placeholder="חשמלאי / שרברב / נגר" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>מיקום</FormLabel>
                        <FormControl>
                          <Input placeholder="תל אביב והמרכז" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>טלפון</FormLabel>
                        <FormControl>
                          <Input placeholder="05X-XXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="specialties"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>התמחויות</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="יש להפריד בפסיקים: תיקוני חשמל, התקנת מזגנים, ייעוץ" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>דירוג (0-5)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="5" 
                          step="0.1"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>אודות</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="תיאור מפורט של בעל המקצוע ושירותיו"
                          className="min-h-[120px]"
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
                    {uploading ? 'מעלה...' : 'הוסף בעל מקצוע'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>רשימת בעלי מקצוע</CardTitle>
          <CardDescription>ניהול בעלי המקצוע במערכת</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
            </div>
          ) : professionals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">לא נמצאו בעלי מקצוע</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                הוסף בעל מקצוע ראשון
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>שם</TableHead>
                  <TableHead>מקצוע</TableHead>
                  <TableHead>מיקום</TableHead>
                  <TableHead>דירוג</TableHead>
                  <TableHead>טלפון</TableHead>
                  <TableHead>פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {professionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell className="font-medium">{professional.name}</TableCell>
                    <TableCell>{professional.profession}</TableCell>
                    <TableCell>{professional.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{professional.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{professional.phoneNumber || 'אין מספר'}</TableCell>
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

export default ProfessionalsManager;
