
import React, { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useToast } from '@/hooks/use-toast';
import { createSuperAdmin } from '@/services/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Shield, Settings } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdminEmail || !newAdminEmail.includes('@')) {
      toast({
        title: "שגיאה",
        description: "יש להזין כתובת דוא״ל תקינה",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const result = await createSuperAdmin(newAdminEmail);
      
      if (result.success) {
        toast({
          title: "מנהל על נוסף בהצלחה",
          description: result.message || `${newAdminEmail} נוסף כמנהל על במערכת`,
        });
        setNewAdminEmail('');
      } else {
        toast({
          title: "שגיאה בהוספת מנהל על",
          description: result.message || "אירעה שגיאה בהוספת המנהל",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error adding super admin:", error);
      toast({
        title: "שגיאה בהוספת מנהל על",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">הגדרות מערכת</h1>
        <p className="text-gray-600 mt-1">ניהול הגדרות מערכת והרשאות</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-500" />
              ניהול מנהלים
            </CardTitle>
            <CardDescription>הוספת מנהלי על חדשים למערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSuperAdmin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="admin-email">
                  דוא״ל המנהל החדש
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    <User size={18} />
                  </span>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="הזן כתובת דוא״ל"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="rounded-l-none"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500">
                  המשתמש חייב להיות קיים במערכת כדי להפוך אותו למנהל על
                </p>
              </div>
              
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'מוסיף...' : 'הוסף מנהל על'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-blue-500" />
              הגדרות מערכת
            </CardTitle>
            <CardDescription>הגדרות כלליות של המערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500 text-center py-8">
              הגדרות נוספות יתווספו בקרוב
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
