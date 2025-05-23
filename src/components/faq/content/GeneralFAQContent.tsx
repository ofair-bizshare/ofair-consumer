
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const GeneralFAQContent = () => {
  const generalFAQs = [
    {
      id: "item-1",
      question: "מה זה oFair?",
      answer: (
        <>
          oFair היא פלטפורמה חדשנית למציאת בעלי מקצוע איכותיים בתחומי הבית והעסק. אנחנו מחברים בין הצרכים שלך לבין בעלי מקצוע מוסמכים ומומלצים, תוך מתן שקיפות מלאה בתהליך. המטרה שלנו היא להפוך את חווית מציאת בעל מקצוע לפשוטה, בטוחה ויעילה.
        </>
      )
    },
    {
      id: "item-2",
      question: "האם השימוש ב-oFair כרוך בתשלום?",
      answer: (
        <>
          לא, השימוש בפלטפורמת oFair הוא חינם לחלוטין עבור לקוחות המחפשים בעלי מקצוע. אתה יכול ליצור חשבון, לפרסם בקשות, לקבל הצעות מחיר ולתקשר עם בעלי מקצוע - הכל ללא עלות. בעלי המקצוע משלמים עמלה קטנה רק כאשר הם מקבלים עבודה דרך הפלטפורמה.
        </>
      )
    },
    {
      id: "item-3",
      question: "איך אני יוצר חשבון ב-oFair?",
      answer: (
        <>
          יצירת חשבון ב-oFair היא פשוטה:
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li>לחץ על כפתור "התחברות" בפינה העליונה</li>
            <li>בחר באפשרות "הרשמה"</li>
            <li>הזן את כתובת האימייל שלך ובחר סיסמה</li>
            <li>או לחלופין, התחבר באמצעות חשבון Google או Facebook</li>
            <li>השלם את פרטי הפרופיל הבסיסיים</li>
            <li>זהו! אתה מוכן להתחיל להשתמש בשירות</li>
          </ol>
        </>
      )
    },
    {
      id: "item-4",
      question: "איך אני מוצא בעל מקצוע ב-oFair?",
      answer: (
        <>
          למציאת בעל מקצוע ב-oFair יש שתי דרכים עיקריות:
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li><strong>חיפוש ישיר</strong> - בחר את הקטגוריה והאזור הרלוונטיים ועיין בפרופילים של בעלי מקצוע זמינים</li>
            <li><strong>פרסום בקשה</strong> - תאר את הפרויקט או העבודה שלך, ובעלי מקצוע מתאימים ישלחו לך הצעות מחיר</li>
          </ol>
          השיטה השנייה חוסכת לך זמן רב, מכיוון שבעלי המקצוע יפנו אליך במקום שתצטרך לחפש ולפנות אליהם.
        </>
      )
    },
    {
      id: "item-5",
      question: "האם אני מחויב לבחור באחת ההצעות שקיבלתי?",
      answer: (
        <>
          לא, אינך מחויב לבחור באף הצעה. אתה יכול לעיין בכל ההצעות שתקבל, להשוות ביניהן, ולבחור את זו שמתאימה לך ביותר - או לא לבחור באף אחת מהן. אין התחייבות מצדך. אנו מעודדים לקוחות לבחור בעלי מקצוע לא רק על בסיס המחיר, אלא גם בהתבסס על הניסיון, הדירוג והביקורות שלהם.
        </>
      )
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {generalFAQs.map((item) => (
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

export default GeneralFAQContent;
