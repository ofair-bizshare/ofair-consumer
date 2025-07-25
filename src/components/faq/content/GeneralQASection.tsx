import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const GeneralQASection = () => {
  const generalQAs = [
    {
      id: "qa-1",
      question: "מה זה oFair ואיך זה עובד?",
      answer: (
        <>
          oFair היא פלטפורמה דיגיטלית שמחברת בין לקוחות לבעלי מקצוע מקצועיים ומוסמכים. במקום לחפש בעצמכם, אתם פשוט מגדירים את העבודה שאתם צריכים ובעלי מקצוע רלוונטיים שולחים לכם הצעות מחיר. כך אתם חוסכים זמן ומקבלים מגוון אפשרויות להשוואה.
        </>
      )
    },
    {
      id: "qa-2", 
      question: "האם השירות באמת חינמי ללקוחות?",
      answer: (
        <>
          כן! השירות שלנו חינמי לחלוטין עבור הלקוחות. אין עלויות נסתרות, אין דמי מנוי ואין עמלות. אתם משלמים רק לבעל המקצוע עבור העבודה עצמה. אנחנו מרוויחים מדמי מנוי שבעלי המקצוע משלמים לנו עבור החשיפה בפלטפורמה.
        </>
      )
    },
    {
      id: "qa-3",
      question: "איך אני יכול להיות בטוח באיכות בעלי המקצוע?",
      answer: (
        <>
          כל בעלי המקצוע בפלטפורמה עוברים תהליך אימות וסינון. אנחנו בודקים רישיונות, ביטוחים, ניסיון קודם ודירוגי לקוחות. בנוסף, אתם יכולים לראות דירוגים וביקורות של לקוחות קודמים, תמונות מעבודות קודמות ופרטים מקצועיים מלאים לפני שאתם מחליטים.
        </>
      )
    },
    {
      id: "qa-4",
      question: "כמה זמן לוקח לקבל הצעות מחיר?",
      answer: (
        <>
          בדרך כלל תתחילו לקבל הצעות מחיר תוך מספר שעות מרגע פרסום הבקשה. רוב ההצעות מגיעות במהלך היום הראשון. הזמן תלוי בסוג העבודה, האזור הגיאוגרפי וזמינות בעלי המקצוע באזורכם.
        </>
      )
    },
    {
      id: "qa-5",
      question: "מה אם לא אהיה מרוצה מהעבודה?",
      answer: (
        <>
          אנחנו כאן לעזור! יש לנו מערכת תמיכה ייעודית לטיפול בבעיות ותלונות. אם משהו לא השתלב כמו שצריך, אתם יכולים לפנות אלינו ואנחנו נעזור לפתור את הבעיה. בנוסף, המערכת שלנו כוללת דירוגים וביקורות שעוזרים לשמור על רמה גבוהה של שירות.
        </>
      )
    },
    {
      id: "qa-6",
      question: "האם אני חייב לקבל את אחת ההצעות שקיבלתי?",
      answer: (
        <>
          בהחלט לא! אתם לא מחויבים לקבל אף אחת מההצעות שקיבלתם. אתם יכולים לבטל את הבקשה בכל שלב, לבקש הצעות נוספות או לפרסם בקשה חדשה עם דרישות שונות. המטרה שלנו היא שתמצאו בדיוק מה שאתם מחפשים.
        </>
      )
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">שאלות <span className="text-custom-green">ותשובות</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">תשובות לשאלות הנפוצות ביותר שלקוחות שלנו שואלים</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {generalQAs.map((item) => (
              <AccordionItem key={item.id} value={item.id} className="border-b border-gray-200 bg-white mb-2 rounded-lg px-4">
                <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700 text-right">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-700 pb-4">
                  <div className="p-4 bg-gray-50 rounded-lg text-right">
                    {item.answer}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default GeneralQASection;