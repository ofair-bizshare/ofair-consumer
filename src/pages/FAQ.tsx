
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>שאלות נפוצות | oFair - מידע שימושי ותשובות לשאלות נפוצות</title>
        <meta name="description" content="תשובות לשאלות נפוצות על שירותי oFair - מצא תשובות לשאלותיך לגבי מציאת בעלי מקצוע, הגשת בקשות, תשלומים והתהליך כולו." />
        <meta name="keywords" content="שאלות נפוצות, FAQ, שירותי oFair, עזרה, מידע, תמיכה, הסבר, בעלי מקצוע" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">שאלות</span> נפוצות
            </h1>
            <p className="text-gray-600 mb-8">
              מצא תשובות לשאלות הנפוצות ביותר על השירותים שלנו
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bg-blue-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">כיצד זה עובד?</h2>
                <p className="text-gray-600">שאלות על התהליך, שליחת בקשות וקבלת הצעות מחיר</p>
              </CardContent>
            </Card>

            <Card className="bg-teal-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-teal-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-teal-700 mb-2">עלויות ותשלומים</h2>
                <p className="text-gray-600">שאלות על מחירים, עמלות ואופן התשלום</p>
              </CardContent>
            </Card>

            <Card className="bg-violet-50 hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-violet-100 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-violet-700 mb-2">איכות ואבטחה</h2>
                <p className="text-gray-600">שאלות על איכות בעלי המקצוע, אבטחת מידע ופרטיות</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">שאלות כלליות</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  מהו oFair?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  oFair הינה פלטפורמה המחברת בין בעלי בתים ועסקים לבין בעלי מקצוע איכותיים. אנו מאפשרים לך לשלוח בקשה אחת ולקבל הצעות מחיר מכמה בעלי מקצוע מובילים בתחומם. כך, אתה יכול להשוות בקלות בין ההצעות ולבחור את האפשרות הטובה ביותר עבורך.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  האם השירות עולה כסף?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  לא, השירות של oFair הוא חינם לחלוטין עבור בעלי בתים ועסקים. אין צורך לשלם כדי לשלוח בקשה ולקבל הצעות מחיר. אנו גובים עמלה קטנה מבעלי המקצוע כאשר הם מקבלים עבודות דרך הפלטפורמה שלנו, אך זה לא משפיע על המחיר שתשלם.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  כיצד אני שולח בקשה לקבלת הצעות מחיר?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  פשוט מאוד - מלא את הטופס בדף הבית שלנו עם פרטי העבודה שאתה מעוניין לבצע. ציין את סוג העבודה, מיקום, תיאור קצר וכל פרט רלוונטי אחר. לאחר שליחת הבקשה, בעלי מקצוע רלוונטיים יקבלו התראה ויוכלו לשלוח לך הצעות מחיר. אתה תקבל התראה על כל הצעה חדשה שמתקבלת.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  האם עליי להתחייב לקבל את ההצעות שאקבל?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  ממש לא. אין שום התחייבות מצדך לקבל את ההצעות שתקבל. אתה חופשי לבחון את כל האפשרויות, להשוות ביניהן, ולבחור את בעל המקצוע שהכי מתאים לצרכים ולתקציב שלך. אם אף אחת מההצעות לא מתאימה לך, אתה לא חייב לבחור באף אחת מהן.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">בעלי מקצוע ואיכות</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  כיצד אתם מוודאים שבעלי המקצוע אמינים?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  כל בעל מקצוע ב-oFair עובר תהליך אימות ובדיקה מקיף. אנו בודקים את הרישיונות וההסמכות שלהם, מוודאים שיש להם ביטוח מתאים, ואוספים חוות דעת מלקוחות קודמים. בנוסף, יש לנו מערכת דירוג שמאפשרת ללקוחות לדרג את בעלי המקצוע לאחר השלמת העבודה, מה שעוזר לשמור על רמת שירות גבוהה.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  מה קורה אם איני מרוצה מהעבודה?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  שביעות רצון הלקוח היא בראש סדר העדיפויות שלנו. אם אינך מרוצה מהעבודה שבוצעה, אנא פנה אלינו מיד. יש לנו מחלקת שירות לקוחות שתעזור לפתור כל בעיה שעולה. במקרים מסוימים, אנו יכולים לסייע בתיאום תיקונים או בפתרון סכסוכים בין הלקוח לבעל המקצוע.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  האם יש אחריות על העבודה?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  האחריות על העבודה ניתנת ישירות על ידי בעל המקצוע ותלויה בסוג העבודה שבוצעה. רוב בעלי המקצוע שלנו מציעים אחריות על העבודה שלהם, והפרטים המדויקים צריכים להיות מצוינים בהצעת המחיר ובהסכם שנחתם. אנו ממליצים לוודא מהי האחריות המוצעת לפני תחילת העבודה.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">תשלומים והצעות מחיר</h2>
            
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-8">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  כיצד מתבצע התשלום לבעל המקצוע?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  התשלום לבעל המקצוע מתבצע ישירות בינך לבינו, ולא דרך הפלטפורמה שלנו. לאחר שבחרת בבעל מקצוע ותיאמת איתו את העבודה, תוכלו לסכם ביניכם את אופן התשלום. אנו ממליצים לבקש חשבונית או קבלה על כל תשלום שמתבצע.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  האם המחירים בהצעות הם סופיים?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  ההצעות שתקבל אמורות לכלול את כל העלויות הקשורות לעבודה. עם זאת, במקרים מסוימים, אם במהלך העבודה מתגלים דברים בלתי צפויים או אם אתה מבקש שינויים או תוספות לעבודה המקורית, ייתכן שיהיה צורך בהתאמת המחיר. חשוב לדון על כל שינוי אפשרי מראש ולהסכים על המחירים לפני המשך העבודה.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  מה זה הקרדיט של 5%?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  כחלק מתוכנית הנאמנות שלנו, אנו מעניקים ללקוחות קרדיט של 5% על כל עבודה שמבוצעת דרך הפלטפורמה. קרדיט זה נשמר בחשבון שלך ויכול לשמש אותך להנחה בעבודה הבאה שתזמין דרך oFair. זוהי דרכנו להודות לך על האמון והנאמנות שלך לשירות שלנו.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11">
                <AccordionTrigger className="text-right text-lg font-medium text-blue-700">
                  האם אני יכול לבטל עבודה שכבר הוזמנה?
                </AccordionTrigger>
                <AccordionContent className="text-gray-700">
                  כן, אתה יכול לבטל עבודה, אך התנאים לביטול תלויים במדיניות הביטול של בעל המקצוע הספציפי ובמועד הביטול. ככל שהביטול קרוב יותר למועד תחילת העבודה, ייתכן שתידרש לשלם דמי ביטול. אנו ממליצים לברר את מדיניות הביטול של בעל המקצוע לפני הסיכום הסופי.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="text-center bg-blue-50 p-8 rounded-lg">
            <h2 className="text-xl font-bold text-blue-700 mb-4">לא מצאת תשובה לשאלה שלך?</h2>
            <p className="text-gray-600 mb-6">צוות התמיכה שלנו זמין לענות על כל שאלה</p>
            <div className="flex justify-center">
              <a href="mailto:support@ofair.co.il" className="bg-[#00D09E] hover:bg-[#00C090] text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                שלח לנו הודעה
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
