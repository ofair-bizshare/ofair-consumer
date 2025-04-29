
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, Gift, Upload } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileCardProps {
  isAdmin: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ isAdmin }) => {
  const { user } = useAuth();
  const { profile, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const [profileImage, setProfileImage] = useState<string | null>(profile?.profile_image || null);
  const [isSavingImage, setIsSavingImage] = useState(false);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsSavingImage(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      try {
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('images');
          
        if (bucketError && bucketError.message.includes('The resource was not found')) {
          console.log('Creating images bucket...');
          const { error: createBucketError } = await supabase.storage
            .createBucket('images', { public: true });
            
          if (createBucketError) throw createBucketError;
        }
        
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        const { data: publicURL } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        if (!publicURL) throw new Error('Failed to get public URL');
        
        console.log("Image uploaded, public URL:", publicURL.publicUrl);
        
        await updateProfile({ profile_image: publicURL.publicUrl });
        
        setProfileImage(publicURL.publicUrl);
        
        toast({
          title: "תמונת פרופיל עודכנה",
          description: "תמונת הפרופיל שלך עודכנה בהצלחה",
          variant: "default",
        });
      } catch (storageError) {
        console.error('Error with Supabase storage:', storageError);
        
        const reader = new FileReader();
        reader.onloadend = function() {
          const base64data = reader.result as string;
          
          try {
            localStorage.setItem(`profileImage-${user.id}`, base64data);
            setProfileImage(base64data);
            updateProfile({ profile_image: base64data });
            
            toast({
              title: "תמונת פרופיל נשמרה מקומית",
              description: "התמונה נשמרה מקומית בלבד",
              variant: "default",
            });
          } catch (localStorageError) {
            console.error('Error saving to localStorage:', localStorageError);
            throw localStorageError;
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        title: "שגיאה בהעלאת תמונה",
        description: "אירעה שגיאה בהעלאת תמונת הפרופיל",
        variant: "destructive",
      });
    } finally {
      setIsSavingImage(false);
    }
  };

  return (
    <div className="glass-card p-4 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between">
        <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-0">
          <div className="relative mb-4 sm:mb-0 sm:ml-6">
            <div className="w-20 h-20 sm:w-16 sm:h-16">
              <Avatar className="w-full h-full">
                {profileImage ? (
                  <AvatarImage 
                    src={profileImage} 
                    alt="תמונת פרופיל" 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    <UserCircle className="w-10 h-10" />
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div className="absolute bottom-0 right-0">
              <label htmlFor="profile-upload" className="cursor-pointer">
                <div className="bg-blue-500 rounded-full p-1 text-white hover:bg-blue-600 transition-colors">
                  <Upload size={16} />
                </div>
                <input 
                  type="file" 
                  id="profile-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfileImageUpload}
                  disabled={isSavingImage}
                />
              </label>
            </div>
          </div>
          <div className="text-center sm:text-right">
            <h2 className="text-xl font-semibold">ברוך הבא, {profile?.name || user?.user_metadata?.name || user?.email}!</h2>
            <p className="text-gray-600">שמחים לראות אותך שוב</p>
          </div>
        </div>
        <div className="flex flex-col items-center sm:items-end gap-3">
          <div className="flex items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg">
            <Gift className="ml-2 h-5 w-5" aria-hidden="true" />
            <div>
              <div className="text-sm opacity-80">הקרדיט שלי</div>
              <div className="font-bold">250 ₪</div>
            </div>
          </div>
          
          {isAdmin && (
            <Link 
              to="/admin" 
              className="text-sm flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              <span>כניסה לממשק ניהול</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
