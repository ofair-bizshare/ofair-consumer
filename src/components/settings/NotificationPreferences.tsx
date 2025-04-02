
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Bell, Mail, MessageSquare, Phone } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  value: boolean;
  icon: React.ReactNode;
}

const NotificationPreferences = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'new_quote',
      label: 'הצעות מחיר חדשות',
      description: 'כאשר מתקבלת הצעת מחיר חדשה לפנייה שלך',
      value: true,
      icon: <MessageSquare className="h-5 w-5 text-blue-500" />
    },
    {
      id: 'quote_status',
      label: 'עדכוני סטטוס הצעות',
      description: 'כאשר יש שינוי בסטטוס של הצעת מחיר (התקבלה, נדחתה וכו׳)',
      value: true,
      icon: <Bell className="h-5 w-5 text-amber-500" />
    },
    {
      id: 'new_message',
      label: 'הודעות חדשות',
      description: 'כאשר בעל מקצוע שולח לך הודעה חדשה',
      value: true,
      icon: <Mail className="h-5 w-5 text-teal-500" />
    },
    {
      id: 'promotions',
      label: 'מבצעים והטבות',
      description: 'מבצעים, הטבות ועדכונים לגבי שירותים חדשים',
      value: false,
      icon: <Phone className="h-5 w-5 text-purple-500" />
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = (id: string) => {
    setSettings(settings.map(setting => 
      setting.id === id ? { ...setting, value: !setting.value } : setting
    ));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      
      // Save notification settings to localStorage for demo purposes
      localStorage.setItem('notificationPreferences', JSON.stringify(settings));
      
      toast({
        title: "ההגדרות נשמרו",
        description: "העדפות ההתראות שלך נשמרו בהצלחה",
      });
    }, 1000);
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold">הגדרות התראות</CardTitle>
        <CardDescription>
          בחר את התראות שברצונך לקבל במייל ובטלפון
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {settings.map(setting => (
            <div key={setting.id} className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div>
                  {setting.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium leading-none">{setting.label}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  id={`notification-${setting.id}`}
                  checked={setting.value}
                  onCheckedChange={() => handleToggle(setting.id)}
                />
                <Label htmlFor={`notification-${setting.id}`} className={setting.value ? "text-blue-600" : "text-gray-400"}>
                  {setting.value ? "מופעל" : "כבוי"}
                </Label>
              </div>
            </div>
          ))}
          
          <div className="pt-4 flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? "שומר..." : "שמור הגדרות"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
