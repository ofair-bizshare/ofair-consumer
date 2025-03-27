
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

const UserSettings = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data
  const [userData, setUserData] = useState({
    name: 'ישראל ישראלי',
    email: 'israel@example.com',
    phone: '050-1234567',
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

  useEffect(() => {
    // Check if user is logged in
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    
    if (!hasSession) {
      navigate('/login');
    }
  }, [navigate]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "הפרופיל עודכן בהצלחה",
      description: "השינויים שביצעת נשמרו",
    });
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

  const handleDeleteAccount = () => {
    // Show confirmation dialog before actually deleting
    if (window.confirm('האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו אינה ניתנת לביטול.')) {
      toast({
        title: "החשבון נמחק",
        description: "החשבון שלך נמחק בהצלחה. מקווים לראותך שוב בעתיד!",
        variant: "destructive",
      });
      
      // Logout the user
      localStorage.removeItem('isLoggedIn');
      navigate('/');
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

  if (!isLoggedIn) {
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
                        <User className="mr-2 h-4 w-4" />
                        פרטים אישיים
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Bell className="mr-2 h-4 w-4" />
                        התראות
                      </TabsTrigger>
                      <TabsTrigger value="security" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Lock className="mr-2 h-4 w-4" />
                        אבטחה
                      </TabsTrigger>
                      <TabsTrigger value="privacy" className="justify-start px-4 py-3 data-[state=active]:bg-blue-50">
                        <Shield className="mr-2 h-4 w-4" />
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
                              value={userData.name}
                              onChange={(e) => setUserData({...userData, name: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">דוא"ל</Label>
                            <Input 
                              id="email" 
                              type="email" 
                              value={userData.email}
                              onChange={(e) => setUserData({...userData, email: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">טלפון</Label>
                            <Input 
                              id="phone" 
                              value={userData.phone}
                              onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">כתובת</Label>
                            <Input 
                              id="address" 
                              placeholder="הכנס את כתובתך"
                            />
                          </div>
                        </div>
                        
                        <div className="mt-8 space-y-4">
                          <h3 className="text-lg font-medium">העדפות כלליות</h3>
                          <div className="space-y-2">
                            <Label htmlFor="language">שפה מועדפת</Label>
                            <select 
                              id="language" 
                              className="w-full p-2 border rounded-md"
                              defaultValue="he"
                            >
                              <option value="he">עברית</option>
                              <option value="en">אנגלית</option>
                              <option value="ar">ערבית</option>
                              <option value="ru">רוסית</option>
                            </select>
                          </div>
                        </div>
                        
                        <Button type="submit" className="mt-6 bg-[#00D09E] hover:bg-[#00C090]">
                          <Check className="mr-2 h-4 w-4" />
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
                                    <Mail className="mr-2 h-4 w-4 text-blue-600" />
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
                                    <Smartphone className="mr-2 h-4 w-4 text-blue-600" />
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
                            <Check className="mr-2 h-4 w-4" />
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
                              <Check className="mr-2 h-4 w-4" />
                              עדכן סיסמה
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium mb-4">אימות דו-שלבי</h3>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-medium flex items-center">
                                  <Key className="mr-2 h-4 w-4 text-blue-600" />
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
                                <AlertCircle className="mr-2 h-4 w-4 flex-shrink-0 text-blue-500 mt-0.5" />
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
                              <Clock className="mr-2 h-5 w-5 text-blue-600" />
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
                              <Shield className="mr-2 h-5 w-5 text-blue-600" />
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
                              <Globe className="mr-2 h-5 w-5 text-blue-600" />
                              עוגיות ומעקב מקוון
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                              <p className="text-sm text-gray-700">
                                אנו משתמשים בעוגיות כדי לספק לך חוויה מותאמת אישית. באפשרותך לנהל את העדפות העוגיות שלך בכל עת.
                              </p>
                              <div className="mt-3 space-y-2">
                                <div className="flex items-center">
                                  <input type="checkbox" id="essential-cookies" checked disabled className="mr-2" />
                                  <Label htmlFor="essential-cookies">עוגיות הכרחיות (לא ניתן לכיבוי)</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="functional-cookies" defaultChecked className="mr-2" />
                                  <Label htmlFor="functional-cookies">עוגיות פונקציונליות</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="analytics-cookies" defaultChecked className="mr-2" />
                                  <Label htmlFor="analytics-cookies">עוגיות אנליטיקה</Label>
                                </div>
                                <div className="flex items-center">
                                  <input type="checkbox" id="marketing-cookies" className="mr-2" />
                                  <Label htmlFor="marketing-cookies">עוגיות שיווקיות</Label>
                                </div>
                              </div>
                            </div>
                            <Button variant="outline" className="text-blue-600 border-blue-300">
                              נהל העדפות עוגיות
                            </Button>
                          </div>
                          
                          <Separator />
                          
                          <div className="pb-6">
                            <h3 className="text-lg font-medium mb-2 flex items-center">
                              <FileText className="mr-2 h-5 w-5 text-blue-600" />
                              גיבוי וייצוא נתונים
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">ייצא את המידע האישי שלך בפורמט מובנה</p>
                            <div className="flex space-x-3">
                              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                                ייצוא נתונים (JSON)
                              </Button>
                              <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                                ייצוא נתונים (CSV)
                              </Button>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h3 className="text-lg font-medium text-red-600 mb-2">מחיקת חשבון</h3>
                            <p className="text-sm text-gray-600 mb-4">מחיקת החשבון תסיר לצמיתות את כל המידע והפעילות שלך</p>
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
                              <h4 className="font-medium text-red-700 mb-2">שים לב לפני המחיקה:</h4>
                              <ul className="list-disc list-inside text-sm text-red-600 space-y-1">
                                <li>כל הבקשות וההצעות שקיבלת יימחקו</li>
                                <li>כל הקרדיטים שנותרו בחשבונך יאבדו</li>
                                <li>לא ניתן לשחזר את החשבון לאחר המחיקה</li>
                              </ul>
                            </div>
                            <Button 
                              variant="destructive" 
                              className="bg-red-500 hover:bg-red-600"
                              onClick={handleDeleteAccount}
                            >
                              מחק את החשבון שלי
                            </Button>
                          </div>

                          <Separator />
                          
                          <div className="pt-4">
                            <Button type="submit" className="bg-[#00D09E] hover:bg-[#00C090]">
                              <Check className="mr-2 h-4 w-4" />
                              שמור הגדרות פרטיות
                            </Button>
                          </div>
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
