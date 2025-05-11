
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleError from '@/components/articles/ArticleError';
import ArticleLoader from '@/components/articles/ArticleLoader';
import ArticleHeader from '@/components/articles/ArticleHeader';
import ArticleImage from '@/components/articles/ArticleImage';
import ArticleContent from '@/components/articles/ArticleContent';
import { fetchArticleById } from '@/services/articles';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <ArticleLoader />
        </main>
        <Footer />
      </div>
    );
  }

  // Set up SEO and metadata
  const articleImage = article.image || '/placeholder.svg';
  const pageTitle = `${article.title} | oFair`;
  const pageDescription = article.summary || article.title;

  return (
    <div dir="rtl">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={articleImage} />
        <meta property="article:published_time" content={article.created_at} />
        {article.updated_at && <meta property="article:modified_time" content={article.updated_at} />}
        {article.category && <meta property="article:section" content={article.category} />}
      </Helmet>
      
      <Header />
      
      <main className="pt-28 pb-16">
        <div className="container mx-auto px-6">
          <article className="max-w-4xl mx-auto">
            <ArticleHeader 
              title={article.title}
              date={article.date}
              category={article.category}
              author={article.author}
            />
            
            <ArticleImage 
              src={article.image} 
              alt={article.title} 
            />
            
            <ArticleContent content={article.content} />
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArticleDetail;
