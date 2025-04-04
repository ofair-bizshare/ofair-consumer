
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, ArrowLeft, Clock, Tag, User } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { fetchArticles } from '@/services/articles';
import { ArticleInterface } from '@/types/dashboard';

// Sample article categories (these should come from the database in future iterations)
const categories = [
  { id: 'all', label: 'הכל' },
  { id: 'renovations', label: 'שיפוצים' },
  { id: 'electricity', label: 'חשמל' },
  { id: 'plumbing', label: 'אינסטלציה' },
  { id: 'gardening', label: 'גינון' },
  { id: 'decoration', label: 'עיצוב וקישוט' },
  { id: 'maintenance', label: 'תחזוקת בית' },
];

const Articles = () => {
  const [articles, setArticles] = useState<ArticleInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch articles from database
  useEffect(() => {
    const getArticles = async () => {
      try {
        setLoading(true);
        const articlesData = await fetchArticles();
        setArticles(articlesData);
      } catch (err) {
        console.error('Error fetching articles:', err);
        setError('שגיאה בטעינת המאמרים. אנא נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    getArticles();
  }, []);

  // Featured articles - take the first 3
  const featuredArticles = articles.slice(0, 3);

  // Filter articles based on selected category and search query
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeTab === 'all' || article.category === activeTab;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (article.categoryLabel && article.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && (searchQuery === '' || matchesSearch);
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">טוען מאמרים...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">שגיאה בטעינת המאמרים</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>נסה שוב</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
      {featuredArticles.length > 0 && (
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
      )}
      
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
