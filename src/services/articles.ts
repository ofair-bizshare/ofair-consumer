
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

export const fetchArticles = async (): Promise<ArticleInterface[]> => {
  try {
    // Add detailed logging to debug the issue
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
      
      // Fetch again after initialization
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
    
    return data;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    throw error;
  }
};

export const uploadArticleImage = async (file: File): Promise<string> => {
  try {
    console.log('Uploading article image:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Date.now()}.${fileExt}`;
    const filePath = `article-images/${fileName}`;
    
    // Create bucket if it doesn't exist
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const imagesBucket = buckets?.find(b => b.name === 'images');
      
      if (!imagesBucket) {
        console.log('Images bucket not found, using public bucket');
      }
    } catch (bucketError) {
      console.error('Error checking buckets:', bucketError);
    }
    
    // Try to upload to the images bucket first
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
      
      // Fallback to public bucket
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
    // Return a placeholder image URL as fallback
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
        published: article.published !== undefined ? article.published : true
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
    return data;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};
