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
import { useDebounce } from '@/hooks/useDebounce';
import { FcGoogle } from "react-icons/fc";
import { createRequest } from '@/services/requests';
import { supabase } from '@/integrations/supabase/client';
import ProfessionSelect from './request-form/ProfessionSelect';
import CitySelect from './request-form/CitySelect';
import ImageUpload from './request-form/ImageUpload';
import TimingPicker from './request-form/TimingPicker';
import ContactAuthForm from './request-form/ContactAuthForm';
interface RequestFormProps {
  onSuccess?: (value: boolean) => void;
}
const professions = ['שיפוצים', 'חשמל', 'אינסטלציה', 'נגרות', 'מיזוג אוויר', 'גינון', 'ניקיון', 'צביעה', 'הובלות', 'עבודות בניה', 'אלומיניום', 'איטום', 'אינסטלטור', 'דלתות', 'חלונות', 'מטבחים', 'ריצוף', 'שליכט', 'בנייה'];
const cities = ['תל אביב', 'ירושלים', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק', 'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'הרצליה', 'כפר סבא', 'מודיעין', 'לוד', 'רמלה', 'רעננה', 'הוד השרון', 'נצרת', 'קרית אתא', 'קרית גת', 'אילת', 'עכו', 'קרית מוצקין', 'רהט', 'נהריה', 'דימונה', 'טבריה', 'קרית ים', 'עפולה', 'יבנה', 'אום אל פחם', 'צפת', 'רמת השרון', 'טייבה', 'קרית שמונה', 'מגדל העמק', 'טמרה', 'סח\'נין', 'קרית ביאליק'];
// Overwrite sanitizeFilename for even safer results and more detailed logging.
const sanitizeFilename = (filename: string) => {
  // Split name and extension
  const dotIdx = filename.lastIndexOf(".");
  let base = dotIdx > -1 ? filename.substring(0, dotIdx) : filename;
  let ext = dotIdx > -1 ? filename.substring(dotIdx) : "";

  // Remove all non-ASCII alphanumeric, -, or _, translate Hebrew/Unicode to "_"
  base = base
    .normalize('NFD') // Decompose unicode for more consistency
    .replace(/[\u0590-\u05FF]/g, "_") // Convert Hebrew utf-8 chars to "_"
    .replace(/[\u0600-\u06FF]/g, "_") // Arabic (if ever needed)
    .replace(/[^\w\-]/g, "_") // Non-word
    .replace(/_+/g, "_")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  // If the extension is not valid ascii, clean up or fallback.
  ext = ext.replace(/[^.\w]/g, "").toLowerCase();
  if (!ext.startsWith(".")) ext = ".png";
  if (!/^\.\w+$/.test(ext)) ext = ".png";

  // Avoid empty name
  if (base.length < 2) base = "img";

  return base + ext;
};
const RequestForm: React.FC<RequestFormProps> = ({
  onSuccess
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
  const [professionSearchTerm, setProfessionSearchTerm] = useState('');
  const [citySearchTerm, setCitySearchTerm] = useState('');
  const [filteredProfessions, setFilteredProfessions] = useState(professions);
  const [filteredCities, setFilteredCities] = useState(cities);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const {
    user,
    signIn,
    signUp,
    signInWithGoogle
  } = useAuth();
  const debouncedProfessionSearch = useDebounce(professionSearchTerm, 300);
  const debouncedCitySearch = useDebounce(citySearchTerm, 300);
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
  const handleFormSubmit = async () => {
    console.log('Submitting form data:', formData);
    if (!user) {
      console.error('No user found, cannot create request');
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: "אנא התחבר כדי לשלוח בקשה",
        variant: "destructive"
      });
      return;
    }
    try {
      let uploadedMediaUrls: string[] = [];
      if (images.length > 0) {
        for (const file of images) {
          // --- LOGGING FOR DEBUG ---
          console.log("Original filename:", file.name);
          const safeFileName = sanitizeFilename(file.name);
          console.log("Sanitized filename:", safeFileName);
          const fileName = `${user.id}/${Date.now()}_${safeFileName}`;
          console.log("Full upload file path:", fileName);

          const { data, error } = await supabase.storage.from("requests-media").upload(
            fileName,
            file,
            { cacheControl: '3600', upsert: false }
          );
          if (error) {
            console.error("Supabase upload error:", error);
            toast({
              title: "שגיאה בהעלאת קובץ",
              description: error.message || file.name,
              variant: "destructive"
            });
          } else if (data && data.path) {
            const { data: publicUrlData } = supabase.storage.from("requests-media").getPublicUrl(data.path);
            if (publicUrlData && publicUrlData.publicUrl) {
              uploadedMediaUrls.push(publicUrlData.publicUrl);
              console.log("publicUrl saved to media_urls:", publicUrlData.publicUrl);
            } else {
              console.error("No publicUrl generated for file:", fileName, publicUrlData);
              toast({
                title: "בעיה בגישה לתמונה",
                description: "התמונה הועלתה אך לא ניתן לגשת אליה. נסה שוב או פנה למנהל המערכת.",
                variant: "destructive"
              });
            }
          } else {
            console.warn("No data returned from upload", data);
            toast({
              title: "שגיאה כללית בהעלאת תמונה",
              description: "אירעה שגיאה כללית בהעלאת קובץ: " + file.name,
              variant: "destructive"
            });
          }
        }
      }

      console.log("Final array submitted to media_urls:", uploadedMediaUrls);

      const requestId = await createRequest({
        title: formData.profession,
        description: formData.description,
        location: formData.location,
        timing: formData.timing,
        user_id: user.id,
        category: formData.profession,
        media_urls: uploadedMediaUrls.length > 0 ? uploadedMediaUrls : undefined,
      });
      if (!requestId) {
        throw new Error('Failed to create request');
      }
      setNewRequestId(requestId);
      setShowSuccessDialog(true);
      if (onSuccess) {
        onSuccess(false);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "שגיאה בשליחת הבקשה",
        description: "אירעה שגיאה בשליחת הבקשה, אנא נסה שוב.",
        variant: "destructive"
      });
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const {
        error
      } = await signInWithGoogle();
      if (error) {
        console.error('Error signing in with Google:', error.message);
        toast({
          title: "שגיאת התחברות",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during Google sign in:', error);
      toast({
        title: "שגיאת התחברות",
        description: "אירעה שגיאה בהתחברות באמצעות Google",
        variant: "destructive"
      });
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
    const {
      error
    } = await signIn(loginData.email, loginData.password);
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
        description: "עליך לאשר את תנאי השי��וש כדי להמשיך",
        variant: "destructive"
      });
      return;
    }
    const {
      error
    } = await signUp(registerData.email, registerData.password, {
      name: registerData.name,
      phone: registerData.phone
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
      return <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProfessionSelect
              profession={formData.profession}
              professions={professions}
              searchTerm={professionSearchTerm}
              filteredProfessions={filteredProfessions}
              openPopover={openProfessionPopover}
              setOpenPopover={setOpenProfessionPopover}
              setSearchTerm={setProfessionSearchTerm}
              onChange={handleSelectChange}
            />
            <CitySelect
              city={formData.location}
              cities={cities}
              searchTerm={citySearchTerm}
              filteredCities={filteredCities}
              openPopover={openCityPopover}
              setOpenPopover={setOpenCityPopover}
              setSearchTerm={setCitySearchTerm}
              onChange={handleSelectChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-700">תיאור מפורט של העבודה</Label>
            <Textarea id="description" name="description" placeholder="תאר את העבודה שברצונך לבצע באופן מפורט ככל האפשר" value={formData.description} onChange={handleInputChange} className="h-32 rounded-lg" />
          </div>
          <TimingPicker
            timing={formData.timing}
            openCalendar={openCalendar}
            setOpenCalendar={setOpenCalendar}
            selectedDate={selectedDate}
            handleSelectDate={handleSelectDate}
            handleInputChange={handleInputChange}
          />
          <ImageUpload
            previewUrls={previewUrls}
            onUpload={handleImageUpload}
            removeImage={removeImage}
          />
        </div>;
    } else {
      return (
        <ContactAuthForm
          step={step}
          loginData={loginData}
          registerData={registerData}
          handleLoginChange={handleLoginChange}
          handleRegisterChange={handleRegisterChange}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          handleGoogleSignIn={handleGoogleSignIn}
        />
      );
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
              {user ? 'שלב 1/1' : `שלב ${step}/2`}
            </div>
          </div>

          {renderFormContent()}

          <div className="flex justify-between mt-8">
            {step > 1 && <Button type="button" variant="outline" onClick={handleBack} className="border-[#00D09E] text-[#00D09E] hover:bg-teal-50">
                חזרה
              </Button>}
            {step === 1 && <div className="mr-auto">
                <Button type="button" onClick={handleNext} className="bg-[#00D09E] hover:bg-[#00C090] rounded-lg">
                  {user ? 'שלח בקשה' : 'המשך'}
                </Button>
              </div>}
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
