
import { z } from 'zod';

export const requestFormSchema = z.object({
  title: z.string().min(3, { message: "כותרת הבקשה חייבת להיות לפחות 3 תווים" }),
  category: z.string({ required_error: "יש לבחור קטגוריה" }),
  location: z.string({ required_error: "יש לבחור מיקום" }),
  timing: z.string().optional(),
  description: z.string().min(10, { message: "תיאור הבקשה חייב להיות לפחות 10 תווים" }),
});

export type RequestFormValues = z.infer<typeof requestFormSchema>;

export const categories = [
  "שיפוצים",
  "חשמל",
  "אינסטלציה",
  "גינון",
  "ניקיון",
  "הובלות",
  "מזגנים",
  "מחשבים",
  "תיקון מכשירי חשמל",
  "אחר",
];

export const locations = [
  "תל אביב והמרכז",
  "ירושלים והסביבה",
  "חיפה והצפון",
  "באר שבע והדרום",
  "אילת",
  "השרון",
  "השפלה",
];

export const timings = [
  "מיידי",
  "בימים הקרובים",
  "בשבוע הקרוב",
  "בחודש הקרוב",
  "גמיש",
];
