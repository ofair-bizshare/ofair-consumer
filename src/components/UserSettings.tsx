
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/useUserProfile';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Building, Phone, Mail, MapPin, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const UserSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { profile, loading: profileLoading, refetchProfile, updateProfile } = useUserProfile();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setPhone(profile.phone || '');
      setAddress(profile.address || '');
      setAvatarUrl(profile.profile_image || null);
    }
  }, [profile]);
  
  const handleSaveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      await updateProfile({
        name,
        phone,
        address
      });
      
      toast({
        title: "פרופיל עודכן",
        description: "פרטי הפרופיל שלך עודכנו בהצלחה",
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "שגיאה בעדכון פרופיל",
        description: "אירעה שגיאה בעת עדכון הפרופיל",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !user) {
      return;
    }
    
    try {
      setUploading(true);
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}-${Math.random()}.${fileExt}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      if (data) {
        // Update the profile with the new avatar URL
        await updateProfile({ profile_image: data.publicUrl });
        
        setAvatarUrl(data.publicUrl);
        
        toast({
          title: "תמונת פרופיל עודכנה",
          description: "תמונת הפרופיל שלך הועלתה בהצלחה",
        });
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "שגיאה בהעלאת תמונה",
        description: "אירעה שגיאה בעת העלאת תמונת הפרופיל",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };
  
  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">הגדרות משתמש</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>פרטי פרופיל</CardTitle>
            <CardDescription>עדכן את פרטי הפרופיל שלך</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                שם מלא
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <User size={18} />
                </span>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="הזן את שמך המלא"
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phone">
                טלפון
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Phone size={18} />
                </span>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="הזן את מספר הטלפון שלך"
                  className="rounded-l-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                דוא״ל
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <Mail size={18} />
                </span>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="rounded-l-none bg-gray-50"
                />
              </div>
              <p className="text-xs text-gray-500">
                לא ניתן לשנות את כתובת הדוא״ל
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="address">
                כתובת
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <MapPin size={18} />
                </span>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="הזן את כתובתך"
                  className="rounded-l-none"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile} 
              disabled={saving}
            >
              {saving ? 'שומר...' : 'שמור שינויים'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Avatar Card */}
        <Card>
          <CardHeader>
            <CardTitle>תמונת פרופיל</CardTitle>
            <CardDescription>העלה או עדכן את תמונת הפרופיל שלך</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={avatarUrl || undefined} />
              <AvatarFallback className="text-2xl">
                {name ? name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="w-full">
              <label 
                htmlFor="avatar-upload" 
                className="flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? 'מעלה...' : 'העלה תמונה'}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={uploading}
                className="sr-only"
              />
              <p className="mt-1 text-xs text-gray-500 text-center">
                PNG, JPG, GIF עד 2MB
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserSettings;
