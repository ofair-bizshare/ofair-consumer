
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, ArrowLeft, Clock, Tag, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

// Sample article categories
const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'renovations', label: 'שיפוצים' },
  { id: 'electricity', label: 'חשמל' },
  { id: 'plumbing', label: 'אינסטלציה' },
  { id: 'gardening', label: 'גינון' },
  { id: 'decoration', label: 'עיצוב וקישוט' },
  { id: 'maintenance', label: 'תחזוקת בית' },
];

// Sample articles data
const articles = [
  {
    id: '1',
    title: '10 טיפים לחיסכון בחשמל בבית',
    excerpt: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: '10 במאי, 2023',
    readTime: '5 דקות',
    category: 'electricity',
    categoryLabel: 'חשמל וחיסכון',
    author: 'ישראל ישראלי',
  },
  {
    id: '2',
    title: 'מדריך לבחירת קבלן שיפוצים אמין',
    excerpt: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: '18 באפריל, 2023',
    readTime: '7 דקות',
    category: 'renovations',
    categoryLabel: 'שיפוצים',
    author: 'דוד לוי',
  },
  {
    id: '3',
    title: 'איך לתחזק מערכת אינסטלציה ביתית',
    excerpt: 'מדריך מקיף לתחזוקה בסיסית של מערכת האינסטלציה בבית שלכם למניעת נזילות ובעיות עתידיות.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: '5 במרץ, 2023',
    readTime: '6 דקות',
    category: 'plumbing',
    categoryLabel: 'אינסטלציה',
    author: 'רונית כהן',
  },
  {
    id: '4',
    title: 'עיצוב גינה קטנה: מקסימום יופי במינימום שטח',
    excerpt: 'רעיונות ודרכים יצירתיות לנצל שטח גינה קטן ולהפוך אותו לפינת חמד ירוקה ומזמינה.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1476&q=80',
    date: '22 בפברואר, 2023',
    readTime: '4 דקות',
    category: 'gardening',
    categoryLabel: 'גינון',
    author: 'מיכל גרין',
  },
  {
    id: '5',
    title: 'כיצד לבחור צבעים מתאימים לחדרי הבית',
    excerpt: 'מדריך צבעים מקיף שיעזור לכם לבחור את הצבעים המתאימים ביותר לכל חדר בבית שלכם.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1562314442-3e8cde761b20?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: '15 בינואר, 2023',
    readTime: '8 דקות',
    category: 'decoration',
    categoryLabel: 'עיצוב וקישוט',
    author: 'עדי אלון',
  },
  {
    id: '6',
    title: 'בדיקות תקופתיות חשובות לתחזוקת הבית',
    excerpt: 'רשימת בדיקות תקופתיות שכדאי לבצע בביתכם כדי למנוע בעיות גדולות ויקרות יותר בעתיד.',
    content: 'תוכן מפורט של המאמר יופיע כאן...',
    image: 'https://images.unsplash.com/photo-1531183456605-6aaf78787e08?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    date: '5 בדצמבר, 2022',
    readTime: '5 דקות',
    category: 'maintenance',
    categoryLabel: 'תחזוקת בית',
    author: 'יובל נחמיאס',
  },
];

// Featured articles
const featuredArticles = articles.slice(0, 3);

