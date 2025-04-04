import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { getProfessionals } from '@/services/professionals';
import { createProfessional, updateProfessional, deleteProfessional, uploadProfessionalImage } from '@/services/admin/professionals';
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
import { Plus, Edit, Trash2, Star, AlertCircle, Upload, Excel } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ProfessionalsExcelUploader from '@/components/admin/professionals/ProfessionalsExcelUploader';

const professionalFormSchema = z.object({
  name: z.string().min(2, { message: 'שם חייב להכיל לפחות 2 תווים' }),
  profession: z.string().min(2, { message: 'מקצוע חייב להכיל לפחות 2 תווים' }),
  location: z.string().min(2, { message: 'מיקום חייב להכיל לפחות 2 תווים' }),
  specialties: z.string().min(2, { message: 'התמחויות חייבות להכיל לפחות 2 תווים' }),
  phoneNumber: z.string().min(9, { message: 'מספר טלפון חייב להכיל לפחות 9 תווים' }),
  about: z.string().min(20, { message: 'תיאור חייב להכיל לפחות 20 תווים' }),
  rating: z.number().min(0).max(5),
  company_name: z.string().optional(),
  work_hours: z.string().optional(),
  certifications: z.string().optional(), 
  experience_years: z.number().min(0).optional()
});

type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

