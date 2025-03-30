
import { supabase } from '@/integrations/supabase/client';
import { ArticleInterface } from '@/types/dashboard';

export const fetchArticles = async (): Promise<ArticleInterface[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching articles:', error);
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
