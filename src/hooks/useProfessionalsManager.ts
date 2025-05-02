
import { useState, useCallback, useEffect } from 'react';
import { useToast } from './use-toast';
import { ProfessionalInterface } from '@/services/professionals/types';
import { ProfessionalFormValues } from '@/components/admin/professionals/ProfessionalForm';
import { 
  createProfessional, 
  updateProfessional, 
  deleteProfessional, 
  uploadProfessionalImage 
} from '@/services/admin/professionals';
import { checkAndCreateRequiredBuckets, listBuckets } from '@/services/admin/utils/storageUtils';
import { supabase } from '@/integrations/supabase/client';
import { getProfessionalFromData } from '@/services/professionals/professionalUtils';

export const useProfessionalsManager = () => {
  const [professionals, setProfessionals] = useState<ProfessionalInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfessional, setEditingProfessional] = useState<ProfessionalInterface | null>(null);
  const [activeTab, setActiveTab] = useState<string>('list');
  const [bucketStatus, setBucketStatus] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // Initialize storage buckets on component mount
  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log('Checking storage buckets for professionals...');
        const buckets = await listBuckets();
        console.log('Available storage buckets:', buckets);
        
        const hasProfessionals = buckets.some(bucket => 
          bucket.toLowerCase() === 'professionals');
        const hasArticles = buckets.some(bucket => 
          bucket.toLowerCase() === 'articles');
        const hasImages = buckets.some(bucket => 
          bucket.toLowerCase() === 'images');
        
        setBucketStatus({
          professionals: hasProfessionals,
          articles: hasArticles,
          images: hasImages
        });
        
        if (!hasProfessionals || !hasArticles || !hasImages) {
          console.log('Some required buckets are missing, initializing...');
          const bucketStatus = await checkAndCreateRequiredBuckets();
          console.log('Storage buckets status:', bucketStatus);
          setBucketStatus(bucketStatus);
        }
      } catch (error) {
        console.error('Error checking storage buckets:', error);
      }
    };
    
    initStorage();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching professionals data...');
      
      // Use direct Supabase query instead of the getProfessionals service
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Supabase error when fetching professionals:', error);
        throw error;
      }
      
      console.log('Professionals data fetched:', data?.length);
      
      // Transform the data to ensure it matches the ProfessionalInterface
      const professionalData = (data || []).map(item => getProfessionalFromData(item));
      setProfessionals(professionalData);
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (data: ProfessionalFormValues) => {
    try {
      setUploading(true);
      setError(null);
      
      // Log the beginning of the submission process
      console.log('Starting professional submission process', { isEditing: !!editingProfessional, data });
      
      let imageUrl = editingProfessional?.image || editingProfessional?.image_url || 'https://via.placeholder.com/150';
      
      if (imageFile) {
        console.log('Uploading professional image...');
        try {
          const uploadedUrl = await uploadProfessionalImage(imageFile);
          console.log('Image upload result:', uploadedUrl);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
          }
        } catch (imageError) {
          console.error('Error uploading image:', imageError);
          toast({
            title: "שגיאה בהעלאת תמונה",
            description: "המשך בתהליך עם תמונה קודמת או תמונת ברירת מחדל",
            variant: "warning"
          });
          // Continue with the default image if upload fails
        }
      }
      
      // Convert specialties and certifications from comma-separated strings to arrays
      const specialtiesArray = data.specialties.split(',').map(s => s.trim());
      const certificationsArray = data.certifications ? data.certifications.split(',').map(s => s.trim()) : [];
      
      // Prepare professional data with all required fields
      const professional = {
        name: data.name,
        profession: data.profession,
        location: data.location,
        city: data.location, // Explicitly set city to location
        specialties: specialtiesArray,
        phone_number: data.phone_number,
        phoneNumber: data.phone_number, // Add both field names for compatibility
        about: data.about,
        rating: data.rating,
        image: imageUrl,
        image_url: imageUrl, // Add image_url for compatibility
        company_name: data.company_name || '',
        work_hours: data.work_hours || '',
        certifications: certificationsArray,
        experience_years: data.experience_years || 0,
        reviews_count: editingProfessional?.reviews_count || 0,
        created_at: editingProfessional?.created_at || new Date().toISOString(),
        specialty: specialtiesArray[0] || '' // Use first specialty
      };
      
      console.log('Professional data prepared:', professional);
      
      try {
        let result: ProfessionalInterface | null = null;
        
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
      } catch (error: any) {
        console.error('Error creating/updating professional:', error);
        setError(error.message || 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.');
        toast({
          title: editingProfessional ? "שגיאה בעדכון בעל מקצוע" : "שגיאה ביצירת בעל מקצוע",
          description: error.message || "אירעה שגיאה בלתי צפויה",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error in professional submission workflow:', error);
      setError(error.message || "אירעה שגיאה בלתי צפויה. אנא נסה שוב מאוחר יותר.");
      toast({
        title: editingProfessional ? "שגיאה בעדכון בעל מקצוע" : "שגיאה ביצירת בעל מקצוע",
        description: error.message || "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image file selected:', file.name);
      
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "קובץ גדול מדי",
          description: "גודל הקובץ חייב להיות עד 10MB",
          variant: "destructive"
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "סוג קובץ לא תקין",
          description: "נא לבחור קובץ תמונה (PNG, JPG, WEBP)",
          variant: "destructive"
        });
        return;
      }
      
      setImageFile(file);
    }
  };
  
  const handleEditProfessional = (professional: ProfessionalInterface) => {
    console.log('Edit professional:', professional.id);
    setEditingProfessional(professional);
    setDialogOpen(true);
  };
  
  const handleDeleteProfessional = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את בעל המקצוע?')) {
      try {
        console.log('Deleting professional:', id);
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
            description: "אירעה שגיאה במחיקת בעל מקצוע",
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

  return {
    professionals,
    loading,
    dialogOpen,
    setDialogOpen,
    imageFile,
    uploading,
    error,
    editingProfessional,
    activeTab,
    setActiveTab,
    bucketStatus,
    handleSubmit,
    handleImageChange,
    handleEditProfessional,
    handleDeleteProfessional,
    handleCloseDialog,
    fetchData
  };
};
