
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ProfessionalInterface } from '@/services/professionals/types';
import { ScrollArea } from '@/components/ui/scroll-area';

// Form validation schema
const professionalFormSchema = z.object({
  name: z.string().min(2, { message: 'שם חייב להכיל לפחות 2 תווים' }),
  profession: z.string().min(2, { message: 'מקצוע חייב להכיל לפחות 2 תווים' }),
  location: z.string().min(2, { message: 'מיקום חייב להכיל לפחות 2 תווים' }),
  specialties: z.string().min(2, { message: 'התמחויות חייבות להכיל לפחות 2 תווים' }),
  phoneNumber: z.string().min(9, { message: 'מספר טלפון חייב להכיל לפחות 9 תווים' }),
  about: z.string().min(20, { message: 'תיאור חייב להכיל לפחות 20 תווים' }),
  rating: z.number().min(0).max(5),
  company_name: z.string().optional(),
  work_hours: z.string().optional(),
  certifications: z.string().optional(), 
  experience_years: z.number().min(0).optional()
});

export type ProfessionalFormValues = z.infer<typeof professionalFormSchema>;

interface ProfessionalFormProps {
  professional: ProfessionalInterface | null;
  uploading: boolean;
  onSubmit: (data: ProfessionalFormValues) => Promise<void>;
  onCancel: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ 
  professional, 
  uploading, 
  onSubmit, 
  onCancel,
  onImageChange 
}) => {
  const form = useForm<ProfessionalFormValues>({
    resolver: zodResolver(professionalFormSchema),
    defaultValues: {
      name: '',
      profession: '',
      location: '',
      specialties: '',
      phoneNumber: '',
      about: '',
      rating: 5,
      company_name: '',
      work_hours: 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
      certifications: 'מוסמך מקצועי, בעל רישיון',
      experience_years: 5
    }
  });

  // Update form when professional changes
  useEffect(() => {
    if (professional) {
      form.reset({
        name: professional.name,
        profession: professional.profession,
        location: professional.location,
        specialties: professional.specialties?.join(', ') || '',
        phoneNumber: professional.phoneNumber || professional.phone_number || professional.phone || '',
        about: professional.about || professional.bio || '',
        rating: professional.rating || 5,
        company_name: professional.company_name || '',
        work_hours: professional.work_hours || professional.working_hours || 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
        certifications: professional.certifications?.join(', ') || 'מוסמך מקצועי, בעל רישיון',
        experience_years: professional.experience_years || 5
      });
    } else {
      form.reset({
        name: '',
        profession: '',
        location: '',
        specialties: '',
        phoneNumber: '',
        about: '',
        rating: 5,
        company_name: '',
        work_hours: 'ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00',
        certifications: 'מוסמך מקצועי, בעל רישיון',
        experience_years: 5
      });
    }
  }, [professional, form]);

  return (
    <ScrollArea className="max-h-[calc(90vh-120px)]">
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם מלא</FormLabel>
                    <FormControl>
                      <Input placeholder="ישראל ישראלי" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שם חברה (אם קיים)</FormLabel>
                    <FormControl>
                      <Input placeholder="שם החברה" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מקצוע</FormLabel>
                    <FormControl>
                      <Input placeholder="חשמלאי / שרברב / נגר" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="experience_years"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>שנות ניסיון</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מיקום</FormLabel>
                    <FormControl>
                      <Input placeholder="תל אביב והמרכז" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl>
                      <Input placeholder="05X-XXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>התמחויות</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="יש להפריד בפסיקים: תיקוני חשמל, התקנת מזגנים, ייעוץ" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="certifications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>תעודות והסמכות</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="יש להפריד בפסיקים: מוסמך מקצועי, בעל רישיון" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="work_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>שעות פעילות</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="לדוגמה: ימים א-ה: 8:00-18:00, יום ו: 8:00-13:00" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>דירוג (0-5)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="5" 
                      step="0.1"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
              <FormLabel>תמונה</FormLabel>
              <FormControl>
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={onImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormField
              control={form.control}
              name="about"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>אודות</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="תיאור מפורט של בעל המקצוע ושירותיו"
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end mt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="mr-2"
                disabled={uploading}
              >
                ביטול
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'מעלה...' : professional ? 'עדכן בעל מקצוע' : 'הוסף בעל מקצוע'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </ScrollArea>
  );
};

export default ProfessionalForm;
