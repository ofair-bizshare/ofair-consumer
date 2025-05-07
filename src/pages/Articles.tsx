
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X, Folder, Book, Grid2X2, Wrench } from 'lucide-react';
import { fetchArticles, searchArticles, Article } from '@/services/articles';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useDebounce } from '@/hooks/useDebounce';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { ScrollArea } from '@/components/ui/scroll-area';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Add debounced search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const fetchedArticles = await fetchArticles();
        setArticles(fetchedArticles);
        setFilteredArticles(fetchedArticles);
      } catch (error) {
        console.error('Error loading articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Use debounced search query to trigger the search
  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedSearchQuery.trim()) {
        if (activeTab === 'all') {
          setFilteredArticles(articles);
        } else {
          const filtered = articles.filter(article => article.category === activeTab);
          setFilteredArticles(filtered);
        }
        return;
      }
      
      setSearching(true);
      try {
        const results = await searchArticles(debouncedSearchQuery);
        // Apply category filter to search results if needed
        if (activeTab !== 'all') {
          const categoryFiltered = results.filter(article => article.category === activeTab);
          setFilteredArticles(categoryFiltered);
        } else {
          setFilteredArticles(results);
        }
      } catch (error) {
        console.error('Error searching articles:', error);
      } finally {
        setSearching(false);
      }
    };
    
    performSearch();
  }, [debouncedSearchQuery, activeTab, articles]);

  const handleResetSearch = () => {
    setSearchQuery('');
    if (activeTab === 'all') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article => article.category === activeTab);
      setFilteredArticles(filtered);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    if (searchQuery.trim()) {
      // If there's a search query, filter the results by category
      const searchAndCategoryFiltered = value === 'all' 
        ? filteredArticles 
        : filteredArticles.filter(article => article.category === value);
      setFilteredArticles(searchAndCategoryFiltered);
    } else {
      // If no search query, just filter by category
      if (value === 'all') {
        setFilteredArticles(articles);
      } else {
        const filtered = articles.filter(article => article.category === value);
        setFilteredArticles(filtered);
      }
    }
  };

  const categories = [
    { value: 'all', label: 'הכל', icon: <Grid2X2 size={16} /> },
    { value: 'general', label: 'כללי', icon: <Folder size={16} /> },
    { value: 'professionals', label: 'בעלי מקצוע', icon: <Book size={16} /> },
    { value: 'home-improvement', label: 'שיפוץ הבית', icon: <Book size={16} /> },
    { value: 'diy', label: 'עשה זאת בעצמך', icon: <Book size={16} /> },
    { value: 'tips', label: 'טיפים', icon: <Book size={16} /> },
    { value: 'guides', label: 'מדריכים', icon: <Book size={16} /> },
    { value: 'electrician', label: 'חשמלאי', icon: <Wrench size={16} /> },
    { value: 'plumber', label: 'אינסטלטור', icon: <Wrench size={16} /> },
    { value: 'carpenter', label: 'נגר', icon: <Wrench size={16} /> },
    { value: 'painter', label: 'צבע', icon: <Wrench size={16} /> },
    { value: 'gardener', label: 'גנן', icon: <Wrench size={16} /> },
    { value: 'renovation', label: 'שיפוצניק', icon: <Wrench size={16} /> },
    { value: 'locksmith', label: 'מנעולן', icon: <Wrench size={16} /> },
    { value: 'air-conditioning', label: 'מיזוג אוויר', icon: <Wrench size={16} /> }
  ];

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>מאמרים ומדריכים | oFair - המדריך המלא לשיפוצים וטיפים לאחזקת הבית</title>
        <meta name="description" content="מאמרים ומדריכים מקצועיים בנושאי שיפוצים, תחזוקת בית, וטיפים מקצועיים מבעלי מקצוע מובילים." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#00D09E]">מאמרים</span> ומדריכים
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              מידע מקצועי, טיפים ומדריכים בנושאי שיפוצים ותחזוקת הבית
            </p>
          </div>
          
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="חפש מאמרים..."
                  className="pr-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={handleResetSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="נקה חיפוש"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {searching && (
                <div className="py-2 px-3 bg-gray-100 rounded-md text-sm text-gray-600">
                  מחפש...
                </div>
              )}
            </div>
          </div>
          
          {/* Improved filter tabs with ScrollArea */}
          <div className="mb-8">
            <Card className="rounded-xl shadow-md overflow-hidden border-0">
              <ScrollArea className="w-full py-2 border-b border-gray-100">
                <div className="min-w-full px-4 py-2">
                  <ToggleGroup 
                    type="single" 
                    value={activeTab}
                    onValueChange={(value) => value && handleTabChange(value)}
                    className="flex gap-2 min-w-max"
                  >
                    {categories.map((category) => (
                      <ToggleGroupItem 
                        key={category.value} 
                        value={category.value}
                        className={`transition-all flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap ${
                          activeTab === category.value ? 
                          'bg-gradient-to-r from-teal-500 to-teal-400 text-white shadow-sm' : 
                          'text-gray-700 hover:bg-gray-100'
                        }`}
                        aria-label={category.label}
                      >
                        {category.icon}
                        <span>{category.label}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              </ScrollArea>
            </Card>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  summary={article.summary || article.content.substring(0, 150) + '...'}
                  image={article.image || 'https://via.placeholder.com/400x250?text=Article+Image'}
                  date={new Date(article.created_at).toLocaleDateString('he-IL')}
                  category={article.category}
                  author={article.author}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">לא נמצאו מאמרים</h3>
              <p className="text-gray-500">
                {searchQuery ? 'לא נמצאו מאמרים התואמים את חיפוש זה.' : 'אנחנו עובדים על הוספת מאמרים חדשים.'}
              </p>
              {searchQuery && (
                <Button 
                  onClick={handleResetSearch} 
                  variant="outline" 
                  className="mt-4"
                >
                  אפס חיפוש
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Articles;
