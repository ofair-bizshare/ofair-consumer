
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ProfessionalInterface } from '@/services/professionals/types';
import { createProfessional, updateProfessional, deleteProfessional, uploadProfessionalImage } from '@/services/admin/professionals';
import { supabase } from '@/integrations/supabase/client';
import { getProfessionalFromData } from '@/services/professionals/professionalUtils';
import { ProfessionalFormValues } from '@/components/admin/professionals/ProfessionalForm';

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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching professionals data...');
      
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

  const handleSubmit = async (data: ProfessionalFormValues) => {
    try {
      setUploading(true);
      setError(null);
      
      // Log the beginning of the submission process
      console.log('Starting professional submission process', { isEditing: !!editingProfessional, data });
      
      let imageUrl = editingProfessional?.image || 'https://via.placeholder.com/150';
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
          // Continue with the default image if upload fails
        }
      }
      
      // Prepare professional data with all required fields
      const professional = {
        name: data.name,
        profession: data.profession,
        location: data.location,
        city: data.location, // Explicitly set city to location
        specialties: data.specialties.split(',').map(s => s.trim()),
        phone_number: data.phoneNumber, // Use phone_number instead of phoneNumber
        about: data.about,
        rating: data.rating,
        image: imageUrl,
        image_url: imageUrl, // Add image_url for compatibility
        company_name: data.company_name || '',
        work_hours: data.work_hours || '',
        certifications: data.certifications?.split(',').map(s => s.trim()) || [],
        experience_years: data.experience_years || 0,
        reviews_count: editingProfessional?.reviews_count || 0,
        created_at: editingProfessional?.created_at || new Date().toISOString(),
        specialty: data.specialties.split(',')[0]?.trim() || '' // Use first specialty
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
    setBucketStatus,
    fetchData,
    handleSubmit,
    handleImageChange,
    handleEditProfessional,
    handleDeleteProfessional,
    handleCloseDialog
  };
};
