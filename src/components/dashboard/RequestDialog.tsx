
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface RequestDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  triggerClassName?: string;
  triggerLabel?: string;
}

const RequestDialog: React.FC<RequestDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  triggerClassName = "",
  triggerLabel = "פנייה חדשה +"
}) => {
  const [profession, setProfession] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profession || !location || !description) {
      toast({
        title: "שדות חובה",
        description: "יש למלא את כל השדות",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Normally, this would be an API call
    setTimeout(() => {
      // Save to localStorage for demo purposes
      const newRequest = {
        id: Date.now().toString(),
        title: `פנייה ל${profession}`,
        description,
        date: new Date().toLocaleDateString('he-IL'),
        location,
        status: 'active',
        quotesCount: 0
      };
      
      const savedRequests = localStorage.getItem('myRequests');
      const requests = savedRequests ? JSON.parse(savedRequests) : [];
      requests.unshift(newRequest);
      localStorage.setItem('myRequests', JSON.stringify(requests));
      
      setIsSubmitting(false);
      onOpenChange(false);
      
      // Reset form
      setProfession('');
      setLocation('');
      setDescription('');
      
      toast({
        title: "הפנייה נשלחה בהצלחה",
        description: "בעלי מקצוע רלוונטיים יקבלו את הפנייה שלך וישלחו לך הצעות מחיר",
      });
    }, 1000);
  };

  const professions = [
    { value: 'electrician', label: 'חשמלאי' },
    { value: 'plumber', label: 'אינסטלטור' },
    { value: 'carpenter', label: 'נגר' },
    { value: 'painter', label: 'צבעי' },
    { value: 'locksmith', label: 'מנעולן' }
  ];

  const cities = [
    { value: 'tel_aviv', label: 'תל אביב' },
    { value: 'jerusalem', label: 'ירושלים' },
    { value: 'haifa', label: 'חיפה' },
    { value: 'beer_sheva', label: 'באר שבע' },
    { value: 'eilat', label: 'אילת' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {triggerLabel && (
        <DialogTrigger asChild>
          <Button className={triggerClassName || "bg-[#00D09E] hover:bg-[#00C090]"}>
            {triggerLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px]" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-xl text-center mb-2">פנייה חדשה לבעל מקצוע</DialogTitle>
          <DialogDescription className="text-center">
            מלא את הפרטים הבאים ובעלי מקצוע מתאימים ישלחו לך הצעות מחיר
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="profession" className="text-right block">תחום מקצועי</Label>
            <Select
              value={profession}
              onValueChange={setProfession}
            >
              <SelectTrigger id="profession" className="bg-white">
                <SelectValue placeholder="בחר תחום מקצועי" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {professions.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="text-right block">עיר</Label>
            <Select
              value={location}
              onValueChange={setLocation}
            >
              <SelectTrigger id="location" className="bg-white">
                <SelectValue placeholder="בחר עיר" />
              </SelectTrigger>
              <SelectContent className="bg-white z-[100]">
                {cities.map(item => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-right block">תיאור העבודה</Label>
            <Textarea 
              id="description" 
              placeholder="פרט את העבודה שברצונך לבצע" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="bg-white"
            />
          </div>
          
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              className="bg-[#00D09E] hover:bg-[#00C090] min-w-[120px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "שולח..." : "שלח פנייה"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDialog;
