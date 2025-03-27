
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, Info, Tool, CreditCard, MessageCircle } from 'lucide-react';

const FAQ = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>שאלות נפוצות | oFair - מידע, עזרה והדרכה</title>
        <meta name="description" content="תשובות לשאלות נפוצות על השימוש ב-oFair, מציאת בעלי מקצוע, תשלומים, הפניות ועוד." />
        <meta name="keywords" content="שאלות נפוצות, עזרה, הדרכה, FAQ, מידע, בעלי מקצוע, תשלומים, oFair" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              <span className="text-[#00D09E]">שאלות</span> נפוצות
            </h1>
            <p className="text-gray-600 max-w-2xl">
              מצאת את עצמך עם שאלה? ייתכן שמישהו כבר שאל אותה לפניך. כאן תמצא תשובות לשאלות הנפוצות ביותר.
            </p>
          </div>
          
          <div className="mb-10">
            <div className="relative max-w-xl">
              <Input 
                className="pr-10" 
                placeholder="חפש שאלה..." 
                aria-label="חיפוש שאלות נפוצות"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          
          <Tabs defaultValue="general" className="mb-16">
            <TabsList className="border-b w-full justify-start mb-8 bg-transparent">
              <TabsTrigger value="general" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
                <Info className="w-4 h-4 mr-2" />
                כללי
              </TabsTrigger>
              <TabsTrigger value="professionals" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
                <Tool className="w-4 h-4 mr-2" />
                בעלי מקצוע
              </TabsTrigger>
              <TabsTrigger value="payment" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
                <CreditCard className="w-4 h-4 mr-2" />
                תשלומים
              </TabsTrigger>
              <TabsTrigger value="referrals" className="data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 border-b-2 border-transparent rounded-none">
                <MessageCircle className="w-4 h-4 mr-2" />
                הפניות
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">מה זה oFair?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      oFair היא פלטפורמה חדשנית למציאת בעלי מקצוע איכותיים בתחומי הבית והעסק. אנחנו מחברים בין הצרכים שלך לבין בעלי מקצוע מוסמכים ומומלצים, תוך מתן שקיפות מלאה בתהליך. המטרה שלנו היא להפוך את חווית מציאת בעל מקצוע לפשוטה, בטוחה ויעילה.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">האם השימוש ב-oFair כרוך בתשלום?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      לא, השימוש בפלטפורמת oFair הוא חינם לחלוטין עבור לקוחות המחפשים בעלי מקצוע. אתה יכול ליצור חשבון, לפרסם בקשות, לקבל הצעות מחיר ולתקשר עם בעלי מקצוע - הכל ללא עלות. בעלי המקצוע משלמים עמלה קטנה רק כאשר הם מקבלים עבודה דרך הפלטפורמה.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">איך אני יוצר חשבון ב-oFair?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      יצירת חשבון ב-oFair היא פשוטה:
                      <ol className="list-decimal list-inside mt-2 space-y-2">
                        <li>לחץ על כפתור "התחברות" בפינה העליונה</li>
                        <li>בחר באפשרות "הרשמה"</li>
                        <li>הזן את כתובת האימייל שלך ובחר סיסמה</li>
                        <li>או לחלופין, התחבר באמצעות חשבון Google או Facebook</li>
                        <li>השלם את פרטי הפרופיל הבסיסיים</li>
                        <li>זהו! אתה מוכן להתחיל להשתמש בשירות</li>
                      </ol>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">איך אני מוצא בעל מקצוע ב-oFair?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      למציאת בעל מקצוע ב-oFair יש שתי דרכים עיקריות:
                      <ol className="list-decimal list-inside mt-2 space-y-2">
                        <li><strong>חיפוש ישיר</strong> - בחר את הקטגוריה והאזור הרלוונטיים ועיין בפרופילים של בעלי מקצוע זמינים</li>
                        <li><strong>פרסום בקשה</strong> - תאר את הפרויקט או העבודה שלך, ובעלי מקצוע מתאימים ישלחו לך הצעות מחיר</li>
                      </ol>
                      השיטה השנייה חוסכת לך זמן רב, מכיוון שבעלי המקצוע יפנו אליך במקום שתצטרך לחפש ולפנות אליהם.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">האם אני מחויב לבחור באחת ההצעות שקיבלתי?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      לא, אינך מחויב לבחור באף הצעה. אתה יכול לעיין בכל ההצעות שתקבל, להשוות ביניהן, ולבחור את זו שמתאימה לך ביותר - או לא לבחור באף אחת מהן. אין התחייבות מצדך. אנו מעודדים לקוחות לבחור בעלי מקצוע לא רק על בסיס המחיר, אלא גם בהתבסס על הניסיון, הדירוג והביקורות שלהם.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="professionals" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="prof-1" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">כיצד נבחרים בעלי המקצוע בפלטפורמה?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      כל בעל מקצוע שמצטרף ל-oFair עובר תהליך סינון ואימות:
                      <ul className="list-disc list-inside mt-2 space-y-2">
                        <li>אימות זהות ופרטים אישיים</li>
                        <li>בדיקת רישיונות והסמכות מקצועיות</li>
                        <li>אימות ביטוח אחריות מקצועית (כאשר רלוונטי)</li>
                        <li>בדיקת המלצות וניסיון קודם</li>
                      </ul>
                      בנוסף, מערכת הדירוג שלנו מאפשרת ללקוחות לדרג ולכתוב ביקורות על בעלי מקצוע, כך שתוכל לראות את הביצועים וההיסטוריה שלהם בפלטפורמה.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="prof-2" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">האם בעלי המקצוע מבוטחים?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      אנו מעודדים את כל בעלי המקצוע בפלטפורמה לשמור על ביטוח אחריות מקצועית תקף, ובתחומים מסוימים זהו תנאי הכרחי להצטרפות לפלטפורמה. בפרופיל של כל בעל מקצוע תוכל לראות סימון אם יש לו ביטוח, ואילו סוגי ביטוח. מומלץ תמיד לשאול על נושא הביטוח בעת התקשרות עם בעל מקצוע.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="prof-3" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">מה לעשות אם יש לי בעיה עם בעל מקצוע?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      אם נתקלת בבעיה עם בעל מקצוע, אנחנו ממליצים על התהליך הבא:
                      <ol className="list-decimal list-inside mt-2 space-y-2">
                        <li>תחילה, נסה לפתור את הבעיה ישירות מול בעל המקצוע דרך מערכת ההודעות שלנו</li>
                        <li>אם הבעיה לא נפתרה, פנה לצוות התמיכה שלנו דרך כפתור "צור קשר" או באמצעות פתיחת דיווח מתוך הצ'אט</li>
                        <li>צוות הגישור שלנו יתערב ויעזור למצוא פתרון הוגן לשני הצדדים</li>
                        <li>במקרים חמורים, באפשרותנו להשעות או להסיר לחלוטין בעלי מקצוע מהפלטפורמה</li>
                      </ol>
                      אנחנו מתייחסים בחומרה לתלונות ומחויבים לשמירה על סטנדרטים גבוהים של שירות.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="payment" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="pay-1" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">איך מתבצע התשלום לבעלי המקצוע?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      התשלום לבעלי המקצוע מתבצע ישירות ביניכם, מחוץ לפלטפורמה. לאחר שבחרת בעל מקצוע והסכמתם על התנאים, אתה והספק מסכמים על אמצעי התשלום המועדף. oFair אינה מעורבת בתהליך התשלום ואינה גובה עמלה מהלקוחות.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="pay-2" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">מהו מדיניות המחירים של בעלי המקצוע?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      כל בעל מקצוע קובע את המחירים שלו באופן עצמאי בהתאם לשיקולים כמו מורכבות העבודה, הזמן הנדרש, עלות החומרים, ניסיון וכדומה. אנחנו מעודדים שקיפות במחירים ודורשים מבעלי המקצוע לפרט בהצעת המחיר שלהם מה בדיוק כלול במחיר. מומלץ להשוות בין מספר הצעות מחיר ולשאול שאלות אם משהו אינו ברור.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="pay-3" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">מה הם קרדיטים ואיך משתמשים בהם?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      קרדיטים הם מערכת התגמול שלנו, המאפשרת לך לקבל הנחות או שירותים נוספים בפלטפורמה. אתה יכול לצבור קרדיטים באמצעות:
                      <ul className="list-disc list-inside mt-2 space-y-2">
                        <li>הזמנת חברים להצטרף לפלטפורמה</li>
                        <li>כתיבת ביקורות על בעלי מקצוע שעבדת איתם</li>
                        <li>השתתפות במבצעים ופעילויות מיוחדות</li>
                      </ul>
                      את הקרדיטים ניתן לנצל לקידום בקשות שלך, לקבלת שירותים פרימיום, או להמרה להנחות בעבודות עתידיות אצל בעלי מקצוע משתתפים.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="referrals" className="mt-0">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="ref-1" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">מה הן הפניות ואיך הן עובדות?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      הפניות הן מערכת המאפשרת לך להמליץ על oFair לחברים או להפנות אותם ישירות לבעלי מקצוע. כאשר אתה מפנה חבר והוא משתמש בשירות, שניכם מקבלים קרדיטים. יש שתי דרכים להפנות:
                      <ol className="list-decimal list-inside mt-2 space-y-2">
                        <li><strong>הפניה כללית</strong> - שתף את קוד ההפניה האישי שלך או קישור ייחודי עם חברים</li>
                        <li><strong>הפניה לבעל מקצוע</strong> - שתף ישירות את פרופיל בעל המקצוע שעבדת איתו ואהבת</li>
                      </ol>
                      הפניות הן דרך נהדרת לצבור קרדיטים ולעזור לחבריך למצוא בעלי מקצוע איכותיים.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ref-2" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">כמה קרדיטים אני מקבל על הפניה?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      על כל הפניה מוצלחת (כלומר, כאשר המופנה נרשם ומבצע פעולה ראשונה בפלטפורמה) אתה מקבל 50 קרדיטים. גם החבר שהפנית מקבל 50 קרדיטים כמתנת הצטרפות. בנוסף, אם החבר שהפנית בוחר בעל מקצוע ומתקשר איתו, אתה מקבל 100 קרדיטים נוספים. אין הגבלה על מספר ההפניות שאתה יכול לבצע.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="ref-3" className="border-b border-gray-200">
                  <AccordionTrigger className="text-lg font-medium py-4 hover:text-blue-700">איך אני עוקב אחרי ההפניות שלי?</AccordionTrigger>
                  <AccordionContent className="text-gray-700 pb-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      באזור האישי שלך יש לשונית "ההפניות שלי" שם תוכל לראות:
                      <ul className="list-disc list-inside mt-2 space-y-2">
                        <li>את הקוד האישי וקישור ההפניה שלך</li>
                        <li>רשימת כל האנשים שהפנית</li>
                        <li>סטטוס של כל הפניה (נרשם/ביצע פעולה/התקשר עם בעל מקצוע)</li>
                        <li>היסטוריית הקרדיטים שצברת מהפניות</li>
                      </ul>
                      המערכת מתעדכנת בזמן אמת, כך שתוכל לעקוב אחרי ההפניות שלך בכל עת.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
          
          <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-lg p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-blue-700 mb-2">לא מצאת את התשובה שחיפשת?</h2>
                <p className="text-gray-600 max-w-md">
                  צוות התמיכה שלנו זמין לענות על כל שאלה. שלח לנו הודעה ונחזור אליך בהקדם.
                </p>
              </div>
              <Button className="bg-blue-700 hover:bg-blue-800">
                <MessageCircle className="mr-2 h-4 w-4" />
                צור קשר עם התמיכה
              </Button>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-blue-700 mb-4 flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-teal-500" />
              מאמרים מומלצים
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">איך לבחור קבלן שיפוצים מהימן</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <p className="text-sm text-gray-600">10 שאלות שחייבים לשאול לפני שבוחרים קבלן שיפוצים. מדריך מקיף להימנע מטעויות יקרות.</p>
                  <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">מדריך להערכת הצעות מחיר</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <p className="text-sm text-gray-600">איך לבחון ולהשוות הצעות מחיר בצורה נכונה, ולהבין מה באמת כלול בהן.</p>
                  <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">5 סימנים לאמינות בעל מקצוע</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 px-4 pb-4">
                  <p className="text-sm text-gray-600">הסימנים שאתם צריכים לחפש כדי לוודא שבעל המקצוע אמין, מקצועי ומתאים לפרויקט שלכם.</p>
                  <Button variant="link" className="text-teal-600 p-0 h-auto mt-2">קרא עוד</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;
