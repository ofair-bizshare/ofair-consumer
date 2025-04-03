
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

/**
 * Creates a new article
 * @param article Article data
 * @returns Promise<ArticleInterface | null> The created article data or null on error
 */
export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleInterface | null> => {
  try {
    console.log('Creating article in admin service:', article);
    
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
      console.error('Error creating article in admin service:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned from article creation');
      throw new Error('No data returned from article creation');
    }
    
    console.log('Article created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createArticle admin service:', error);
    throw error;
  }
};

/**
 * Updates an existing article
 * @param id Article ID to update
 * @param article Article data to update
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const updateArticle = async (id: string, article: Partial<Omit<ArticleInterface, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> => {
  try {
    console.log(`Updating article ${id}:`, article);
    
    const { data, error } = await supabase
      .from('articles')
      .update({
        ...article,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error('Error updating article:', error);
      return false;
    }
    
    console.log('Article updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating article:', error);
    return false;
  }
};

/**
 * Deletes an article
 * @param id Article ID to delete
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const deleteArticle = async (id: string): Promise<boolean> => {
  try {
    console.log(`Deleting article ${id}`);
    
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting article:', error);
      return false;
    }
    
    console.log('Article deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
};
