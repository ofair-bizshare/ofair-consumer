
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

/**
 * Create a new article
 * @param article The article to create
 * @returns The created article or null if there was an error
 */
export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at'>): Promise<ArticleInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: article.content,
        summary: article.summary,
        author: article.author,
        image: article.image,
        published: article.published === undefined ? true : article.published,
        category: article.category || 'general'
      })
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

/**
 * Update an existing article
 * @param id The ID of the article to update
 * @param article The updated article data
 * @returns The updated article or null if there was an error
 */
export const updateArticle = async (id: string, article: Partial<ArticleInterface>): Promise<ArticleInterface | null> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update({
        title: article.title,
        content: article.content,
        summary: article.summary,
        author: article.author,
        image: article.image,
        published: article.published,
        category: article.category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

/**
 * Upload an article image to storage
 * @param file The image file to upload
 * @returns The public URL of the uploaded image or null if there was an error
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
      console.error('Error uploading to articles bucket:', uploadError);
      
      // Try uploading to the images bucket as fallback
      const { data: fallbackData, error: fallbackError } = await supabase.storage
        .from('images')
        .upload(`articles/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (fallbackError) {
        console.error('Error uploading to images bucket:', fallbackError);
        return null;
      }
      
      const { data: fallbackUrl } = supabase.storage
        .from('images')
        .getPublicUrl(`articles/${fileName}`);
      
      return fallbackUrl.publicUrl;
    }
    
    // Get the public URL from the articles bucket
    const { data: publicUrl } = supabase.storage
      .from('articles')
      .getPublicUrl(`images/${fileName}`);
    
    return publicUrl.publicUrl;
  } catch (error) {
    console.error('Error uploading article image:', error);
    return null;
  }
};

/**
 * Delete an article
 * @param id The ID of the article to delete
 * @returns True if successful, false otherwise
 */
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
};
