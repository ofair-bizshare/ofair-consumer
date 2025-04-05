
import * as z from 'zod';

export const articleFormSchema = z.object({
  title: z.string().min(5, { message: 'כותרת חייבת להכיל לפחות 5 תווים' }),
  summary: z.string().min(20, { message: 'תקציר חייב להכיל לפחות 20 תווים' }),
  content: z.string().min(50, { message: 'תוכן חייב להכיל לפחות 50 תווים' }),
  author: z.string().min(2, { message: 'שם המחבר חייב להכיל לפחות 2 תווים' }),
  published: z.boolean().default(true),
  category: z.string().min(1, { message: 'יש לבחור קטגוריה' })
});

export type ArticleFormValues = z.infer<typeof articleFormSchema>;

export const articleCategoryOptions = [
  { value: 'general', label: 'כללי' },
  { value: 'professionals', label: 'בעלי מקצוע' },
  { value: 'home-improvement', label: 'שיפוץ הבית' },
  { value: 'diy', label: 'עשה זאת בעצמך' },
  { value: 'tips', label: 'טיפים' },
  { value: 'guides', label: 'מדריכים' },
  { value: 'electrician', label: 'חשמלאי' },
  { value: 'plumber', label: 'אינסטלטור' },
  { value: 'carpenter', label: 'נגר' },
  { value: 'painter', label: 'צבע' },
  { value: 'gardener', label: 'גנן' },
  { value: 'locksmith', label: 'מנעולן' },
  { value: 'renovation', label: 'שיפוצניק' },
  { value: 'air-conditioning', label: 'מיזוג אוויר' },
  { value: 'cleaning', label: 'ניקיון' },
  { value: 'moving', label: 'הובלות' },
  { value: 'security', label: 'אבטחה ומצלמות' },
  { value: 'flooring', label: 'ריצוף' },
  { value: 'roofing', label: 'גגות' },
  { value: 'solar', label: 'אנרגיה סולרית' }
];
