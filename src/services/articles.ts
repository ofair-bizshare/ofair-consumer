import { supabase } from '@/integrations/supabase/client';

export interface ArticleInterface {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  category?: string;
  excerpt?: string;
  date?: string;
  readTime?: string;
  categoryLabel?: string;
}

export const fetchArticles = async (): Promise<ArticleInterface[]> => {
  try {
    console.log('Fetching articles from Supabase...');
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    
    console.log('Articles fetched from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.log('No articles found, initializing with sample data');
      await initializeArticlesIfEmpty();
      
      const { data: initializedData, error: secondError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (secondError) {
        console.error('Error fetching articles after initialization:', secondError);
        throw secondError;
      }
      
      return initializedData || [];
    }
    
    return data.map(article => ({
      ...article,
      categoryLabel: article.category || 'כללי',
      excerpt: article.summary || article.content.substring(0, 150) + '...',
      readTime: estimateReadTime(article.content) + ' דקות',
      date: formatDate(article.created_at)
    }));
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    throw error;
  }
};

const initializeArticlesIfEmpty = async (): Promise<void> => {
  try {
    const sampleArticles = [
      {
        title: '10 טיפים לחיסכון בחשמל בבית',
        content: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'ישראל ישראלי',
        published: true,
        category: 'electricity'
      },
      {
        title: 'מדריך לבחירת קבלן שיפוצים אמין',
        content: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
        image: 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'דוד לוי',
        published: true,
        category: 'renovations'
      },
      {
        title: 'איך לתחזק מערכת אינסטלציה ביתית',
        content: 'מדריך מקיף לתחזוקה בסיסית של מערכת האינסטלציה בבית שלכם למניעת נזילות ובעיות עתידיות. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'מדריך מקיף לתחזוקה בסיסית של מערכת האינסטלציה בבית שלכם למניעת נזילות ובעיות עתידיות.',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'רונית כהן',
        published: true,
        category: 'plumbing'
      }
    ];
    
    const { error } = await supabase
      .from('articles')
      .insert(sampleArticles);
      
    if (error) {
      console.error('Error initializing articles:', error);
      throw error;
    }
    
    console.log('Sample articles inserted successfully');
  } catch (error) {
    console.error('Error in initializeArticlesIfEmpty:', error);
    throw error;
  }
};

export const getArticleById = async (id: string): Promise<ArticleInterface | null> => {
  try {
    console.log('Fetching article by ID:', id);
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching article by ID:', error);
      throw error;
    }
    
    console.log('Article data:', data);
    
    if (!data) {
      return null;
    }
    
    return getArticleFromData(data);
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
};

export const getArticleFromData = (data: any): ArticleInterface => {
  if (!data) return null;
  
  const excerpt = data.summary?.length > 120 ? data.summary.substring(0, 120) + '...' : data.summary;
  const readTime = `${Math.max(Math.ceil(data.content?.length / 1000), 1)} דקות קריא��`;
  const date = new Date(data.created_at).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  let categoryLabel = 'כללי';
  if (data.category) {
    const categoryMap: {[key: string]: string} = {
      'general': 'כללי',
      'maintenance': 'תחזוקה',
      'renovation': 'שיפוצים',
      'decoration': 'עיצוב',
      'garden': 'גינון',
      'electricity': 'חשמל',
      'plumbing': 'אינסטלציה'
    };
    categoryLabel = categoryMap[data.category] || data.category;
  }
  
  return {
    id: data.id,
    title: data.title,
    summary: data.summary,
    content: data.content,
    author: data.author,
    image: data.image,
    published: data.published,
    created_at: data.created_at,
    updated_at: data.updated_at,
    category: data.category,
    excerpt,
    date,
    readTime,
    categoryLabel
  };
};

const estimateReadTime = (content: string): string => {
  const wordCount = content.split(/\s+/).length;
  const readTimeMinutes = Math.max(1, Math.round(wordCount / 200));
  return readTimeMinutes.toString();
};

const formatDate = (dateStr: string | null): string => {
  if (!dateStr) return 'ללא תאריך';
  
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('he-IL', options);
};

export const uploadArticleImage = async (file: File): Promise<string> => {
  try {
    console.log('Uploading article image:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `article-images/${fileName}`;
    
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const imagesBucket = buckets?.find(b => b.name === 'images');
      
      if (!imagesBucket) {
        console.log('Images bucket not found, using public bucket');
      }
    } catch (bucketError) {
      console.error('Error checking buckets:', bucketError);
    }
    
    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading to images bucket:', uploadError);
        throw uploadError;
      }
      
      const { data: publicURL } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      console.log('Successfully uploaded to images bucket:', publicURL.publicUrl);
      return publicURL.publicUrl;
    } catch (imagesError) {
      console.error('Failed to upload to images bucket, trying public bucket:', imagesError);
      
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from('public')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (fallbackError) {
        console.error('Error uploading to public bucket:', fallbackError);
        throw fallbackError;
      }
      
      const { data: fallbackURL } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);
      
      console.log('Successfully uploaded to public bucket:', fallbackURL.publicUrl);
      return fallbackURL.publicUrl;
    }
  } catch (error) {
    console.error('Error uploading article image:', error);
    return 'https://via.placeholder.com/800x400?text=Article+Image+Not+Available';
  }
};

export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleInterface> => {
  try {
    console.log('Creating article:', article);
    
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: article.content,
        summary: article.summary || article.content.substring(0, 150) + '...',
        image: article.image || 'https://via.placeholder.com/800x400?text=No+Image',
        author: article.author,
        published: article.published !== undefined ? article.published : true,
        category: article.category
      })
      .select()
      .single();
      
    if (error) {
      console.error('Error creating article:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from article creation');
      throw new Error('No data returned from article creation');
    }
    
    console.log('Article created successfully:', data);
    return getArticleFromData(data);
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};
