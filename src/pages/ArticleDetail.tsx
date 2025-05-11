import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleError from '@/components/articles/ArticleError';
import { fetchArticleById } from '@/services/articles';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        if (!id) {
          setError("מזהה מאמר חסר");
          setLoading(false);
          return;
        }
        
        const articleData = await fetchArticleById(id);
        
        if (!articleData) {
          setError("המאמר לא נמצא");
          setLoading(false);
          return;
        }
        
        setArticle(articleData);
      } catch (err) {
        console.error("Error loading article:", err);
        setError("אירעה שגיאה בטעינת המאמר");
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [id]);

  const handleImageError = () => {
    setImgError(true);
  };

  // Show error state if we have an error or if the article failed to load
  if (error || (!loading && !article)) {
    return (
      <div dir="rtl">
        <Helmet>
          <title>שגיאה בטעינת המאמר | oFair</title>
          <meta name="description" content="לא ניתן לטעון את המאמר המבוקש" />
        </Helmet>
        <Header />
        <main className="pt-28 pb-16">
          <ArticleError message={error || "לא ניתן לטעון את המאמר המבוקש"} />
        </main>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div dir="rtl">
        <Header />
        <main className="pt-28 pb-16 container mx-auto">
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00d09e]"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ensure article has an image or use a fallback
  const articleImage = imgError || !article.image || article.image.includes('via.placeholder.com') 
    ? '/placeholder.svg'
    : article.image;

  return (
    <div dir="rtl">
      <Helmet>
        <title>{article.title} | oFair</title>
        <meta name="description" content={article.summary} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.summary} />
        <meta property="og:image" content={articleImage} />
      </Helmet>
      
      <Header />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          <article className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
                <span>{article.date}</span>
                {article.category && <span>{article.category}</span>}
              </div>
              <h1 className="text-3xl font-bold text-blue-700 mb-4">{article.title}</h1>
              {article.author && <p className="text-gray-600">מאת: {article.author}</p>}
            </div>
            
            <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
              <img 
                src={articleImage} 
                alt={article.title}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </div>
            
            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              {article.content 
                ? <div dangerouslySetInnerHTML={{ __html: article.content }} /> 
                : <p>תוכן המאמר אינו זמין כרגע.</p>
              }
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
