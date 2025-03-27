import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, Calendar, Briefcase, UserRound, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface RequestFormProps {
  onSuccess?: (value: boolean) => void;
}
const professions = [{
  label: 'שיפוצים',
  value: 'renovations'
}, {
  label: 'חשמל',
  value: 'electricity'
}, {
  label: 'אינסטלציה',
  value: 'plumbing'
}, {
  label: 'נגרות',
  value: 'carpentry'
}, {
  label: 'מיזוג אוויר',
  value: 'air_conditioning'
}, {
  label: 'גינון',
  value: 'gardening'
}, {
  label: 'ניקיון',
  value: 'cleaning'
}, {
  label: 'צביעה',
  value: 'painting'
}, {
  label: 'הובלות',
  value: 'moving'
}, {
  label: 'אחר',
  value: 'other'
}];
const locations = [{
  label: 'תל אביב והמרכז',
  value: 'tel_aviv'
}, {
  label: 'ירושלים והסביבה',
  value: 'jerusalem'
}, {
  label: 'חיפה והצפון',
  value: 'haifa'
}, {
  label: 'באר שבע והדרום',
  value: 'beer_sheva'
}, {
  label: 'אזור השרון',
  value: 'sharon'
}, {
  label: 'השפלה',
  value: 'shfela'
}];
const RequestForm: React.FC<RequestFormProps> = ({
  onSuccess
}) => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newRequestId, setNewRequestId] = useState<string>("");
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
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
    agreeTerms: false
  });
  useEffect(() => {
    checkLoginStatus();
  }, []);
  const checkLoginStatus = () => {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(hasSession);
    return hasSession;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
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
  const handleNext = () => {
    if (!formData.profession || !formData.description || !formData.location) {
      toast({
        title: "נא למלא את כל השדות",
        description: "אנא מלא את כל השדות הנדרשים לפני המשך התהליך",
        variant: "destructive"
      });
      return;
    }
    if (checkLoginStatus()) {
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
      title: getProfessionLabel(formData.profession),
      description: formData.description,
      date: new Date().toLocaleDateString('he-IL'),
      location: getLocationLabel(formData.location),
      status: 'active' as const,
      quotesCount: 0
    };
    const existingRequests = JSON.parse(localStorage.getItem('myRequests') || '[]');
    existingRequests.push(newRequest);
    localStorage.setItem('myRequests', JSON.stringify(existingRequests));

    // Show success dialog instead of just toast
    setShowSuccessDialog(true);

    // If we're in a dialog and have onSuccess callback, close dialog
    if (onSuccess) {
      onSuccess(false);
    }
  };
  const getProfessionLabel = (value: string): string => {
    const profession = professions.find(p => p.value === value);
    return profession ? profession.label : value;
  };
  const getLocationLabel = (value: string): string => {
    const location = locations.find(l => l.value === value);
    return location ? location.label : value;
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "שדות חסרים",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive"
      });
      return;
    }
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    handleFormSubmit();
  };
  const handleRegister = (e: React.FormEvent) => {
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
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    handleFormSubmit();
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const handleGoToDashboard = () => {
    setShowSuccessDialog(false);
    navigate('/dashboard');

    // Scroll to the relevant section in dashboard
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
      return <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="profession" className="text-gray-700">סוג עבודה</Label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Select onValueChange={value => handleSelectChange('profession', value)} value={formData.profession}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="בחר סוג עבודה" />
                  </SelectTrigger>
                  <SelectContent>
                    {professions.map(profession => <SelectItem key={profession.value} value={profession.value}>
                        {profession.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-700">אזור גיאוגרפי</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Select onValueChange={value => handleSelectChange('location', value)} value={formData.location}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="בחר אזור" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(location => <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">תיאור מפורט של העבודה</Label>
            <Textarea id="description" name="description" placeholder="תאר את העבודה שברצונך לבצע באופן מפורט ככל האפשר" className="h-32" value={formData.description} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="timing" className="text-gray-700">מועד ביצוע (אופציונלי)</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input id="timing" name="timing" placeholder="מתי תרצה שהעבודה תתבצע?" className="pl-10" value={formData.timing} onChange={handleInputChange} />
            </div>
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

            {previewUrls.length > 0 && <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {previewUrls.map((url, index) => <div key={index} className="relative rounded-md overflow-hidden h-20">
                    <img src={url} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                    <button type="button" className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs" onClick={() => removeImage(index)}>
                      ×
                    </button>
                  </div>)}
              </div>}
          </div>
        </div>;
    } else {
      return <div className="space-y-6 animate-fade-in">
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
        </div>;
    }
  };
  return <>
      <Card className="glass-card overflow-hidden animate-fade-in-up w-full max-w-md mx-auto" aria-labelledby="service-request-form-title">
        <div className="p-5 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 id="service-request-form-title" className="text-xl font-bold text-blue-700">
              <span className="text-[#00D09E]">שליחת</span> בקשה לבעלי מקצוע
            </h2>
            <div className="text-sm text-gray-500">
              {isLoggedIn ? 'שלב 1/1' : `שלב ${step}/2`}
            </div>
          </div>

          {renderFormContent()}

          <div className="flex justify-between mt-8">
            {step > 1 && <Button type="button" variant="outline" onClick={handleBack} className="border-[#00D09E] text-[#00D09E] hover:bg-teal-50">
                חזרה
              </Button>}
            {step === 1 && <div className="ml-auto">
                <Button type="button" onClick={handleNext} className="bg-[#00D09E] hover:bg-[#00C090]">
                  {isLoggedIn ? 'שלח בקשה' : 'המשך'}
                </Button>
              </div>}
          </div>
        </div>
      </Card>

      {/* Success Dialog */}
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
                הבקשה שלך נוספה לאזור האישי שלך
              </p>
              <p className="text-gray-500 text-sm">
                תוכל לעקוב אחרי הסטטוס שלה ולראות את הצעות המחיר שיתקבלו
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button type="button" className="bg-[#00D09E] hover:bg-[#00C090] text-white w-full" onClick={handleGoToDashboard}>
              עבור לאזור האישי
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>;
};
export default RequestForm;