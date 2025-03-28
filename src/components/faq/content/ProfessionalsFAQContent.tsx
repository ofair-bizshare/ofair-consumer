
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const ProfessionalsFAQContent = () => {
  const professionalsFAQs = [
    {
      id: "prof-1",
      question: "כיצד נבחרים בעלי המקצוע בפלטפורמה?",
      answer: (
        <>
          כל בעל מקצוע שמצטרף ל-oFair עובר תהליך סינון ואימות:
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>אימות זהות ופרטים אישיים</li>
            <li>בדיקת רישיונות והסמכות מקצועיות</li>
            <li>אימות ביטוח אחריות מקצועית (כאשר רלוונטי)</li>
            <li>בדיקת המלצות וניסיון קודם</li>
          </ul>
          בנוסף, מערכת הדירוג שלנו מאפשרת ללקוחות לדרג ולכתוב ביקורות על בעלי מקצוע, כך שתוכל לראות את הביצועים וההיסטוריה שלהם בפלטפורמה.
        </>
      )
    },
    {
      id: "prof-2",
      question: "האם בעלי המקצוע מבוטחים?",
      answer: (
        <>
          אנו מעודדים את כל בעלי המקצוע בפלטפורמה לשמור על ביטוח אחריות מקצועית תקף, ובתחומים מסוימים זהו תנאי הכרחי להצטרפות לפלטפורמה. בפרופיל של כל בעל מקצוע תוכל לראות סימון אם יש לו ביטוח, ואילו סוגי ביטוח. מומלץ תמיד לשאול על נושא הביטוח בעת התקשרות עם בעל מקצוע.
        </>
      )
    },
    {
      id: "prof-3",
      question: "מה לעשות אם יש לי בעיה עם בעל מקצוע?",
      answer: (
        <>
          אם נתקלת בבעיה עם בעל מקצוע, אנחנו ממליצים על התהליך הבא:
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li>תחילה, נסה לפתור את הבעיה ישירות מול בעל המקצוע דרך מערכת ההודעות שלנו</li>
            <li>אם הבעיה לא נפתרה, פנה לצוות התמיכה שלנו דרך כפתור "צור קשר" או באמצעות פתיחת דיווח מתוך הצ'אט</li>
            <li>צוות הגישור שלנו יתערב ויעזור למצוא פתרון הוגן לשני הצדדים</li>
            <li>במקרים חמורים, באפשרותנו להשעות או להסיר לחלוטין בעלי מקצוע מהפלטפורמה</li>
          </ol>
          אנחנו מתייחסים בחומרה לתלונות ומחויבים לשמירה על סטנדרטים גבוהים של שירות.
        </>
      )
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {professionalsFAQs.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-gray-200">
          <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">{item.question}</AccordionTrigger>
          <AccordionContent className="text-gray-700 pb-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              {item.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ProfessionalsFAQContent;
