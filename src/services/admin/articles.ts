
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

/**
 * Creates a new article
 * @param article Article data
 * @returns Promise<boolean> True if successful, false otherwise
 */
export const createArticle = async (article: Omit<ArticleInterface, 'id' | 'created_at'>): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('articles').insert({
      title: article.title,
      content: article.content,
      summary: article.summary,
      image: article.image,
      author: article.author,
      published: article.published
    });
    
    if (error) {
      console.error('Error creating article:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error creating article:', error);
    return false;
  }
};
