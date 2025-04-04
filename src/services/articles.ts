
import { supabase } from '@/integrations/supabase/client';

export interface Article {
  id: string;
  title: string;
  content: string;
  summary?: string;
  image?: string;
  author?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Fetches all published articles
 */
export const fetchArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

/**
 * Fetches all articles (including unpublished) for admin
 */
export const fetchAllArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all articles:', error);
    return [];
  }
};

/**
 * Searches articles by title or content
 */
export const searchArticles = async (query: string): Promise<Article[]> => {
  try {
    if (!query || query.trim().length === 0) {
      return await fetchArticles();
    }
    
    // Search by title, content, or summary containing the query
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching articles:', error);
    return [];
  }
};

/**
 * Fetches a single article by ID
 */
export const fetchArticleById = async (id: string): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching article by ID:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching article by ID:', error);
    return null;
  }
};

/**
 * Creates a new article
 */
export const createArticle = async (article: Partial<Article>): Promise<Article | null> => {
  try {
    // Ensure that required fields are present
    if (!article.title || !article.content) {
      console.error('Error creating article: Missing required fields');
      return null;
    }

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: article.content,
        summary: article.summary,
        image: article.image,
        author: article.author,
        published: article.published !== undefined ? article.published : true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating article:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
};

/**
 * Updates an existing article
 */
export const updateArticle = async (id: string, updates: Partial<Article>): Promise<Article | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating article:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error updating article:', error);
    return null;
  }
};

/**
 * Deletes an article
 */
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting article:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
};

/**
 * Fetches related articles based on the current article
 */
export const fetchRelatedArticles = async (currentArticleId: string): Promise<Article[]> => {
  try {
    // For now, just fetch other articles
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .neq('id', currentArticleId)
      .limit(3);

    if (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
};

/**
 * Uploads an article image
 */
export const uploadArticleImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Try uploading to the articles bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('articles')
      .upload(`images/${fileName}`, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (uploadError) {
      console.error(`Error uploading to articles bucket:`, uploadError);
      
      // Try uploading to the images bucket as fallback
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from('images')
        .upload(`articles/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (fallbackError) {
        console.error(`Error uploading to images bucket:`, fallbackError);
        return 'https://via.placeholder.com/800x400?text=Upload+Failed';
      }
      
      const { data: fallbackUrl } = supabase.storage
        .from('images')
        .getPublicUrl(`articles/${fileName}`);
      
      return fallbackUrl.publicUrl;
    }
    
    // Get public URL from articles bucket
    const { data: publicURL } = supabase.storage
      .from('articles')
      .getPublicUrl(`images/${fileName}`);
    
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error uploading article image:', error);
    // Return a placeholder image URL as fallback
    return 'https://via.placeholder.com/800x400?text=Upload+Failed';
  }
};
