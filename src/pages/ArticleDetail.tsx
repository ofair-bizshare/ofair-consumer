
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, Calendar, Tag, Facebook, Twitter, LinkIcon, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { fetchArticleById } from '@/services/articles';
import { ArticleInterface } from '@/types/dashboard';

// Default fallback image from public folder
const FALLBACK_IMAGE = '/placeholder.svg';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<ArticleInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToTop();
    
    const fetchArticle = async () => {
      try {
        setLoading(true);
        if (!id) {
          setError('מזהה המאמר חסר');
          return;
        }
        
        const articleData = await fetchArticleById(id);
        if (!articleData) {
          setError('המאמר המבוקש לא נמצא');
          return;
        }
        
        // Check and clean up image URL if it's from placeholder.com (which seems to be failing)
        if (articleData.image && articleData.image.includes('placeholder.com')) {
          articleData.image = FALLBACK_IMAGE;
        }
        
        setArticle(articleData);
      } catch (err) {
        console.error('Error loading article:', err);
        setError('אירעה שגיאה בטעינת המאמר');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
  }, [id]);

  const handleImageError = () => {
    setImageError(true);
  };

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto mb-4"></div>
            <p className="text-gray-600">טוען מאמר...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">שגיאה בטעינת המאמר</h2>
            <p className="text-gray-600 mb-6">{error || 'המאמר לא נמצא'}</p>
            <div className="space-x-4 space-x-reverse">
              <Button onClick={() => navigate(-1)} variant="outline">
                חזרה לעמוד הקודם
              </Button>
              <Button onClick={() => navigate('/articles')}>
                לכל המאמרים
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen" dir="rtl">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <Helmet>
          <title>{`${article.title} | oFair`}</title>
          <meta name="description" content={article.summary || article.excerpt || ''} />
          <meta property="og:title" content={article.title} />
          <meta property="og:description" content={article.summary || article.excerpt || ''} />
          <meta property="og:image" content={article.image || ''} />
        </Helmet>

        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">ראשי</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <Link to="/articles" className="hover:text-blue-600 transition-colors">מאמרים</Link>
            <ChevronRight className="mx-2 h-4 w-4" />
            <span className="text-gray-700">{article.title}</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">{article.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-500 text-sm gap-4 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 ml-1" />
                <span>{article.date || new Date(article.created_at).toLocaleDateString('he-IL')}</span>
              </div>
              {article.category && (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 ml-1" />
                  <span>{article.categoryLabel || article.category}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center">
                  <User className="h-4 w-4 ml-1" />
                  <span>{article.author}</span>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="h-4 w-4 ml-1" />
                <span>זמן קריאה: {article.readTime || '3 דקות'}</span>
              </div>
            </div>
          </div>

          {(article.image && !imageError) ? (
            <div className="rounded-xl overflow-hidden mb-8 shadow-lg">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-full h-auto object-cover"
                onError={handleImageError}
              />
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden mb-8 bg-gray-100 flex items-center justify-center h-64">
              <div className="text-center p-6">
                <div className="text-gray-400 text-4xl mb-2">🖼️</div>
                <p className="text-gray-500">{article.title}</p>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none mb-10">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p className="text-gray-500 text-center py-6">
                תוכן המאמר אינו זמין כרגע. אנא נסה שוב מאוחר יותר.
              </p>
            )}
          </div>

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
