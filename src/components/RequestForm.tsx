
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, Calendar, Briefcase, UserRound, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { useAuth } from '@/providers/AuthProvider';

interface RequestFormProps {
  onSuccess?: (value: boolean) => void;
  saveToRequests?: boolean;
}

// List of professions for suggestions
const professions = [
  'שיפוצים',
  'חשמל',
  'אינסטלציה',
  'נגרות',
  'מיזוג אוויר',
  'גינון',
  'ניקיון',
  'צביעה',
  'הובלות',
  'עבודות בניה',
  'אלומיניום',
  'איטום',
  'אינסטלטור',
  'דלתות',
  'חלונות',
  'מטבחים',
  'ריצוף',
  'שליכט',
  'בנייה'
];

// List of cities for suggestions
const cities = [
  'תל אביב',
  'ירושלים',
  'חיפה',
  'ראשון לציון',
  'פתח תקווה',
  'אשדוד',
  'נתניה',
  'באר שבע',
  'חולון',
  'בני ברק',
  'רמת גן',
  'אשקלון',
  'רחובות',
  'בת ים',
  'הרצליה',
  'כפר סבא',
  'מודיעין',
  'לוד',
  'רמלה',
  'רעננה',
  'הוד השרון',
  'נצרת',
  'קרית אתא',
  'קרית גת',
  'אילת',
  'עכו',
  'קרית מוצקין',
  'רהט',
  'נהריה',
  'דימונה',
  'טבריה',
  'קרית ים',
  'עפולה',
  'יבנה',
  'אום אל פחם',
  'צפת',
  'רמת השרון',
  'טייבה',
  'קרית שמונה',
  'מגדל העמק',
  'טמרה',
  'סח\'נין',
  'קרית ביאליק'
];

