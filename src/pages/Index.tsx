import React, { useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RequestForm from '@/components/RequestForm';
import DynamicProfessionalSearch from '@/components/DynamicProfessionalSearch';
import ArticleCard from '@/components/ArticleCard';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle, 
  FileText, 
  Search, 
  Gift, 
  ChevronDown, 
  Wrench, 
  Hammer, 
  PaintBucket, 
  Plug, 
  Lightbulb, 
  Home as HomeIcon,
  ThumbsUp
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ScrollIndicator from '@/components/ScrollIndicator';

// Sample data for articles - update to use summary instead of excerpt
const articles = [{
  id: '1',
  title: '10 טיפים לחיסכון בחשמל בבית',
  summary: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.',
  image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  date: '10 במאי, 2023',
  category: 'חשמל וחיסכון'
}, {
  id: '2',
  title: 'מדריך לבחירת קבלן שיפוצים אמין',
  summary: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
  image: 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  date: '18 באפריל, 2023',
  category: 'שיפוצים'
}];

// Popular services for the new services section - added serviceId to match with search filtering
const popularServices = [
  { icon: <Wrench size={32} />, name: 'שיפוצים כלליים', color: 'bg-blue-500', serviceId: 'renovations' },
  { icon: <Plug size={32} />, name: 'חשמלאי', color: 'bg-amber-500', serviceId: 'electricity' },
  { icon: <PaintBucket size={32} />, name: 'צביעה וטיח', color: 'bg-green-500', serviceId: 'renovations' },
  { icon: <Hammer size={32} />, name: 'נגרות', color: 'bg-purple-500', serviceId: 'carpentry' },
  { icon: <Lightbulb size={32} />, name: 'חשמל ותאורה', color: 'bg-red-500', serviceId: 'electricity' },
  { icon: <HomeIcon size={32} />, name: 'עיצוב פנים', color: 'bg-indigo-500', serviceId: 'interior_design' },
];

// Testimonials for the new testimonials section
const testimonials = [
  {
    text: 'קיבלתי 5 הצעות מחיר תוך יום ובחרתי את בעל המקצוע המושלם לפרויקט שלי. חסכתי המון זמן וכסף!',
    name: 'שירה כהן',
    role: 'בעלת דירה ברמת גן',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
  {
    text: 'השירות הזה פשוט מדהים! מצאתי בעל מקצוע מעולה לשיפוץ המטבח שלי. התהליך היה פשוט וקל.',
    name: 'אבי לוי',
    role: 'בעל דירה בתל אביב',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
  },
];

const Index = () => {
  const requestFormRef = useRef<HTMLDivElement>(null);
  const searchSectionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const scrollToRequestForm = () => {
    requestFormRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  
  const scrollToSearchSection = () => {
    searchSectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  const handleSearchSubmit = (profession: string, location: string) => {
    navigate(`/search?profession=${profession}&location=${location}`);
  };
  
  return <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        {/* Preload critical assets for performance */}
        <link rel="preload" href="/lovable-uploads/52b937d1-acd7-4831-b19e-79a55a774829.png" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        <title>oFair - מציאת בעלי מקצוע מובילים בכל תחום | פלטפורמת חיבור בין לקוחות למקצוענים</title>
        <meta name="description" content="פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע אמינים ומקצועיים. קבלו הצעות מחיר ללא התחייבות ובחרו את המקצוען הנכון עבורכם." />
        <meta name="keywords" content="בעלי מקצוע, שיפוצים, חשמלאי, אינסטלציה, נגרות, גינון, ניקיון, צביעה, הובלות, מיזוג אוויר, תיקונים, שירותי בית" />
        <meta property="og:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta property="og:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ofair.co.il" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="oFair - מצא בעלי מקצוע מובילים לכל עבודה" />
        <meta name="twitter:description" content="פלטפורמה חינמית המחברת בין צרכנים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר ללא התחייבות." />
        <link rel="canonical" href="https://ofair.co.il" />
      </Helmet>
      
      <Header />
      
      {/* Hero Section - Updated with better visuals */}
      <section className="relative pt-28 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 z-[-1]"></div>
        <div className="absolute inset-0 z-[-1] opacity-50 bg-[url('https://images.unsplash.com/photo-1612968953208-56c5052b9ec4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[-1]"></div>
        
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-start gap-8">
            {/* Left side - Text content */}
            <div className="w-full lg:w-1/2 animate-fade-in-up relative z-10">
              <div className="text-base font-semibold text-[#00D09E] mb-3 flex items-center">
                <ThumbsUp className="w-5 h-5 inline-block ml-2" />
                oFair - הפתרון המושלם לבעלי בתים
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-800 mb-4 leading-tight">
                מצאו את 
                <span className="text-[#00D09E] mx-2">בעל המקצוע</span>
                המושלם לכל עבודה
              </h1>
              <p className="text-lg text-gray-700 mb-6">פלטפורמה חינמית המחברת בין בעלי בתים לבעלי מקצוע מובילים בתחומם. קבלו הצעות מחיר וזמינות ללא התחייבות ובחרו את המקצוען הנכון עבורכם בקלות וביעילות.</p>
              <div className="flex flex-wrap gap-4 mb-8 lg:mb-0">
                <Button size="lg" className="bg-[#00D09E] hover:bg-[#00C090] text-white button-transition flex items-center gap-2 shadow-md" onClick={scrollToRequestForm}>
                  <FileText size={20} />
                  שליחת פנייה לבעלי מקצוע
                </Button>
                <Link to="/search">
                  <Button size="lg" variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 button-transition flex items-center gap-2">
                    <Search size={20} />
                    חיפוש בעלי מקצוע
                  </Button>
                </Link>
              </div>
              {/* Add new cashback benefit info */}
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg shadow-sm">
                <div className="flex items-start">
                  <Gift className="h-6 w-6 text-[#00D09E] mt-1 ml-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg">5% חזרה לעבודה הבאה!</h3>
                    <p className="text-gray-700">קבלו 5% חזרה על העבודה הראשונה דרך oFair, לשימוש בעבודה הבאה שלכם.</p>
                    <Link to="/dashboard" className="text-[#00D09E] hover:underline mt-2 inline-block font-medium">
                      הצג את הקרדיט שלי ←
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Form with decorative elements */}
            <div className="w-full lg:w-1/2 animate-fade-in pt-0 relative z-10">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-gradient-to-br from-blue-400 to-teal-300 rounded-full blur-xl opacity-30 hidden lg:block"></div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-300 rounded-full blur-lg opacity-30 hidden lg:block"></div>
              
              <div id="request-form" ref={requestFormRef} className="relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#00D09E] rounded-full opacity-80 animate-pulse hidden md:block"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-500 rounded-full opacity-70 animate-pulse hidden md:block"></div>
                <RequestForm />
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-center hidden md:block animate-bounce">
            <div className="flex flex-col items-center cursor-pointer" onClick={scrollToSearchSection}>
              <p className="text-blue-700 mb-2 font-medium">חפש בעלי מקצוע מובילים</p>
              <div className="bg-[#00D09E] rounded-full p-2 text-white">
                <ChevronDown size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Services Section - Updated with links to search page */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">שירותים <span className="text-custom-green">פופולריים</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">מצא בעלי מקצוע מובילים בתחומים המבוקשים ביותר</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 stagger-animation">
            {popularServices.map((service, idx) => (
              <Link 
                key={idx} 
                to={`/search?profession=${service.serviceId}&location=all`} 
                className="group"
              >
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-16 h-16 ${service.color} text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Search Section with Visual Enhancements - Updated to use handleSearchSubmit */}
      <section id="professional-search-section" ref={searchSectionRef} className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-400 rounded-full opacity-10"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-400 rounded-full opacity-10"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">חיפוש <span className="text-custom-green">מתקדם</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">מצא בעלי מקצוע מובילים בתחומם באזור שלך בקלות ובמהירות</p>
          </div>
          <div className="animate-fade-in">
            <DynamicProfessionalSearch onSearch={handleSearchSubmit} />
          </div>
          {/* Visual element - professionals illustration */}
          <div className="flex justify-center mt-12">
            <img 
              src="https://images.unsplash.com/photo-1556912172-45518114e8a5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
              alt="בעלי מקצוע מובילים" 
              className="rounded-lg shadow-lg max-w-full h-auto max-h-96 object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* How it Works Section - Enhanced with Icons */}
      <section className="py-16 md:py-24 bg-white relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full opacity-40 transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-100 rounded-full opacity-50 transform -translate-x-20 translate-y-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">איך זה <span className="text-custom-green">עובד?</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">תהליך פשוט בשלושה שלבים למציאת בעל המקצוע המושלם לעבודה שלכם</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-animation">
            <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">1</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">שלחו בקשה</h3>
              <p className="text-gray-600">מלאו טופס קצר עם פרטי העבודה שברצונכם לבצע</p>
              <div className="mt-4">
                <FileText size={32} className="mx-auto text-[#00d09e]" />
              </div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">2</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">קבלו הצעות מחיר וזמינות</h3>
              <p className="text-gray-600">בעלי מקצוע מובילים ישלחו לכם הצעות מותאמות אישית </p>
              <div className="mt-4">
                <Wrench size={32} className="mx-auto text-[#00d09e]" />
              </div>
            </div>
            
            <div className="text-center p-6 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 bg-[#00d09e]">3</div>
              <h3 className="text-xl font-semibold text-blue-700 mb-3">בחרו את המתאים</h3>
              <p className="text-gray-600">השוו בין ההצעות וצרו קשר עם בעל המקצוע שהכי מתאים לצרכים שלכם</p>
              <div className="mt-4">
                <CheckCircle size={32} className="mx-auto text-[#00d09e]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - New */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-teal-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">לקוחות <span className="text-custom-green">מספרים</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">מה אומרים לקוחות שכבר השתמשו בשירות שלנו</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto stagger-animation">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={18} className="inline-block text-yellow-400 fill-yellow-400 mr-1" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 flex-grow">{testimonial.text}</p>
                <div className="flex items-center">
                  <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                  <div>
                    <h4 className="font-semibold text-blue-700">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us - Enhanced with Animations */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">למה <span className="text-custom-green">oFair?</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">הפלטפורמה שלנו מציעה יתרונות ייחודיים שהופכים את התהליך לפשוט, בטוח ויעיל</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 stagger-animation">
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">אמינות ובטחון</h3>
              <p className="text-gray-600 text-sm">כל בעלי המקצוע עוברים תהליך אימות ובדיקה</p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">איכות מוכחת</h3>
              <p className="text-gray-600 text-sm">דירוגים וביקורות אמיתיות מלקוחות קודמים</p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">חיסכון בזמן</h3>
              <p className="text-gray-600 text-sm">קבלו הצעות מחיר במהירות ללא צורך בחיפושים</p>
            </div>
            
            <div className="text-center p-6 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-7 w-7 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-blue-700 mb-2">שירות חינמי</h3>
              <p className="text-gray-600 text-sm">אין עלות לצרכנים, שלמו רק עבור העבודה עצמה</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Articles Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-700 mb-3">טיפים <span className="text-custom-green">ומאמרים</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto">מאמרים מקצועיים וטיפים שימושיים שיעזרו לכם להפיק את המיטב מהפרויקט שלכם</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 stagger-animation">
            {articles.map(article => <ArticleCard key={article.id} {...article} />)}
          </div>
          
          <div className="text-center">
            <Link to="/articles">
              <Button className="text-white button-transition bg-[#00d09e]">
                לכל המאמרים
                <ArrowLeft size={16} className="mr-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section with Background Image */}
      <section className="py-16 md:py-24 bg-blue-700 text-white relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1590479773265-7464e5d48118?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            מוכנים למצוא את
            <span className="text-[#00D09E] mx-2">בעל המקצוע</span>
            המושלם?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-10 text-lg">
            אלפי בעלי מקצוע מחכים לעזור לכם. שלחו בקשה עכשיו וקבלו הצעות מחיר בחינם.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-[#00D09E] hover:bg-[#00C090] text-white button-transition flex items-center gap-2" onClick={scrollToRequestForm}>
              <FileText size={20} />
              שלח בקשה עכשיו
            </Button>
            <Link to="/search">
              <Button size="lg" variant="outline" className="border-white button-transition flex items-center gap-2 text-green-50 bg-blue-900 hover:bg-blue-800">
                <Search size={20} />
                חפש בעלי מקצוע
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>;
};
export default Index;
