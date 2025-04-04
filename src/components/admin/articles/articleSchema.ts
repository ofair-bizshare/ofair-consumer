
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