const RequestForm: React.FC<RequestFormProps> = ({
  onSuccess,
  saveToRequests = false
}) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newRequestId, setNewRequestId] = useState<string>("");
  const [openProfessionPopover, setOpenProfessionPopover] = useState(false);
  const [openCityPopover, setOpenCityPopover] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    profession: '',
    description: '',
    location: '',
    timing: '',
    contactName: '',
    phone: '',
    email: ''
  });
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agreeTerms: false,
    phone: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: user.user_metadata?.name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || ''
      }));
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value,
      type,
      checked
    } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const newImages = [...images, ...fileArray];
      setImages(newImages);
      const newPreviewUrls = fileArray.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviewUrls]);
    }
  };
  
  const removeImage = (index: number) => {
    const newImages = [...images];
    const newPreviewUrls = [...previewUrls];
    URL.revokeObjectURL(newPreviewUrls[index]);
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };
  
  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setFormData(prev => ({
        ...prev,
        timing: format(date, 'dd/MM/yyyy')
      }));
    }
    setOpenCalendar(false);
  };
  
  const handleNext = () => {
    if (!formData.profession || !formData.description || !formData.location) {
      toast({
        title: "נא למלא את כל השדות",
        description: "אנא מלא את כל השדות הנדרשים לפני המשך התהליך",
        variant: "destructive"
      });
      return;
    }
    
    if (user) {
      handleFormSubmit();
    } else {
      setStep(2);
    }
  };
  
  const handleFormSubmit = () => {
    console.log('Submitting form data:', formData);
    const requestId = Date.now().toString();
    setNewRequestId(requestId);
    const newRequest = {
      id: requestId,
      title: formData.profession,
      description: formData.description,
      date: new Date().toLocaleDateString('he-IL'),
      location: formData.location,
      status: 'active' as const,
      quotesCount: 0
    };
    
    // Only save to myRequests if saveToRequests is true
    if (saveToRequests) {
      const existingRequests = JSON.parse(localStorage.getItem('myRequests') || '[]');
      existingRequests.push(newRequest);
      localStorage.setItem('myRequests', JSON.stringify(existingRequests));
    }
    
    setShowSuccessDialog(true);
    
    if (onSuccess) {
      onSuccess(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }
    
    const { error } = await signIn(loginData.email, loginData.password);
    if (!error) {
      handleFormSubmit();
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.passwordConfirm) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }
    if (registerData.password !== registerData.passwordConfirm) {
      toast({
        title: "סיסמאות לא תואמות",
        description: "אנא ודא שהסיסמאות שהזנת זהות",
        variant: "destructive"
      });
      return;
    }
    if (!registerData.agreeTerms) {
      toast({
        title: "תנאי שימוש",
        description: "עליך לאשר את תנאי השימוש כדי להמשיך",
        variant: "destructive"
      });
      return;
    }

    const { error } = await signUp(registerData.email, registerData.password, {
      name: registerData.name,
      phone: registerData.phone,
    });
    
    if (!error) {
      handleFormSubmit();
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const handleGoToDashboard = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard');

    setTimeout(() => {
      const element = document.getElementById('request-' + newRequestId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }, 500);
  };
  
  const renderFormContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-gray-700">סוג עבודה</Label>
              <Popover open={openProfessionPopover} onOpenChange={setOpenProfessionPopover}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      placeholder="בחר סוג עבודה"
                      className="pr-10"
                      onClick={() => setOpenProfessionPopover(true)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" dir="rtl">
                  <Command>
                    <CommandInput placeholder="חפש סוג עבודה..." dir="rtl" className="h-9" />
                    <CommandList>
                      <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {professions.map((profession) => (
                          <CommandItem
                            key={profession}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, profession }));
                              setOpenProfessionPopover(false);
                            }}
                            className="cursor-pointer"
                          >
                            {profession}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">עיר</Label>
              <Popover open={openCityPopover} onOpenChange={setOpenCityPopover}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="בחר עיר"
                      className="pr-10"
                      onClick={() => setOpenCityPopover(true)}
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0" align="start" dir="rtl">
                  <Command>
                    <CommandInput placeholder="חפש עיר..." dir="rtl" className="h-9" />
                    <CommandList>
                      <CommandEmpty>לא נמצאו תוצאות</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {cities.map((city) => (
                          <CommandItem
                            key={city}
                            onSelect={() => {
                              setFormData(prev => ({ ...prev, location: city }));
                              setOpenCityPopover(false);
                            }}
                            className="cursor-pointer"
                          >
                            {city}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">תיאור מפורט של העבודה</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="תאר את העבודה שברצונך לבצע באופן מפורט ככל האפשר" 
              className="h-32" 
              value={formData.description} 
              onChange={handleInputChange} 
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timing" className="text-gray-700">מועד ביצוע (אופציונלי)</Label>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="timing" 
                    name="timing" 
                    placeholder="מתי תרצה שהעבודה תתבצע?" 
                    className="pr-10"
                    value={formData.timing} 
                    onChange={handleInputChange} 
                    onClick={() => setOpenCalendar(true)}
                    readOnly
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleSelectDate}
                  className="border rounded-md"
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-700">תמונות (אופציונלי)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <label className="cursor-pointer block">
                <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">לחץ להעלאת תמונות או גרור לכאן</span>
                <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
              </label>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative rounded-md overflow-hidden h-20">
                    <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" 
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-6 animate-fade-in">
          <div className="text-center mb-4">
            <UserRound className="mx-auto h-12 w-12 text-blue-500 mb-2" />
            <h3 className="text-lg font-medium text-gray-700">כניסה או הרשמה לשליחת הבקשה</h3>
            <p className="text-sm text-gray-500">כדי להמשיך, יש להתחבר או להירשם</p>
          </div>
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="login">התחברות</TabsTrigger>
              <TabsTrigger value="register">הרשמה</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">דוא"ל</Label>
                  <Input id="login-email" name="email" type="email" placeholder="הזן את כתובת הדואל שלך" value={loginData.email} onChange={handleLoginChange} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="login-password">סיסמה</Label>
                    <Link to="/forgot-password" className="text-xs text-[#00D09E] hover:text-[#00C090]">
                      שכחת סיסמה?
                    </Link>
                  </div>
                  <Input id="login-password" name="password" type="password" placeholder="הזן את הסיסמה שלך" value={loginData.password} onChange={handleLoginChange} />
                </div>
                
                <Button type="submit" className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white mt-4">
                  התחבר ושלח בקשה
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">שם מלא</Label>
                  <Input id="register-name" name="name" placeholder="הזן את שמך המלא" value={registerData.name} onChange={handleRegisterChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-email">דוא"ל</Label>
                  <Input id="register-email" name="email" type="email" placeholder="הזן את כתובת הדואל שלך" value={registerData.email} onChange={handleRegisterChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password">סיסמה</Label>
                  <Input id="register-password" name="password" type="password" placeholder="בחר סיסמה (לפחות 8 תווים)" value={registerData.password} onChange={handleRegisterChange} />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="register-password-confirm">אימות סיסמה</Label>
                  <Input id="register-password-confirm" name="passwordConfirm" type="password" placeholder="הזן שוב את הסיסמה" value={registerData.passwordConfirm} onChange={handleRegisterChange} />
                </div>
                
                <div className="flex items-center space-x-2 space-x-reverse mt-2">
                  <input type="checkbox" id="agree-terms" name="agreeTerms" checked={registerData.agreeTerms} onChange={handleRegisterChange} className="rounded border-gray-300 text-[#00D09E] focus:ring-[#00D09E]" />
                  <Label htmlFor="agree-terms" className="text-sm cursor-pointer">
                    אני מסכים/ה ל
                    <Link to="/terms" className="text-[#00D09E] mx-1 hover:underline">
                      תנאי השימוש
                    </Link>
                    ול
                    <Link to="/privacy" className="text-[#00D09E] mx-1 hover:underline">
                      מדיניות הפרטיות
                    </Link>
                  </Label>
                </div>
                
                <Button type="submit" className="w-full bg-[#00D09E] hover:bg-[#00C090] text-white mt-4">
                  הרשם ושלח בקשה
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      );
    }
  };

  return (
    <>
      <Card className="glass-card overflow-hidden animate-fade-in-up w-full max-w-md mx-auto" aria-labelledby="service-request-form-title">
        <div className="p-5 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="service-request-form-title" className="text-xl font-bold text-blue-700">
              <span className="text-[#00D09E]">שליחת</span> בקשה לבעלי מקצוע
            </h2>
            <div className="text-sm text-gray-500">
              {user ? 'שלב 1/1' : `שלב ${step}/2`}
            </div>
          </div>

          {renderFormContent()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack} 
                className="border-[#00D09E] text-[#00D09E] hover:bg-teal-50"
              >
                חזרה
              </Button>
            )}
            {step === 1 && (
              <div className="mr-auto">
                <Button 
                  type="button" 
                  onClick={handleNext} 
                  className="bg-[#00D09E] hover:bg-[#00C090]"
                >
                  {user ? 'שלח בקשה' : 'המשך'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-[#00D09E]" />
              <span>בקשתך נשלחה בהצלחה!</span>
            </DialogTitle>
            <DialogDescription className="text-center">
              בעלי מקצוע רלוונטיים יצרו איתך קשר בקרוב עם הצעות מחיר
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-5 text-center">
              <p className="text-gray-700 mb-2">
                {saveToRequests 
                  ? "הבקשה שלך נוספה לאזור האישי שלך" 
                  : "הבקשה שלך נשלחה בהצלחה"}
              </p>
              <p className="text-gray-500 text-sm">
                {saveToRequests 
                  ? "תוכל לעקוב אחרי הסטטוס שלה ולראות את הצעות המחיר שיתקבלו" 
                  : "בעלי מקצוע יצרו איתך קשר בהקדם"}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button 
              type="button" 
              className="bg-[#00D09E] hover:bg-[#00C090] text-white w-full" 
              onClick={saveToRequests ? handleGoToDashboard : () => setShowSuccessDialog(false)}
            >
              {saveToRequests ? "עבור לאזור האישי" : "סגור"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RequestForm;
