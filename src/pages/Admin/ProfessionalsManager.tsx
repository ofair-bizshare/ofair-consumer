
import React, { useState, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { getProfessionals } from '@/services/professionals';
import { createProfessional, updateProfessional, deleteProfessional, uploadProfessionalImage } from '@/services/admin/professionals';
import { ProfessionalInterface } from '@/services/professionals/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, AlertCircle, FileSpreadsheet, Star } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Import our refactored components
import ProfessionalForm, { ProfessionalFormValues } from '@/components/admin/professionals/ProfessionalForm';
import ProfessionalsList from '@/components/admin/professionals/ProfessionalsList';
import ProfessionalsExcelUploader from '@/components/admin/professionals/ProfessionalsExcelUploader';

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

  const handleSubmit = async (data: ProfessionalFormValues) => {
    try {
      setUploading(true);
      setError(null);
      
      // Log the beginning of the submission process
      console.log('Starting professional submission process', { isEditing: !!editingProfessional, data });
      
      let imageUrl = editingProfessional?.image || 'https://via.placeholder.com/150';
      if (imageFile) {
        console.log('Uploading professional image');
        const uploadedUrl = await uploadProfessionalImage(imageFile);
        console.log('Image upload result:', uploadedUrl);
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
      
      console.log('Professional data prepared:', professional);
      
      let result = false;
      
      if (editingProfessional) {
        console.log('Updating existing professional:', editingProfessional.id);
        result = await updateProfessional(editingProfessional.id, professional);
        console.log('Update professional result:', result);
        
        if (result) {
          toast({
            title: "בעל מקצוע עודכן בהצלחה",
            description: `${data.name} עודכן במערכת`
          });
        }
      } else {
        console.log('Creating new professional');
        result = await createProfessional(professional);
        console.log('Create professional result:', result);
        
        if (result) {
          toast({
            title: "בעל מקצוע נוצר בהצלחה",
            description: `${data.name} נוסף למערכת`
          });
        }
      }
      
      if (result) {
        setImageFile(null);
        setDialogOpen(false);
        setEditingProfessional(null);
        await fetchData(); // Refetch professionals after successful creation/update
      } else {
        throw new Error('Operation failed with no specific error');
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
              
              <ProfessionalForm 
                professional={editingProfessional} 
                uploading={uploading}
                onSubmit={handleSubmit}
                onCancel={handleCloseDialog}
                onImageChange={handleImageChange}
              />
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
            <FileSpreadsheet className="ml-2 h-4 w-4" />
            העלאה מ-Excel
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list">
          <ProfessionalsList
            professionals={professionals}
            loading={loading}
            onEdit={handleEditProfessional}
            onDelete={handleDeleteProfessional}
            onAdd={() => setDialogOpen(true)}
          />
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
