
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

export const fetchArticles = async (): Promise<ArticleInterface[]> => {
  try {
    // Add detailed logging to debug the issue
    console.log('Fetching articles from Supabase...');
    
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
    
    console.log('Articles fetched from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.log('No articles found, initializing with sample data');
      await initializeArticlesIfEmpty();
      
      // Fetch again after initialization
      const { data: initializedData, error: secondError } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
        
      if (secondError) {
        console.error('Error fetching articles after initialization:', secondError);
        throw secondError;
      }
      
      return initializedData || [];
    }
    
    return data;
  } catch (error) {
    console.error('Error in fetchArticles:', error);
    throw error;
  }
};

// Function to initialize articles if the table is empty
const initializeArticlesIfEmpty = async (): Promise<void> => {
  try {
    // Sample article data
    const sampleArticles = [
      {
        title: '10 טיפים לחיסכון בחשמל בבית',
        content: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'ישראל ישראלי',
        published: true
      },
      {
        title: 'מדריך לבחירת קבלן שיפוצים אמין',
        content: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
        image: 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'דוד לוי',
        published: true
      },
      {
        title: 'איך לתחזק מערכת אינסטלציה ביתית',
        content: 'מדריך מקיף לתחזוקה בסיסית של מערכת האינסטלציה בבית שלכם למניעת נזילות ובעיות עתידיות. תוכן מפורט של המאמר יופיע כאן...',
        summary: 'מדריך מקיף לתחזוקה בסיסית של מערכת האינסטלציה בבית שלכם למניעת נזילות ובעיות עתידיות.',
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
        author: 'רונית כהן',
        published: true
      }
    ];
    
    // Insert sample articles
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
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .eq('published', true)
      .maybeSingle();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
};

export const uploadArticleImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `article-images/${fileName}`;
    
    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: publicURL } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);
    
    if (!publicURL) throw new Error('Failed to get public URL');
    
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading article image:', error);
    throw error;
  }
};

export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleInterface> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        ...article,
        published: true
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned from article creation');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};
