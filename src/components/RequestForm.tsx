
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const professions = [
  { label: 'שיפוצים', value: 'renovations' },
  { label: 'חשמל', value: 'electricity' },
  { label: 'אינסטלציה', value: 'plumbing' },
  { label: 'נגרות', value: 'carpentry' },
  { label: 'מיזוג אוויר', value: 'air_conditioning' },
  { label: 'גינון', value: 'gardening' },
  { label: 'ניקיון', value: 'cleaning' },
  { label: 'צביעה', value: 'painting' },
  { label: 'הובלות', value: 'moving' },
  { label: 'אחר', value: 'other' },
];

const locations = [
  { label: 'תל אביב והמרכז', value: 'tel_aviv' },
  { label: 'ירושלים והסביבה', value: 'jerusalem' },
  { label: 'חיפה והצפון', value: 'haifa' },
  { label: 'באר שבע והדרום', value: 'beer_sheva' },
  { label: 'אזור השרון', value: 'sharon' },
  { label: 'השפלה', value: 'shfela' },
];

const RequestForm = () => {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    profession: '',
    description: '',
    location: '',
    budget: '',
    timing: '',
    contactName: '',
    phone: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(newPreviewUrls[index]);
    
    newImages.splice(index, 1);
    newPreviewUrls.splice(index, 1);
    
    setImages(newImages);
    setPreviewUrls(newPreviewUrls);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.profession || !formData.description || !formData.location) {
        toast({
          title: "נא למלא את כל השדות",
          description: "אנא מלא את כל השדות הנדרשים לפני המשך התהליך",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.contactName || !formData.phone || !formData.email) {
        toast({
          title: "נא למלא את כל השדות",
          description: "אנא מלא את פרטי הקשר שלך לפני שליחת הבקשה",
          variant: "destructive",
        });
        return;
      }
      
      // Here we would normally send the data to the server
      console.log('Submitting form data:', formData);
      console.log('Images:', images);
      
      toast({
        title: "בקשתך נשלחה בהצלחה!",
        description: "בעלי מקצוע רלוונטיים יצרו איתך קשר בקרוב",
      });
      
      // Navigate to dashboard or login page
      navigate('/login', { state: { fromRequest: true } });
      return;
    }
    
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in-up w-full max-w-3xl mx-auto">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">
            <span className="text-teal-500">שליחת</span> בקשה לבעלי מקצוע
          </h2>
          <div className="text-sm text-gray-500">
            שלב {step}/2
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profession" className="text-gray-700">סוג עבודה</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Select 
                    onValueChange={(value) => handleSelectChange('profession', value)}
                    value={formData.profession}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="בחר סוג עבודה" />
                    </SelectTrigger>
                    <SelectContent>
                      {professions.map(profession => (
                        <SelectItem key={profession.value} value={profession.value}>
                          {profession.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700">אזור גיאוגרפי</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Select 
                    onValueChange={(value) => handleSelectChange('location', value)}
                    value={formData.location}
                  >
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="בחר אזור" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.value} value={location.value}>
                          {location.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget" className="text-gray-700">תקציב משוער (אופציונלי)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="budget"
                    name="budget"
                    placeholder="הזן תקציב משוער"
                    className="pl-10"
                    value={formData.budget}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timing" className="text-gray-700">מועד ביצוע (אופציונלי)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="timing"
                    name="timing"
                    placeholder="מתי תרצה שהעבודה תתבצע?"
                    className="pl-10"
                    value={formData.timing}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">תמונות (אופציונלי)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <label className="cursor-pointer block">
                  <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">לחץ להעלאת תמונות או גרור לכאן</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              {previewUrls.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-20">
                      <img 
                        src={url} 
                        alt={`Uploaded ${index}`} 
                        className="w-full h-full object-cover"
                      />
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
        ) : (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-lg font-medium text-gray-700">פרטי התקשרות</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contactName" className="text-gray-700">שם מלא</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  placeholder="הזן את שמך המלא"
                  value={formData.contactName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700">טלפון</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="הזן מספר טלפון"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">דוא"ל</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="הזן כתובת דואל"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                />
              </div>
            </div>
            
            <div className="text-sm text-gray-500 mt-4">
              בלחיצה על "שלח" אתה מאשר את
              <a href="/terms" className="text-teal-500 mx-1 hover:underline">תנאי השימוש</a>
              ואת
              <a href="/privacy" className="text-teal-500 mx-1 hover:underline">מדיניות הפרטיות</a>
              של האתר
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="border-teal-500 text-teal-500 hover:bg-teal-50"
            >
              חזרה
            </Button>
          )}
          <div className={step === 1 ? 'ml-auto' : ''}>
            <Button
              type="button"
              onClick={handleNext}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {step === 2 ? 'שלח בקשה' : 'המשך'}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RequestForm;
