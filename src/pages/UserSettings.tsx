
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
import { User, Bell, Lock, Shield, Check, AlertCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

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
    },
    password: '********',
    privacy: {
      showProfile: true,
      allowDataCollection: true,
      showActivity: false
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
                      <div className="space-y-6">
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h3 className="font-medium">התראות במייל</h3>
                            <p className="text-sm text-gray-500">קבל עדכונים למייל שלך</p>
                          </div>
                          <Switch 
                            checked={userData.notifications.email}
                            onCheckedChange={() => handleNotificationChange('email')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h3 className="font-medium">התראות SMS</h3>
                            <p className="text-sm text-gray-500">קבל עדכונים לטלפון הנייד שלך</p>
                          </div>
                          <Switch 
                            checked={userData.notifications.sms}
                            onCheckedChange={() => handleNotificationChange('sms')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h3 className="font-medium">הצעות מחיר חדשות</h3>
                            <p className="text-sm text-gray-500">קבל התראות כאשר מתקבלות הצעות מחיר חדשות</p>
                          </div>
                          <Switch 
                            checked={userData.notifications.newQuotes}
                            onCheckedChange={() => handleNotificationChange('newQuotes')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between border-b pb-3">
                          <div>
                            <h3 className="font-medium">חומרים שיווקיים</h3>
                            <p className="text-sm text-gray-500">קבל עדכונים על מבצעים והטבות</p>
                          </div>
                          <Switch 
                            checked={userData.notifications.marketing}
                            onCheckedChange={() => handleNotificationChange('marketing')}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between pb-3">
                          <div>
                            <h3 className="font-medium">תזכורות הפגישות</h3>
                            <p className="text-sm text-gray-500">קבל תזכורות לפני פגישות מתוזמנות</p>
                          </div>
                          <Switch defaultChecked={true} />
                        </div>

                        <Button type="button" className="mt-4 bg-[#00D09E] hover:bg-[#00C090]">
                          <Check className="mr-2 h-4 w-4" />
                          שמור הגדרות התראות
                        </Button>
                      </div>
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
                          
                          <div className="pt-6 border-t">
                            <h3 className="text-lg font-medium mb-4">אימות דו-שלבי</h3>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <p className="font-medium">הפעל אימות דו-שלבי</p>
                                <p className="text-sm text-gray-500">הגן על חשבונך עם שכבת אבטחה נוספת</p>
                              </div>
                              <Switch />
                            </div>
                            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md border border-blue-100">
                              <AlertCircle className="inline-block mr-2 h-4 w-4 text-blue-500" />
                              אימות דו-שלבי מספק שכבת הגנה נוספת לחשבון שלך על ידי דרישת קוד נוסף בנוסף לסיסמה שלך.
                            </p>
                          </div>
                          
                          <div className="pt-6 border-t">
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
                          <div className="pb-6 border-b">
                            <h3 className="text-lg font-medium mb-4">הגדרות פרטיות</h3>
                            
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">הצג את הפרופיל שלי לבעלי מקצוע</p>
                                  <p className="text-sm text-gray-500">בעלי מקצוע יוכלו לראות את פרטי הפרופיל שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.showProfile}
                                  onCheckedChange={() => handlePrivacyChange('showProfile')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">אפשר איסוף נתונים לשיפור השירות</p>
                                  <p className="text-sm text-gray-500">עזור לנו לשפר את השירות באמצעות משוב אנונימי</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.allowDataCollection}
                                  onCheckedChange={() => handlePrivacyChange('allowDataCollection')}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium">הצג פעילות אחרונה בפרופיל</p>
                                  <p className="text-sm text-gray-500">בעלי מקצוע יוכלו לראות את הפעילות האחרונה שלך</p>
                                </div>
                                <Switch 
                                  checked={userData.privacy.showActivity}
                                  onCheckedChange={() => handlePrivacyChange('showActivity')}
                                />
                              </div>
                            </div>
                            
                            <Button type="submit" className="mt-6 bg-[#00D09E] hover:bg-[#00C090]">
                              <Check className="mr-2 h-4 w-4" />
                              שמור הגדרות פרטיות
                            </Button>
                          </div>
                          
                          <div className="pb-6 border-b">
                            <h3 className="text-lg font-medium mb-2">גיבוי וייצוא נתונים</h3>
                            <p className="text-sm text-gray-600 mb-4">ייצא את כל המידע שלך בפורמט CSV</p>
                            <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                              ייצוא נתונים
                            </Button>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium text-red-600 mb-2">מחיקת חשבון</h3>
                            <p className="text-sm text-gray-600 mb-4">מחיקת החשבון תסיר לצמיתות את כל המידע והפעילות שלך</p>
                            <Button 
                              variant="destructive" 
                              className="bg-red-500 hover:bg-red-600"
                              onClick={handleDeleteAccount}
                            >
                              מחק את החשבון שלי
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
