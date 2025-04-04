
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import { fetchArticles, searchArticles, Article } from '@/services/articles';

const Articles = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

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

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setSearching(true);
    
    try {
      if (!searchQuery.trim()) {
        setFilteredArticles(articles);
      } else {
        const results = await searchArticles(searchQuery);
        setFilteredArticles(results);
      }
    } catch (error) {
      console.error('Error searching articles:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredArticles(articles);
  };

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Helmet>
        <title>מאמרים ומדריכים | oFair - המדריך המלא לשיפוצים וטיפים לאחזקת הבית</title>
        <meta name="description" content="מאמרים ומדריכים מקצועיים בנושאי שיפוצים, תחזוקת בית, וטיפים מקצועיים מבעלי מקצוע מובילים." />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow pt-28 pb-16">
        <div className="container mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-[#00D09E]">מאמרים</span> ומדריכים
            </h1>
            <p className="text-gray-600">
              מידע מקצועי, טיפים ומדריכים בנושאי שיפוצים ותחזוקת הבית
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="mb-8 flex gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="חפש מאמרים..."
                className="pr-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              type="submit" 
              className="bg-[#00D09E] hover:bg-[#00C090]"
              disabled={searching}
            >
              {searching ? 'מחפש...' : 'חיפוש'}
            </Button>
            {searchQuery && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleResetSearch}
              >
                נקה
              </Button>
            )}
          </form>
          
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
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
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
