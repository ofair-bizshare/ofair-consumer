
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Building, Users, Target, Award, Heart, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>אודות oFair | החזון שלנו והמשימה שלנו</title>
        <meta name="description" content="גלו את הסיפור מאחורי oFair, החזון שלנו והמחויבות שלנו לחבר בין בעלי בתים לבעלי מקצוע איכותיים. אנו שואפים לייצר חוויית שירות טובה יותר." />
        <meta property="og:title" content="אודות oFair | החזון שלנו והמשימה שלנו" />
        <meta property="og:description" content="גלו את הסיפור מאחורי oFair, החזון שלנו והמחויבות שלנו לחבר בין בעלי בתים לבעלי מקצוע איכותיים." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 z-[-1]"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full filter blur-3xl opacity-20 transform translate-x-1/2 translate-y-1/2 z-[-1]"></div>
        <div className="absolute top-32 left-0 w-64 h-64 bg-blue-200 rounded-full filter blur-3xl opacity-20 transform -translate-x-1/2 z-[-1]"></div>
        
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6">
            החזון <span className="text-teal-500">שלנו</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            אנו מאמינים שמציאת בעלי מקצוע אמינים ואיכותיים צריכה להיות נגישה, פשוטה ושקופה לכולם.
          </p>
        </div>
      </section>
      
      {/* Our Story */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <h2 className="text-3xl font-bold text-blue-800 mb-4">הסיפור שלנו</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                oFair נולדה מתוך צורך אמיתי שזיהינו בשוק. ראינו שאנשים רבים מתקשים למצוא בעלי מקצוע אמינים, ומצד שני, בעלי מקצוע איכותיים מתקשים להגיע ללקוחות חדשים.
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                הקמנו את oFair כדי לגשר על הפער הזה ולייצר פלטפורמה שתחבר בין הצדדים בצורה יעילה, שקופה והוגנת. המטרה שלנו היא לשפר את חווית השירות עבור כולם ולהפוך את תהליך מציאת בעל מקצוע לפשוט ונעים יותר.
              </p>
              <p className="text-gray-700 leading-relaxed">
                אנו מאמינים בערכים של שקיפות, אמינות ומקצועיות, ופועלים לפיהם בכל צעד בדרך.
              </p>
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <div className="aspect-video rounded-xl overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" 
                  alt="צוות אופייר בעבודה" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-3">הערכים <span className="text-teal-500">שלנו</span></h2>
            <p className="text-gray-700 max-w-2xl mx-auto">העקרונות המנחים אותנו בכל צעד בדרך ליצירת חוויה טובה יותר עבור לקוחות ובעלי מקצוע</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">איכות</h3>
              <p className="text-gray-700 text-center">
                אנו מחויבים לאיכות גבוהה בכל היבט של הפלטפורמה שלנו, מהממשק למשתמש ועד לבעלי המקצוע שאנו מאשרים.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-7 w-7 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-teal-700 mb-3 text-center">נגישות</h3>
              <p className="text-gray-700 text-center">
                אנו מאמינים ששירותים איכותיים צריכים להיות נגישים לכולם, בכל מקום ובכל זמן.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-xl font-bold text-blue-800 mb-3 text-center">שירות</h3>
              <p className="text-gray-700 text-center">
                שירות לקוחות מעולה הוא בלב העשייה שלנו. אנו כאן כדי לסייע ולתמוך בכל צעד בדרך.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-800 mb-6">המשימה שלנו</h2>
            <div className="text-xl text-gray-700 leading-relaxed space-y-4">
              <p>
                המשימה שלנו היא לחבר בין בעלי בתים לבעלי מקצוע איכותיים ואמינים, תוך יצירת חוויה נעימה, יעילה ושקופה לשני הצדדים.
              </p>
              <p>
                אנו שואפים להיות הפלטפורמה המובילה בישראל למציאת בעלי מקצוע, ולשנות את האופן שבו אנשים מזמינים שירותים לבתיהם.
              </p>
              <p>
                בעולם שבו הזמן הוא משאב יקר, אנו מאמינים שתהליך מציאת בעל מקצוע צריך להיות פשוט, מהיר ומדויק. זוהי המשימה שלנו, וזו המחויבות שלנו לציבור.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-800 mb-3">צוות <span className="text-teal-500">מסור</span></h2>
            <p className="text-gray-700 max-w-2xl mx-auto">האנשים שעובדים במרץ כדי להגשים את החזון שלנו</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="יובל, מייסד ומנכ״ל" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-800 mb-1">יובל ישראלי</h3>
                <p className="text-teal-600 font-medium mb-3">מייסד ומנכ״ל</p>
                <p className="text-gray-700 text-sm">בעל ניסיון של 15 שנה בתחום הטכנולוגיה והיזמות, עם התמחות בפיתוח מוצרים מוכווני לקוח.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1161&q=80" alt="שירה, סמנכ״לית שיווק" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-800 mb-1">שירה כהן</h3>
                <p className="text-teal-600 font-medium mb-3">סמנכ״לית שיווק</p>
                <p className="text-gray-700 text-sm">בעלת ניסיון עשיר בשיווק דיגיטלי ובניית מותגים, מובילה את אסטרטגיית השיווק והצמיחה של oFair.</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-square">
                <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80" alt="עמית, מנהל טכנולוגיות" className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-blue-800 mb-1">עמית לוי</h3>
                <p className="text-teal-600 font-medium mb-3">מנהל טכנולוגיות</p>
                <p className="text-gray-700 text-sm">מומחה בפיתוח תוכנה והנדסת מערכות, אחראי על התשתית הטכנולוגית והחדשנות בoFair.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Join Us CTA */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            רוצים להיות <span className="text-teal-300">חלק מהמהפכה</span>?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            אנו תמיד מחפשים אנשים מוכשרים ונלהבים להצטרף לצוות שלנו. אם אתם מאמינים בחזון שלנו, נשמח לשמוע מכם.
          </p>
          <div className="flex justify-center space-x-4 space-x-reverse">
            <a 
              href="mailto:careers@ofair.co.il" 
              className="bg-white text-blue-700 px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-blue-50 transition-colors"
            >
              שלח קורות חיים
            </a>
            <a 
              href="https://biz.ofair.co.il" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-teal-500 text-white px-6 py-3 rounded-md font-semibold shadow-lg hover:bg-teal-600 transition-colors"
            >
              הצטרף כבעל מקצוע
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default About;
