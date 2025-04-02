
import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, Gift, Upload } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileInterface } from '@/types/dashboard';
import { useUserProfile } from '@/hooks/useUserProfile';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const location = useLocation();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState(false);
  
  useEffect(() => {
    // Check if we need to scroll to a specific section
    if (location.hash) {
      const id = location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    }

    // Set profile image if available in profile
    if (profile?.profile_image) {
      setProfileImage(profile.profile_image);
    }
  }, [location, profile]);

  // If still loading, show loading spinner
  if (loading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If not logged in and not loading, redirect to login
  if (!user && !loading) {
    return <Navigate to="/login" />;
  }

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsSavingImage(true);
      
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      try {
        // Create the bucket if it doesn't exist
        const { data: bucketData, error: bucketError } = await supabase.storage
          .getBucket('images');
          
        if (bucketError && bucketError.message.includes('The resource was not found')) {
          console.log('Creating images bucket...');
          const { error: createBucketError } = await supabase.storage
            .createBucket('images', { public: true });
            
          if (createBucketError) throw createBucketError;
        }
        
        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: publicURL } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);
        
        if (!publicURL) throw new Error('Failed to get public URL');
        
        console.log("Image uploaded, public URL:", publicURL.publicUrl);
        
        // 2. Update user profile with new image URL
        await updateProfile({ profile_image: publicURL.publicUrl });
        
        // 3. Update local state
        setProfileImage(publicURL.publicUrl);
        
        toast({
          title: "תמונת פרופיל עודכנה",
          description: "תמונת הפרופיל שלך עודכנה בהצלחה",
          variant: "default",
        });
      } catch (storageError) {
        console.error('Error with Supabase storage:', storageError);
        
        // Fallback to localStorage if Supabase storage fails
        const reader = new FileReader();
        reader.onloadend = function() {
          const base64data = reader.result as string;
          
          // Save to localStorage (with size limits in mind)
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
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>האזור האישי שלי | oFair - ניהול הבקשות, ההצעות וההפניות שלך</title>
        <meta name="description" content="צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת, ההפניות שלך וסטטוס התקדמות הפרויקטים שלך באזור האישי." />
        <meta name="keywords" content="אזור אישי, בקשות, הצעות מחיר, הפניות, ניהול פרויקטים, בעלי מקצוע, סטטוס פרויקט" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">האזור</span> האישי שלי
            </h1>
            <p className="text-gray-600">
              צפה בבקשות הקודמות שלך, הצעות המחיר שקיבלת והסטטוס שלהן
            </p>
          </div>
          
          {user && (
            <div className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative ml-6"> {/* Changed from mr-6 to ml-6 for RTL */}
                    {profileImage ? (
                      <img 
                        src={profileImage} 
                        alt="תמונת פרופיל" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                      />
                    ) : (
                      <div className="bg-blue-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
                        <UserCircle size={36} className="text-blue-700" />
                      </div>
                    )}
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
                  <div className="ml-4"> {/* Changed from mr-4 to ml-4 for RTL */}
                    <h2 className="text-xl font-semibold">ברוך הבא, {profile?.name || user.user_metadata?.name || user.email}!</h2>
                    <p className="text-gray-600">שמחים לראות אותך שוב</p>
                  </div>
                </div>
                <div className="flex items-center bg-gradient-to-r from-teal-500 to-blue-600 text-white px-4 py-2 rounded-lg">
                  <Gift className="ml-2 h-5 w-5" aria-hidden="true" />
                  <div>
                    <div className="text-sm opacity-80">הקרדיט שלי</div>
                    <div className="font-bold">250 ₪</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div id="requests-section">
            <DashboardTabs isLoggedIn={!!user} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
