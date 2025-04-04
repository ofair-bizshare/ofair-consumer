
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
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
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
