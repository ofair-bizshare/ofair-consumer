
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>מדיניות פרטיות | oFair - כיצד אנו מגינים על המידע שלך</title>
        <meta name="description" content="קרא את מדיניות הפרטיות המלאה של oFair המפרטת כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="prose max-w-none">
            <h1 className="mb-8 text-3xl font-bold text-blue-700">מדיניות פרטיות</h1>
            
            <div className="mb-8">
              <p className="text-gray-600">עדכון אחרון: 04 באפריל, 2024</p>
            </div>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">1. מבוא</h2>
              <p className="mb-4">oFair (להלן "אנחנו", "שלנו" או "החברה") מכבדת את פרטיותך ומחויבת להגנה על המידע האישי שאתה עשוי לספק לנו דרך האתר או האפליקציה. אנו אימצנו מדיניות פרטיות זו ("מדיניות הפרטיות") כדי להסביר מה מידע נאסף, כיצד אנו משתמשים במידע זה, ואילו בחירות יש לך בנוגע למידע שלך.</p>
              <p>מדיניות פרטיות זו חלה על כל המידע שנאסף באמצעות האתר שלנו והאפליקציות הנלוות, המאפיינים, הפונקציות, הכלים או התוכן שלנו (להלן "השירות").</p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">2. מידע שאנו אוספים</h2>
              <p className="mb-4"><strong>מידע אישי:</strong> אנו עשויים לאסוף מידע אישי כגון:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>שם מלא</li>
                <li>כתובת דוא"ל</li>
                <li>מספר טלפון</li>
                <li>כתובת</li>
                <li>פרטי תשלום</li>
              </ul>
              
              <p className="mb-4"><strong>נתוני שימוש:</strong> אנו עשויים גם לאסוף מידע על כיצד ניגשת לשירות ומשתמש בו, כגון:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>סוג המכשיר</li>
                <li>כתובת IP</li>
                <li>סוג דפדפן ושפה</li>
                <li>עמודים בהם ביקרת</li>
                <li>זמן ותאריך הגישה שלך</li>
                <li>זמן שבילית בכל עמוד</li>
                <li>מזהים ייחודיים אחרים</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">3. כיצד אנו משתמשים במידע שלך</h2>
              <p className="mb-4">אנו עשויים להשתמש במידע שאנו אוספים לצרכים הבאים:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>לספק, לתחזק ולשפר את השירות שלנו</li>
                <li>לרשום אותך כמשתמש חדש</li>
                <li>לספק ולחייב עבור המוצרים או השירותים שביקשת</li>
                <li>לשלוח לך הודעות תמיכה טכנית</li>
                <li>לשלוח לך הודעות שיווק ופרסום</li>
                <li>לשלוח לך הודעות דוא"ל על עדכונים או שינויים בשירות</li>
                <li>לספק לך תמיכת לקוחות</li>
                <li>לנתח את השימוש בשירות</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">4. שיתוף ושידור נתונים</h2>
              <p className="mb-4">אנו לא נמכור, נסחור או נשכיר את המידע האישי שלך לאחרים. אנו עשויים לשתף את המידע האישי שלך במצבים הבאים:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>עם נותני שירותים שעובדים בשמנו</li>
                <li>לצורך ציות לחוקים או להגן על זכויותינו</li>
                <li>בקשר למיזוג, מכירה של נכסי חברה או מימון</li>
                <li>עם חברות מקושרות או חברות בת</li>
                <li>עם הסכמתך לשתף את המידע</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">5. עוגיות ומעקב</h2>
              <p className="mb-4">אנו משתמשים בעוגיות וטכנולוגיות מעקב דומות כדי לעקוב אחר הפעילות בשירות שלנו ולשמור מידע מסוים. עוגיות הן קבצים עם כמות קטנה של נתונים שעשויים לכלול מזהה ייחודי אנונימי.</p>
              <p className="mb-4">אתה יכול להורות לדפדפן שלך לדחות את כל העוגיות או להודיע לך מתי עוגייה נשלחת. עם זאת, אם אינך מקבל עוגיות, ייתכן שלא תוכל להשתמש בחלק מהשירות שלנו.</p>
              <p>אנו משתמשים בעוגיות למטרות הבאות:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>לעקוב אחר שימוש והתנהגות בשירות שלנו</li>
                <li>לשמור את העדפותיך</li>
                <li>למטרות אבטחה</li>
              </ul>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">6. אבטחה</h2>
              <p className="mb-4">אנו מיישמים אמצעי אבטחה סבירים כדי להגן על המידע האישי שלך מאובדן, שימוש לרעה, שינוי או הרס בלתי מורשה. עם זאת, שום אמצעי אבטחה אינו מושלם, ואנו לא יכולים להבטיח שהמידע שלך לעולם לא ייחשף בנסיבות שאינן לפי מדיניות זו (לדוגמה, כתוצאה מפעולות בלתי מורשות של צד שלישי).</p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">7. זכויותיך</h2>
              <p className="mb-4">בהתאם לחוקים החלים, יתכן שיש לך זכויות מסוימות בנוגע למידע האישי שלך, כגון:</p>
              <ul className="list-disc list-inside pl-5 mb-4 space-y-2">
                <li>הזכות לגשת למידע האישי שלך</li>
                <li>הזכות לתקן מידע לא מדויק</li>
                <li>הזכות למחוק את המידע שלך</li>
                <li>הזכות להגביל את העיבוד</li>
                <li>הזכות להתנגד לעיבוד</li>
                <li>הזכות לניידות נתונים</li>
              </ul>
              <p>אם ברצונך לממש זכויות אלה, אנא צור איתנו קשר בפרטים המפורטים בסוף מדיניות זו.</p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">8. שינויים במדיניות פרטיות זו</h2>
              <p className="mb-4">אנו עשויים לעדכן את מדיניות הפרטיות שלנו מעת לעת. אנו נודיע לך על כל שינויים על ידי פרסום המדיניות החדשה באתר שלנו ועדכון "תאריך עדכון אחרון".</p>
              <p>מומלץ לבדוק מדיניות זו מעת לעת כדי להיות מיודע על כיצד אנו מגינים על המידע שלך.</p>
            </section>
            
            <section className="mb-10">
              <h2 className="text-2xl font-semibold mb-4">9. צור קשר</h2>
              <p>אם יש לך שאלות כלשהן לגבי מדיניות פרטיות זו, אנא צור איתנו קשר:</p>
              <ul className="list-disc list-inside pl-5 space-y-2">
                <li>באמצעות דואר אלקטרוני: privacy@ofair.co.il</li>
                <li>באמצעות טופס הקשר שבאתר שלנו</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
