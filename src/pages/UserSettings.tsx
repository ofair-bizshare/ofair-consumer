
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { UserCircle, User, Bell, Loader2 } from 'lucide-react';
import NotificationPreferences from '@/components/settings/NotificationPreferences';

const UserSettings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserProfile();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile({
        name: formData.name,
        phone: formData.phone
      });
      
      toast({
        title: "הפרופיל עודכן",
        description: "פרטי הפרופיל עודכנו בהצלחה",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "שגיאה בעדכון הפרופיל",
        description: "אירעה שגיאה בעדכון פרטי הפרופיל",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>הגדרות חשבון | oFair</title>
        <meta name="description" content="עדכן את פרטי החשבון שלך והגדר את העדפות ההתראות שלך" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">הגדרות</span> חשבון
            </h1>
            <p className="text-gray-600">
              עדכן את פרטי החשבון שלך והגדר את העדפות ההתראות שלך
            </p>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-6 w-full max-w-md">
              <TabsTrigger value="profile" className="flex-1 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                <User className="ml-2 h-4 w-4" />
                פרטי חשבון
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1 data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">
                <Bell className="ml-2 h-4 w-4" />
                התראות
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-0">
              <div className="grid grid-cols-1 gap-8">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">פרטי פרופיל</CardTitle>
                    <CardDescription>
                      כאן תוכל לעדכן את הפרטים האישיים שלך
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-shrink-0 flex flex-col items-center gap-2">
                          <Avatar className="h-24 w-24">
                            {profile?.profile_image ? (
                              <AvatarImage src={profile.profile_image} alt={profile.name || 'תמונת פרופיל'} />
                            ) : (
                              <AvatarFallback className="bg-blue-100">
                                <UserCircle className="h-12 w-12 text-blue-600" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate('/dashboard')}
                          >
                            שנה תמונה
                          </Button>
                        </div>
                        
                        <div className="flex-1 space-y-4 w-full">
                          <div className="space-y-2">
                            <Label htmlFor="name">שם מלא</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email">דוא"ל</Label>
                            <Input
                              id="email"
                              name="email"
                              value={formData.email}
                              disabled
                              className="bg-gray-50"
                            />
                            <p className="text-xs text-gray-500">לא ניתן לשנות את כתובת הדוא"ל</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone">טלפון</Label>
                            <Input
                              id="phone"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="מספר טלפון"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <CardFooter className="px-0 pb-0 pt-6 flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "שומר..." : "שמור שינויים"}
                        </Button>
                      </CardFooter>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <NotificationPreferences />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserSettings;
