
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Calendar, Tag, Facebook, Twitter, LinkIcon, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

// This would typically come from an API call using the ID
const getArticleData = (id: string) => {
  // Placeholder data - in a real app, you would fetch this from an API
  return {
    id,
    title: id === '1' ? '10 טיפים לחיסכון בחשמל בבית' : 'מדריך לבחירת קבלן שיפוצים אמין',
    content: id === '1' ? 
      `<p>חשבונות החשמל הגבוהים הם נטל כלכלי משמעותי על רבים מאיתנו. למזלנו, ישנם צעדים פשוטים שניתן לנקוט כדי להפחית את צריכת החשמל ולחסוך כסף. במאמר זה, נציג 10 טיפים פרקטיים לחיסכון בחשמל בבית.</p>
      
      <h2>1. החלף לנורות LED</h2>
      <p>נורות LED צורכות עד 75% פחות אנרגיה מנורות להט מסורתיות ומחזיקות מעמד פי 25 יותר. ההשקעה הראשונית עשויה להיות גבוהה יותר, אך החיסכון לטווח הארוך משמעותי.</p>
      
      <h2>2. כבה אורות ומכשירים כשאינם בשימוש</h2>
      <p>זה נשמע פשוט, אך רבים מאיתנו שוכחים לכבות את האורות כשאנחנו עוזבים חדר. צור הרגל של כיבוי אורות ומכשירי חשמל כשאינם בשימוש פעיל.</p>
      
      <h2>3. השתמש בתרמוסטט חכם</h2>
      <p>תרמוסטטים חכמים מאפשרים לך לתכנת את המיזוג שלך לפעול רק כשצריך. הם יכולים להתאים את הטמפרטורה באופן אוטומטי בהתאם לזמני היום ולנוכחות בבית.</p>
      
      <h2>4. נתק מכשירים שאינם בשימוש</h2>
      <p>"צריכת חשמל פנטום" מתייחסת לחשמל שנצרך על ידי מכשירים אלקטרוניים כשהם כבויים אך עדיין מחוברים לשקע. נתק מכשירים כמו טלוויזיות, מחשבים ומטענים כשאינם בשימוש.</p>
      
      <h2>5. השתמש במכשירי חשמל יעילים אנרגטית</h2>
      <p>בעת רכישת מכשירי חשמל חדשים, חפש את דירוג האנרגיה. מכשירים יעילים יותר עשויים לעלות יותר מראש, אך יחסכו לך כסף בטווח הארוך.</p>
      
      <h2>6. כבס בטמפרטורה נמוכה</h2>
      <p>כביסה במים קרים במקום חמים יכולה לחסוך אנרגיה רבה. רוב הבגדים מתנקים היטב במים קרים, במיוחד עם אבקות כביסה מודרניות.</p>
      
      <h2>7. השתמש בווילונות ותריסים לבקרת טמפרטורה</h2>
      <p>בימים חמים, סגור וילונות ותריסים כדי לחסום את חום השמש. בימי החורף, פתח אותם כדי לאפשר לשמש לחמם את הבית באופן טבעי.</p>
      
      <h2>8. תחזק את מערכת המיזוג שלך</h2>
      <p>ניקוי או החלפת מסנני אוויר באופן קבוע יכולים לשפר את יעילות המזגן שלך. תחזוקה שוטפת חשובה גם למערכות חימום וקירור אחרות.</p>
      
      <h2>9. השתמש במאווררי תקרה</h2>
      <p>מאווררי תקרה צורכים פחות חשמל ממזגנים ויכולים להפחית את הצורך באוויר ממוזג בימים חמים אך לא לוהטים.</p>
      
      <h2>10. בדוק בידוד ואטימה</h2>
      <p>בידוד טוב ואטימה נאותה יכולים למנוע בריחת אוויר ממוזג, ובכך להפחית את העומס על מערכות החימום והקירור שלך.</p>
      
      <h2>סיכום</h2>
      <p>יישום טיפים אלה יכול להוביל לחיסכון משמעותי בחשבונות החשמל שלך. זכור, חיסכון באנרגיה אינו רק טוב לארנק שלך - זה גם טוב לסביבה. התחל ליישם טיפים אלה היום וצפה בחיסכון מצטבר עם הזמן.</p>` : 
      `<p>בחירת קבלן שיפוצים מהווה החלטה משמעותית שיכולה להשפיע על איכות הפרויקט, עלויותיו ורמת הלחץ שתחווה במהלכו. מאמר זה מציע מדריך מקיף שיעזור לך לבחור את הקבלן הנכון ולהימנע מטעויות נפוצות.</p>
      
      <h2>1. הגדר את הפרויקט שלך בבירור</h2>
      <p>לפני שתתחיל לחפש קבלן, הגדר בבירור מה בדיוק אתה רוצה להשיג. ככל שתהיה יותר ספציפי לגבי הציפיות והדרישות שלך, כך יהיה קל יותר לתקשר עם קבלנים פוטנציאליים ולקבל הצעות מחיר מדויקות.</p>
      
      <h2>2. בקש המלצות ובדוק ביקורות</h2>
      <p>אחת הדרכים הטובות ביותר למצוא קבלן אמין היא לבקש המלצות מחברים, משפחה ושכנים שהיו להם חוויות חיוביות עם קבלני שיפוצים. בנוסף, בדוק ביקורות מקוונות ודירוגים בפלטפורמות כמו גוגל, פייסבוק ואתרי ביקורות ייעודיים.</p>
      
      <h2>3. בדוק רישיונות, ביטוח והסמכות</h2>
      <p>ודא שלקבלן יש את כל הרישיונות הנדרשים והביטוחים המתאימים. קבלן מקצועי צריך להיות מוכן להציג אישורים אלה ללא היסוס. זה לא רק מבטיח שהם פועלים בהתאם לחוק, אלא גם מגן עליך במקרה של תאונות או נזק במהלך הפרויקט.</p>
      
      <h2>4. בדוק עבודות קודמות</h2>
      <p>בקש לראות תיק עבודות או תמונות של פרויקטים קודמים שהקבלן ביצע, במיוחד כאלה הדומים לפרויקט שלך. אם אפשר, בקר באתרי עבודה נוכחיים או קודמים כדי להתרשם מאיכות העבודה, הארגון והניקיון.</p>
      
      <h2>5. קבל מספר הצעות מחיר</h2>
      <p>פנה למספר קבלנים וקבל הצעות מחיר מפורטות. הצעה טובה צריכה לכלול פירוט של העלויות, החומרים, לוח זמנים ותנאי תשלום. היזהר מהצעות נמוכות באופן חריג - אלה עלולות להצביע על חוסר ניסיון, שימוש בחומרים באיכות ירודה או תכנון להוסיף עלויות בהמשך.</p>
      
      <h2>6. תקשורת ברורה</h2>
      <p>קבלן טוב צריך להיות תקשורתי, להקשיב לצרכים שלך ולענות על שאלות בבהירות. שים לב לאופן שבו הקבלן מתקשר איתך במהלך תהליך ההצעה - זו אינדיקציה טובה לאופן שבו התקשורת תתנהל במהלך הפרויקט.</p>
      
      <h2>7. חוזה מפורט</h2>
      <p>לאחר שבחרת קבלן, וודא שיש לך חוזה מפורט בכתב. החוזה צריך לכלול את כל ההיבטים של הפרויקט, כולל עלויות, חומרים, לוח זמנים, תנאי תשלום ואחריות. קרא את החוזה בקפידה לפני החתימה וודא שאתה מבין את כל התנאים.</p>
      
      <h2>8. לוח זמנים ריאליסטי</h2>
      <p>קבלן אמין יספק לוח זמנים ריאליסטי לפרויקט ויעדכן אותך על התקדמות העבודה. היזהר מקבלנים המבטיחים לוחות זמנים קצרים באופן חריג - זה עלול להוביל לעבודה חפוזה ולאיכות ירודה.</p>
      
      <h2>9. תנאי תשלום</h2>
      <p>הסכם על לוח תשלומים שקשור להתקדמות הפרויקט. לעולם אל תשלם את מלוא הסכום מראש. תשלום ראשוני של 10-30% הוא סביר, ואת היתרה כדאי לשלם בשלבים בהתאם להתקדמות העבודה.</p>
      
      <h2>10. סיכום ואחריות</h2>
      <p>לאחר השלמת הפרויקט, עבור על כל העבודה עם הקבלן, וודא שכל הפרטים הושלמו לשביעות רצונך ושאתה מקבל אחריות בכתב על העבודה, אם רלוונטי.</p>
      
      <h2>סיכום</h2>
      <p>בחירת קבלן שיפוצים אמין דורשת מחקר, סבלנות ותשומת לב לפרטים. על ידי שימוש בטיפים אלה, תוכל להגדיל את הסיכויים למצוא קבלן שיספק עבודה איכותית בתקציב ובלוח הזמנים המוסכמים. זכור, השקעת זמן בבחירת הקבלן הנכון יכולה לחסוך לך כסף, זמן ומתח בטווח הארוך.</p>`,
    excerpt: id === '1' ? 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.' : 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
    image: id === '1' ? 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80' : 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: id === '1' ? '10 במאי, 2023' : '18 באפריל, 2023',
    category: id === '1' ? 'חשמל וחיסכון' : 'שיפוצים',
    author: 'צוות oFair',
    readTime: id === '1' ? '8 דקות' : '10 דקות'
  };
};

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const article = getArticleData(id || '1');
  const { toast } = useToast();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToTop();
  }, [id]);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "הקישור הועתק",
          description: "קישור למאמר הועתק ללוח",
          variant: "default",
        });
      })
      .catch(() => {
        toast({
          title: "שגיאה בהעתקת הקישור",
          description: "אנא נסה שוב",
          variant: "destructive",
        });
      });
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <Helmet>
          <title>{`${article.title} | oFair`}</title>
          <meta name="description" content={article.excerpt} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.excerpt} />
          <meta property="og:image" content={article.image} />
        </Helmet>

        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">ראשי</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link to="/articles" className="hover:text-blue-600 transition-colors">מאמרים</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-700">{article.title}</span>
          </div>

          {/* Article Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-1" />
                <span>{article.date}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 ml-1" />
                <span>{article.category}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 ml-1" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 ml-1" />
                <span>זמן קריאה: {article.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-10">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Social Share */}
          <div className="border-t border-b border-gray-200 py-6 my-8">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">שתף מאמר זה:</span>
              <div className="flex space-x-4 space-x-reverse">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank')}
                >
                  <Twitter className="h-5 w-5 text-blue-400" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  onClick={handleShareLink}
                >
                  <LinkIcon className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-10 text-center">
            <Link to="/articles">
              <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50">
                <ChevronRight className="ml-2 h-4 w-4" />
                חזרה לכל המאמרים
              </Button>
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
