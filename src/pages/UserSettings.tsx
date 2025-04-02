
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Bell, Lock, Shield, Check, AlertCircle, Smartphone, Key, Clock, FileText, Globe, Mail, BookOpen } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileInterface } from '@/types/dashboard';
import { useUserProfile } from '@/hooks/useUserProfile';

const UserSettings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfileInterface | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Notifications and settings (keep as state as these might not be stored in DB yet)
  const [userData, setUserData] = useState({
    notifications: {
      email: true,
      sms: false,
      newQuotes: true,
      marketing: false,
      appUpdates: true,
      statusUpdates: true,
      securityAlerts: true,
      weeklyDigest: false
    },
    security: {
      twoFactorAuth: false,
      loginNotifications: true,
      passwordUpdates: true,
      securityLog: []
    },
    privacy: {
      showProfile: true,
      allowDataCollection: true,
      showActivity: false,
      dataSharing: false,
      locationTracking: false,
      thirdPartyAnalytics: true
    }
  });

  // Fetch user profile data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserProfile = async () => {
      try {
        setLoadingProfile(true);
        
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          setUserProfile(data);
          // Update form data with profile data
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          title: "שגיאה בטעינת פרופיל",
          description: "אירעה שגיאה בטעינת נתוני הפרופיל",
          variant: "destructive",
        });
      } finally {
        setLoadingProfile(false);
      }
    };
    
    fetchUserProfile();
  }, [user, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      // Update user profile in database
      const { error } = await supabase
        .from('user_profiles')
        .update({
          name: formData.name,
          phone: formData.phone,
          address: formData.address
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update local state
      setUserProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...formData };
      });
      
      toast({
        title: "הפרופיל עודכן בהצלחה",
        description: "השינויים שביצעת נשמרו",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "שגיאה בעדכון פרופיל",
        description: "אירעה שגיאה בעדכון הפרופיל",
        variant: "destructive",
      });
    }
  };

  const handleNotificationChange = (key: keyof typeof userData.notifications) => {
    setUserData({
      ...userData,
      notifications: {
        ...userData.notifications,
        [key]: !userData.notifications[key]
      }
    });
  };

  const handleSecurityChange = (key: keyof typeof userData.security) => {
    setUserData({
      ...userData,
      security: {
        ...userData.security,
        [key]: !userData.security[key]
      }
    });
  };

  const handlePrivacyChange = (key: keyof typeof userData.privacy) => {
    setUserData({
      ...userData,
      privacy: {
        ...userData.privacy,
        [key]: !userData.privacy[key]
      }
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הסיסמה שונתה בהצלחה",
      description: "הסיסמה החדשה שלך נשמרה",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    // Show confirmation dialog before deleting
    if (window.confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה ניתנת לביטול.')) {
      try {
        // Delete user profile and account
        const { error } = await supabase.auth.admin.deleteUser(
          user.id
        );
        
        if (error) throw error;
        
        toast({
          title: "החשבון נמחק",
          description: "החשבון שלך נמחק בהצלחה. מקווים לראותך שוב בעתיד!",
          variant: "destructive",
        });
        
        // Logout the user
        await supabase.auth.signOut();
        navigate('/');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "שגיאה במחיקת חשבון",
          description: "אירעה שגיאה במחיקת החשבון",
          variant: "destructive",
        });
      }
    }
  };

  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הגדרות האבטחה עודכנו",
      description: "השינויים בהגדרות האבטחה נשמרו בהצלחה",
    });
  };

  const handlePrivacyUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הגדרות הפרטיות עודכנו",
      description: "השינויים בהגדרות הפרטיות נשמרו בהצלחה",
    });
  };

  const handleNotificationsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הגדרות ההתראות עודכנו",
      description: "העדפות ההתראות שלך נשמרו בהצלחה",
      variant: "success"
    });
  };

  if (loading || loadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>הגדרות חשבון | oFair - ניהול ההגדרות האישיות שלך</title>
        <meta name="description" content="נהל את הגדרות החשבון שלך, הפרטיות, האבטחה וההתראות באזור האישי של oFair." />
        <meta name="keywords" content="הגדרות, פרטיות, אבטחה, התראות, חשבון משתמש, הגדרות התראות, סיסמה" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">הגדרות</span> חשבון
            </h1>
            <p className="text-gray-600">
              עדכן את פרטי החשבון שלך והעדפות התקשורת
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-32 shadow-md">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                  <CardTitle className="text-blue-800">תפריט הגדרות</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Tabs defaultValue="profile" orientation="vertical" className="w-full">
                    <TabsList className="flex flex-col items-stretch h-auto p-0 bg-transparent">
                      <TabsTrigger value="profile" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <User className="ml-2 h-4 w-4" />
                        פרטים אישיים
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Bell className="ml-2 h-4 w-4" />
                        התראות
                      </TabsTrigger>
                      <TabsTrigger value="security" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Lock className="ml-2 h-4 w-4" />
                        אבטחה
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Shield className="ml-2 h-4 w-4" />
                        פרטיות
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Tabs defaultValue="profile" className="w-full">
                <TabsContent value="profile" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                      <CardTitle>פרטים אישיים</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleProfileUpdate}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              type="email" 
                              value={formData.email}
                              onChange={handleInputChange}
                              disabled
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">טלפון</Label>
                            <Input 
                              id="phone" 
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">כתובת</Label>
                            <Input 
                              id="address" 
                              name="address"
                              placeholder="הכנס את כתובתך"
                              value={formData.address}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <Button type="submit" className="mt-6 bg-[#00D09E] hover:bg-[#00C090]">
                          <Check className="ml-2 h-4 w-4" />
                          שמור שינויים
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="notifications" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                      <CardTitle>הגדרות התראות</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleNotificationsUpdate}>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-medium mb-4">ערוצי תקשורת</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium flex items-center">
                                    <Mail className="ml-2 h-4 w-4 text-blue-600" />
                                    התראות במייל
                                  </h3>
                                  <p className="text-sm text-gray-500">קבל עדכונים חשובים לתיבת הדואר האלקטרוני שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.email}
                                  onCheckedChange={() => handleNotificationChange('email')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium flex items-center">
                                    <Smartphone className="ml-2 h-4 w-4 text-blue-600" />
                                    התראות SMS
                                  </h3>
                                  <p className="text-sm text-gray-500">קבל הודעות טקסט עם עדכונים דחופים</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.sms}
                                  onCheckedChange={() => handleNotificationChange('sms')}
                                />
                              </div>
                            </div>
                          </div>

                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">סוגי התראות</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium">הצעות מחיר חדשות</h3>
                                  <p className="text-sm text-gray-500">קבל התראות כאשר מתקבלות הצעות מחיר חדשות מבעלי מקצוע</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.newQuotes}
                                  onCheckedChange={() => handleNotificationChange('newQuotes')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium">עדכוני סטטוס</h3>
                                  <p className="text-sm text-gray-500">קבל עדכונים כאשר סטטוס הבקשות שלך משתנה</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.statusUpdates}
                                  onCheckedChange={() => handleNotificationChange('statusUpdates')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium">התראות אבטחה</h3>
                                  <p className="text-sm text-gray-500">קבל התראות על שינויים בחשבון או פעילות חשודה</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.securityAlerts}
                                  onCheckedChange={() => handleNotificationChange('securityAlerts')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium">עדכוני מערכת</h3>
                                  <p className="text-sm text-gray-500">קבל עדכונים על שינויים ותכונות חדשות בפלטפורמה</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.appUpdates}
                                  onCheckedChange={() => handleNotificationChange('appUpdates')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <h3 className="font-medium">תקציר שבועי</h3>
                                  <p className="text-sm text-gray-500">קבל סיכום שבועי של הפעילות בחשבון שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.weeklyDigest}
                                  onCheckedChange={() => handleNotificationChange('weeklyDigest')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between pb-3">
                                <div>
                                  <h3 className="font-medium">חומרים שיווקיים</h3>
                                  <p className="text-sm text-gray-500">קבל עדכונים על מבצעים והטבות</p>
                                </div>
                                <Switch 
                                  checked={userData.notifications.marketing}
                                  onCheckedChange={() => handleNotificationChange('marketing')}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="pt-4">
                            <h3 className="text-lg font-medium mb-4">הגדרות מתקדמות</h3>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <p className="text-sm text-gray-700">
                                שעות שקט: אתה יכול להגדיר שעות בהן לא יישלחו אליך התראות
                              </p>
                              <div className="mt-3 grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="quiet-from">משעה</Label>
                                  <Input 
                                    id="quiet-from" 
                                    type="time" 
                                    defaultValue="22:00"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="quiet-to">עד שעה</Label>
                                  <Input 
                                    id="quiet-to" 
                                    type="time" 
                                    defaultValue="07:00"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button type="submit" className="mt-4 bg-[#00D09E] hover:bg-[#00C090]">
                            <Check className="ml-2 h-4 w-4" />
                            שמור הגדרות התראות
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="security" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                      <CardTitle>אבטחה</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handleSecurityUpdate}>
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">שינוי סיסמה</h3>
                            <div className="space-y-2">
                              <Label htmlFor="current-password">סיסמה נוכחית</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">סיסמה חדשה</Label>
                              <Input id="new-password" type="password" />
                              <p className="text-xs text-gray-500">הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, מספר ותו מיוחד</p>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">אימות סיסמה חדשה</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                            
                            <Button type="submit" className="mt-2 bg-[#00D09E] hover:bg-[#00C090]">
                              <Check className="ml-2 h-4 w-4" />
                              עדכן סיסמה
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">אימות דו-שלבי</h3>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-medium flex items-center">
                                  <Key className="ml-2 h-4 w-4 text-blue-600" />
                                  הפעל אימות דו-שלבי
                                </p>
                                <p className="text-sm text-gray-500">הגן על חשבונך עם שכבת אבטחה נוספת</p>
                              </div>
                              <Switch 
                                checked={userData.security.twoFactorAuth}
                                onCheckedChange={() => handleSecurityChange('twoFactorAuth')}
                              />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                              <p className="text-sm text-blue-700 flex">
                                <AlertCircle className="ml-2 h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5" />
                                <span>
                                  אימות דו-שלבי מספק שכבת הגנה נוספת לחשבון שלך על ידי דרישת קוד אימות נוסף בנוסף לסיסמה שלך. הקוד יישלח למכשיר הנייד שלך בכל פעם שתתחבר לחשבונך.
                                </span>
                              </p>
                              {userData.security.twoFactorAuth && (
                                <Button className="mt-3 bg-blue-600 hover:bg-blue-700">הגדר מכשיר אימות</Button>
                              )}
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">הגדרות אבטחה נוספות</h3>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">התראות כניסה</p>
                                  <p className="text-sm text-gray-500">קבל התראות כאשר מתבצעת כניסה חדשה לחשבונך</p>
                                </div>
                                <Switch 
                                  checked={userData.security.loginNotifications}
                                  onCheckedChange={() => handleSecurityChange('loginNotifications')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">התראות על שינוי סיסמה</p>
                                  <p className="text-sm text-gray-500">קבל התראות כאשר הסיסמה שלך משתנה</p>
                                </div>
                                <Switch 
                                  checked={userData.security.passwordUpdates}
                                  onCheckedChange={() => handleSecurityChange('passwordUpdates')}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Clock className="ml-2 h-5 w-5 text-blue-600" />
                              יומן האבטחה
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">היסטוריית הפעילות ואירועי האבטחה בחשבונך</p>
                            
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg border">
                              <div className="p-3 bg-white rounded-md shadow-sm">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">כניסה מוצלחת</p>
                                    <p className="text-xs text-gray-500">IP: 93.182.xx.xx • דפדפן: Chrome • היום, 10:30</p>
                                  </div>
                                  <div className="text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">תקין</div>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-white rounded-md shadow-sm">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">שינוי סיסמה</p>
                                    <p className="text-xs text-gray-500">IP: 93.182.xx.xx • דפדפן: Chrome • לפני שבוע</p>
                                  </div>
                                  <div className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-full">שינוי הגדרות</div>
                                </div>
                              </div>
                              
                              <div className="p-3 bg-white rounded-md shadow-sm">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">ניסיון כניסה שנכשל</p>
                                    <p className="text-xs text-gray-500">IP: 185.203.xx.xx • דפדפן: Safari • לפני שבועיים</p>
                                  </div>
                                  <div className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded-full">נכשל</div>
                                </div>
                              </div>
                            </div>
                            
                            <Button className="mt-4 bg-transparent text-blue-700 border border-blue-300 hover:bg-blue-50">
                              צפה ביומן המלא
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">התקני כניסה מאושרים</h3>
                            <p className="text-sm text-gray-600 mb-4">רשימת המכשירים שהתחברו לחשבונך לאחרונה</p>
                            
                            <div className="space-y-4">
                              <div className="p-3 border rounded-md">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">מחשב Windows - Chrome</p>
                                    <p className="text-xs text-gray-500">תל אביב, ישראל • התחברות אחרונה: היום</p>
                                  </div>
                                  <div className="text-green-600 text-sm">נוכחי</div>
                                </div>
                              </div>
                              
                              <div className="p-3 border rounded-md">
                                <div className="flex justify-between">
                                  <div>
                                    <p className="font-medium">iPhone - Safari</p>
                                    <p className="text-xs text-gray-500">תל אביב, ישראל • התחברות אחרונה: אתמול</p>
                                  </div>
                                  <Button variant="outline" size="sm" className="text-red-600 border-red-200">התנתק</Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="privacy" className="mt-0">
                  <Card>
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                      <CardTitle>פרטיות וחשבון</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <form onSubmit={handlePrivacyUpdate}>
                        <div className="space-y-6">
                          <div className="pb-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Shield className="ml-2 h-5 w-5 text-blue-600" />
                              הגדרות פרטיות
                            </h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">הצג את הפרופיל שלי לבעלי מקצוע</p>
                                  <p className="text-sm text-gray-500">בעלי מקצוע יוכלו לראות את פרטי הפרופיל שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.showProfile}
                                  onCheckedChange={() => handlePrivacyChange('showProfile')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">הצג פעילות אחרונה בפרופיל</p>
                                  <p className="text-sm text-gray-500">בעלי מקצוע יוכלו לראות את הפעילות האחרונה שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.showActivity}
                                  onCheckedChange={() => handlePrivacyChange('showActivity')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">שיתוף מידע עם שותפים</p>
                                  <p className="text-sm text-gray-500">אפשר שיתוף מידע לא מזהה עם חברות שותפות להצעת שירותים מותאמים</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.dataSharing}
                                  onCheckedChange={() => handlePrivacyChange('dataSharing')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">אפשר איסוף נתוני מיקום</p>
                                  <p className="text-sm text-gray-500">אפשר איסוף מידע על מיקומך לשיפור דיוק הצעות המחיר</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.locationTracking}
                                  onCheckedChange={() => handlePrivacyChange('locationTracking')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                  <p className="font-medium">אפשר ניתוח נתונים מצד שלישי</p>
                                  <p className="text-sm text-gray-500">אפשר שימוש בכלי אנליטיקה לשיפור השירות</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.thirdPartyAnalytics}
                                  onCheckedChange={() => handlePrivacyChange('thirdPartyAnalytics')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between pb-3">
                                <div>
                                  <p className="font-medium">אפשר איסוף נתונים לשיפור השירות</p>
                                  <p className="text-sm text-gray-500">עזור לנו לשפר את השירות באמצעות משוב אנונימי</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.allowDataCollection}
                                  onCheckedChange={() => handlePrivacyChange('allowDataCollection')}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="pb-6">
                            <h3 className="text-lg font-medium mb-4 flex items-center">
                              <Globe className="ml-2 h-5 w-5 text-blue-600" />
                              עוגיות ומעקב מקוון
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                              <p className="text-sm text-gray-700">
                                אנו משתמשים בעוגיות כדי לספק לך חווית שימוש טובה יותר ולהתאים את התוכן והפרסומות עבורך
                              </p>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4 flex items-center text-red-600">
                              <AlertCircle className="ml-2 h-5 w-5 text-red-600" />
                              מחיקת חשבון
                            </h3>
                            
                            <div className="bg-red-50 p-4 rounded-md border border-red-100">
                              <p className="text-sm text-red-700">
                                מחיקת חשבון היא פעולה בלתי הפיכה. כל הנתונים שלך, כולל היסטוריית הבקשות והפניות, יימחקו לצמיתות.
                              </p>
                              
                              <Button
                                variant="outline"
                                className="mt-4 border-red-300 text-red-600 hover:bg-red-50"
                                onClick={handleDeleteAccount}
                              >
                                מחק את החשבון שלי לצמיתות
                              </Button>
                            </div>
                          </div>
                          
                          <Button type="submit" className="mt-4 bg-[#00D09E] hover:bg-[#00C090]">
                            <Check className="ml-2 h-4 w-4" />
                            שמור הגדרות פרטיות
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserSettings;