const ProfessionalsManager = () => {
  const [professionals, setProfessionals] = useState<ProfessionalInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<ProfessionalInterface | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
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
      rating: 5,
      company_name: '',
      work_hours: 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
      certifications: 'מוסמך מקצועי, בעל רישיון',
      experience_years: 5
    }
  });

  const fetchData = useCallback(async () => {
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
        description: "אירעה שגיאה בטעינת בעלי ה��קצוע",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  React.useEffect(() => {
    if (editingProfessional) {
      form.reset({
        name: editingProfessional.name,
        profession: editingProfessional.profession,
        location: editingProfessional.location,
        specialties: editingProfessional.specialties?.join(', ') || '',
        phoneNumber: editingProfessional.phoneNumber || '',
        about: editingProfessional.about || '',
        rating: editingProfessional.rating || 5,
        company_name: editingProfessional.company_name || '',
        work_hours: editingProfessional.work_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
        certifications: editingProfessional.certifications?.join(', ') || 'מוסמך מקצועי, בעל רישיון',
        experience_years: editingProfessional.experience_years || 5
      });
    } else {
      form.reset({
        name: '',
        profession: '',
        location: '',
        specialties: '',
        phoneNumber: '',
        about: '',
        rating: 5,
        company_name: '',
        work_hours: 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
        certifications: 'מוסמך מקצועי, בעל רישיון',
        experience_years: 5
      });
    }
  }, [editingProfessional, form]);

  const onSubmit = async (data: ProfessionalFormValues) => {
    try {
      setUploading(true);
      setError(null);
      
      let imageUrl = editingProfessional?.image || 'https://via.placeholder.com/150';
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
        image: imageUrl,
        company_name: data.company_name,
        work_hours: data.work_hours,
        certifications: data.certifications?.split(',').map(s => s.trim()) || [],
        experience_years: data.experience_years
      };
      
      let result = false;
      
      if (editingProfessional) {
        result = await updateProfessional(editingProfessional.id, professional);
        if (result) {
          toast({
            title: "בעל מקצוע עודכן בהצלחה",
            description: `${data.name} עודכן במערכת`
          });
        }
      } else {
        result = await createProfessional(professional);
        if (result) {
          toast({
            title: "בעל מקצוע נוצר בהצלחה",
            description: `${data.name} נוסף למערכת`
          });
        }
      }
      
      if (result) {
        form.reset();
        setImageFile(null);
        setDialogOpen(false);
        setEditingProfessional(null);
        fetchData();
      } else {
        toast({
          title: editingProfessional ? "שגיאה בעדכון בעל מקצוע" : "שגיאה ביצירת בעל מקצוע",
          description: "אירעה שגיאה. אנא נסה שוב.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating/updating professional:', error);
      setError('אירעה שגיאה. אנא נסה שוב מאוחר יותר.');
      toast({
        title: editingProfessional ? "שגיאה בעדכון בעל מקצוע" : "שגיאה ביצירת בעל מקצוע",
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
  
  const handleEditProfessional = (professional: ProfessionalInterface) => {
    setEditingProfessional(professional);
    setDialogOpen(true);
  };
  
  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את בעל המקצוע?')) {
      try {
        const result = await deleteProfessional(id);
        if (result) {
          toast({
            title: "בעל מקצוע נמחק בהצלחה",
            description: "בעל המקצוע הוסר מהמערכת"
          });
          fetchData();
        } else {
          toast({
            title: "שגיאה במחיקת בעל מקצוע",
            description: "אירעה שגיאה במחיקת בעל המקצוע",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error deleting professional:', error);
        toast({
          title: "שגיאה במחיקת בעל מקצוע",
          description: "אירעה שגיאה בלתי צפויה",
          variant: "destructive"
        });
      }
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProfessional(null);
    form.reset();
    setImageFile(null);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">ניהול בעלי מקצוע</h1>
        
        <div className="flex items-center gap-2">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="ml-2 h-4 w-4" />
                הוסף בעל מקצוע
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{editingProfessional ? 'עריכת בעל מקצוע' : 'הוספת בעל מקצוע חדש'}</DialogTitle>
                <DialogDescription>
                  {editingProfessional 
                    ? 'ערוך את פרטי בעל המקצוע'
                    : 'מלא את הפרטים הבאים כדי להוסיף בעל מקצוע חדש למערכת'}
                </DialogDescription>
              </DialogHeader>
              
              <ScrollArea className="max-h-[calc(90vh-120px)]">
                <div className="p-4">
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
                          name="company_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>שם חברה (אם קיים)</FormLabel>
                              <FormControl>
                                <Input placeholder="שם החברה" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
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
                        
                        <FormField
                          control={form.control}
                          name="experience_years"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>שנות ניסיון</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                                />
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
                        name="certifications"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>תעודות והסמכות</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="יש להפריד בפסיקים: מוסמך מקצועי, בעל רישיון" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="work_hours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>שעות פעילות</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="לדוגמה: ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00" 
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
                          onClick={handleCloseDialog}
                          className="mr-2"
                          disabled={uploading}
                        >
                          ביטול
                        </Button>
                        <Button type="submit" disabled={uploading}>
                          {uploading ? 'מעלה...' : editingProfessional ? 'עדכן בעל מקצוע' : 'הוסף בעל מקצוע'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>שגיאה</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list" className="flex items-center">
            <Star className="ml-2 h-4 w-4" />
            רשימת בעלי מקצוע
          </TabsTrigger>
          <TabsTrigger value="upload" className="flex items-center">
            <Excel className="ml-2 h-4 w-4" />
            העלאה מ-Excel
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
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
                            <Star className="h-4 w-4 text-yellow-400 ml-1" />
                            <span>{professional.rating}</span>
                          </div>
                        </TableCell>
                        <TableCell>{professional.phoneNumber || professional.phone_number || 'אין מספר'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEditProfessional(professional)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteProfessional(professional.id)}
                            >
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
        </TabsContent>
        
        <TabsContent value="upload">
          <ProfessionalsExcelUploader onUploaded={fetchData} />
          
          <div className="mt-6 bg-blue-50 p-4 rounded border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">פורמט קובץ Excel לייבוא</h3>
            <p className="text-sm text-blue-600 mb-2">
              הקובץ צריך להכיל את העמודות הבאות (עמודות מסומנות ב-* הן חובה):
            </p>
            <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
              <li>name* - שם בעל המקצוע</li>
              <li>profession* - תחום מקצועי</li>
              <li>location* - אזור עבודה</li>
              <li>phoneNumber* - מספר טלפון</li>
              <li>specialties - התמחויות (מופרדות בפסיקים)</li>
              <li>about - תיאור</li>
              <li>rating - דירוג (מספר בין 0-5)</li>
              <li>company_name - שם חברה</li>
              <li>work_hours - שעות עבודה</li>
              <li>certifications - תעודות והסמכות (מופרדות בפסיקים)</li>
              <li>experience_years - שנות ניסיון</li>
            </ul>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ProfessionalsManager;
