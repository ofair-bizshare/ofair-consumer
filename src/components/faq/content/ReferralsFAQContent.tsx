
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const ReferralsFAQContent = () => {
  const referralsFAQs = [
    {
      id: "ref-1",
      question: "מה הן הפניות ואיך הן עובדות?",
      answer: (
        <>
          הפניות הן מערכת המאפשרת לך להמליץ על oFair לחברים או להפנות אותם ישירות לבעלי מקצוע. כאשר אתה מפנה חבר והוא משתמש בשירות, שניכם מקבלים קרדיטים. יש שתי דרכים להפנות:
          <ol className="list-decimal list-inside mt-2 space-y-2">
            <li><strong>הפניה כללית</strong> - שתף את קוד ההפניה האישי שלך או קישור ייחודי עם חברים</li>
            <li><strong>הפניה לבעל מקצוע</strong> - שתף ישירות את פרופיל בעל המקצוע שעבדת איתו ואהבת</li>
          </ol>
          הפניות הן דרך נהדרת לצבור קרדיטים ולעזור לחבריך למצוא בעלי מקצוע איכותיים.
        </>
      )
    },
    {
      id: "ref-2",
      question: "כמה קרדיטים אני מקבל על הפניה?",
      answer: (
        <>
          על כל הפניה מוצלחת (כלומר, כאשר המופנה נרשם ומבצע פעולה ראשונה בפלטפורמה) אתה מקבל 50 קרדיטים. גם החבר שהפנית מקבל 50 קרדיטים כמתנת הצטרפות. בנוסף, אם החבר שהפנית בוחר בעל מקצוע ומתקשר איתו, אתה מקבל 100 קרדיטים נוספים. אין הגבלה על מספר ההפניות שאתה יכול לבצע.
        </>
      )
    },
    {
      id: "ref-3",
      question: "איך אני עוקב אחרי ההפניות שלי?",
      answer: (
        <>
          באזור האישי שלך יש לשונית "ההפניות שלי" שם תוכל לראות:
          <ul className="list-disc list-inside mt-2 space-y-2">
            <li>את הקוד האישי וקישור ההפניה שלך</li>
            <li>רשימת כל האנשים שהפנית</li>
            <li>סטטוס של כל הפניה (נרשם/ביצע פעולה/התקשר עם בעל מקצוע)</li>
            <li>היסטוריית הקרדיטים שצברת מהפניות</li>
          </ul>
          המערכת מתעדכנת בזמן אמת, כך שתוכל לעקוב אחרי ההפניות שלך בכל עת.
        </>
      )
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {referralsFAQs.map((item) => (
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

export default ReferralsFAQContent;