const Articles = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter articles based on selected category and search query
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeTab === 'all' || article.category === activeTab;
    const matchesSearch = article.title.includes(searchQuery) || 
                          article.excerpt.includes(searchQuery) ||
                          article.categoryLabel.includes(searchQuery);
    return matchesCategory && (searchQuery === '' || matchesSearch);
  });

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>טיפים ומאמרים מקצועיים | oFair</title>
        <meta name="description" content="מאמרים מקצועיים וטיפים שיעזרו לכם בתחזוקת הבית, שיפוצים, גינון ועוד תחומים." />
      </Helmet>
      
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 bg-gradient-to-br from-blue-50 to-teal-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
              <span className="text-teal-500">טיפים</span> ומאמרים מקצועיים
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              מאמרים מקצועיים ומדריכים מפורטים שיעזרו לכם להפיק את המיטב מביתכם ולבחור את בעלי המקצוע הנכונים
            </p>
            
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="search"
                placeholder="חיפוש מאמרים..."
                className="pl-4 pr-10 py-3 bg-white rounded-full shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Articles */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-8">
            <span className="text-teal-500">מאמרים</span> מובילים
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div key={article.id} className={`rounded-xl overflow-hidden shadow-lg bg-white transition-transform duration-300 hover:-translate-y-2 ${index === 0 ? 'lg:col-span-3' : ''}`}>
                <div className={`${index === 0 ? 'lg:flex' : ''}`}>
                  <div className={`${index === 0 ? 'lg:w-1/2' : ''}`}>
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className={`w-full h-60 object-cover ${index === 0 ? 'lg:h-96' : ''}`}
                    />
                  </div>
                  
                  <div className={`p-6 ${index === 0 ? 'lg:w-1/2 lg:flex lg:flex-col lg:justify-center' : ''}`}>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <span className="bg-teal-50 text-teal-600 rounded-full px-3 py-1 font-medium">
                        {article.categoryLabel}
                      </span>
                      <span className="mx-3 flex items-center">
                        <Calendar size={16} className="ml-1" />
                        {article.date}
                      </span>
                      <span className="flex items-center">
                        <Clock size={16} className="ml-1" />
                        {article.readTime}
                      </span>
                    </div>
                    
                    <h3 className={`font-bold text-gray-800 mb-3 ${index === 0 ? 'text-2xl' : 'text-xl'}`}>
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <User size={16} className="ml-1" />
                        {article.author}
                      </div>
                      
                      <Link to={`/articles/${article.id}`}>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700 p-0 flex items-center">
                          קרא עוד
                          <ArrowLeft size={16} className="mr-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* All Articles with Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            <span className="text-teal-500">כל</span> המאמרים
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
            <TabsList className="flex flex-wrap justify-start border-b border-gray-200 pb-0 mb-6 bg-transparent">
              {categories.map(category => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2 mr-2 mb-2 rounded-md data-[state=active]:bg-teal-500 data-[state=active]:text-white"
                >
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.length > 0 ? (
                filteredArticles.map(article => (
                  <Link to={`/articles/${article.id}`} key={article.id}>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                      <div className="relative h-48">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-0 right-0 m-3">
                          <span className="bg-white/90 backdrop-blur-sm text-teal-600 text-xs font-medium rounded-full px-2.5 py-1">
                            {article.categoryLabel}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <div className="flex items-center text-xs text-gray-500 mb-2 gap-3">
                          <span className="flex items-center">
                            <Calendar size={14} className="ml-1" />
                            {article.date}
                          </span>
                          <span className="flex items-center">
                            <Clock size={14} className="ml-1" />
                            {article.readTime}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <div className="flex items-center text-xs text-gray-500">
                            <User size={14} className="ml-1" />
                            {article.author}
                          </div>
                          
                          <span className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center">
                            קרא עוד
                            <ArrowLeft size={14} className="mr-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-500">לא נמצאו מאמרים התואמים את החיפוש שלך</p>
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              הישארו מעודכנים עם 
              <span className="text-teal-300 mx-1">טיפים ומאמרים חדשים</span>
            </h2>
            <p className="text-blue-100 mb-8">
              הירשמו לניוזלטר שלנו וקבלו טיפים ומאמרים חדשים ישירות לתיבת הדואר האלקטרוני שלכם
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="הכנס את כתובת המייל שלך" 
                className="sm:flex-1 bg-white/10 border-transparent text-white placeholder:text-blue-100 focus:border-white"
              />
              <Button className="bg-teal-500 hover:bg-teal-600 text-white">
                הירשם לניוזלטר
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Articles;
