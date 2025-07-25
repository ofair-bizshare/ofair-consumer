
import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const PaymentFAQContent = () => {
  const paymentFAQs = [
    {
      id: "pay-1",
      question: "איך מתבצע התשלום לבעלי המקצוע?",
      answer: (
        <>
          <strong>חדש!</strong> כעת ניתן לשלם בשתי דרכים:
          <br /><br />
          <strong>1. תשלום באשראי באתר:</strong> תשלום מאובטח ונוח ישירות דרך הפלטפורמה, עם הטבה מיוחדת של 50₪ זיכוי להזמנה הבאה (מוגבל לתשלום ראשון באשראי).
          <br /><br />
          <strong>2. תשלום במזומן:</strong> תשלום ישיר לבעל המקצוע בסיום העבודה, כמו קודם.
          <br /><br />
          בכל מקרה, oFair אינה גובה עמלה מהלקוחות והשירות נשאר חינמי עבורכם.
        </>
      )
    },
    {
      id: "pay-bonus",
      question: "מה ההטבה של 50₪ לתשלום באשראי?",
      answer: (
        <>
          כשאתם משלמים לראשונה באשראי דרך הפלטפורמה, אתם מקבלים 50₪ זיכוי להזמנה הבאה שלכם. זוהי הטבה חד-פעמית המיועדת ללקוחות חדשים שבוחרים בתשלום המאובטח והנוח שלנו. הזיכוי יתווסף אוטומטית לחשבונכם לאחר השלמת התשלום.
        </>
      )
    },
    {
      id: "pay-2",
      question: "מהו מדיניות המחירים של בעלי המקצוע?",
      answer: (
        <>
          כל בעל מקצוע קובע את המחירים שלו באופן עצמאי בהתאם לשיקולים כמו מורכבות העבודה, הזמן הנדרש, עלות החומרים, ניסיון וכדומה. אנחנו מעודדים שקיפות במחירים ודורשים מבעלי המקצוע לפרט בהצעת המחיר שלהם מה בדיוק כלול במחיר. מומלץ להשוות בין מספר הצעות מחיר ולשאול שאלות אם משהו אינו ברור.
        </>
      )
    },
    {
      id: "pay-3",
      question: "מה הם קרדיטים ואיך משתמשים בהם?",
      answer: (
        <>
          קרדיטים הם מערכת התגמול שלנו, המאפשרת לך לקבל הנחות או שירותים נוספים בפלטפורמה. אתה יכול לצבור קרדיטים באמצעות:
          <ul className="list-disc list-inside mt-2 space-y-2 pr-4">
            <li>הזמנת חברים להצטרף לפלטפורמה</li>
            <li>כתיבת ביקורות על בעלי מקצוע שעבדת איתם</li>
            <li>השתתפות במבצעים ופעילויות מיוחדות</li>
          </ul>
          את הקרדיטים ניתן לנצל לקידום בקשות שלך, לקבלת שירותים פרימיום, או להמרה להנחות בעבודות עתידיות אצל בעלי מקצוע משתתפים.
        </>
      )
    }
  ];

  return (
    <Accordion type="single" collapsible className="w-full">
      {paymentFAQs.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-b border-gray-200">
          <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700 text-right">{item.question}</AccordionTrigger>
          <AccordionContent className="text-gray-700 pb-4">
            <div className="p-4 bg-gray-50 rounded-lg text-right">
              {item.answer}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default PaymentFAQContent;
