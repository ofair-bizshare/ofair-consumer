
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

/**
 * Uploads an article image
 * @param file Image file to upload
 * @returns Promise<string | null> URL of the uploaded image or null if failed
 */
export const uploadArticleImage = async (file: File): Promise<string | null> => {
  try {
    console.log('Uploading article image:', file.name);
    const fileExt = file.name.split('.').pop();
    const fileName = `article-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Create an array of bucket names to try
    const buckets = ['articles', 'images', 'public'];
    let uploadedUrl = null;
    
    // Try each bucket until one works
    for (const bucket of buckets) {
      try {
        console.log(`Attempting to upload to ${bucket} bucket...`);
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(`articles/${fileName}`, file, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error(`Error uploading to ${bucket} bucket:`, uploadError);
          continue; // Try the next bucket
        }
        
        const { data: publicURL } = supabase.storage
          .from(bucket)
          .getPublicUrl(`articles/${fileName}`);
        
        console.log(`Successfully uploaded to ${bucket} bucket:`, publicURL.publicUrl);
        uploadedUrl = publicURL.publicUrl;
        break; // Successfully uploaded, exit the loop
      } catch (bucketError) {
        console.error(`Failed to upload to ${bucket} bucket:`, bucketError);
        // Continue to the next bucket
      }
    }
    
    if (uploadedUrl) {
      return uploadedUrl;
    }
    
    // If all buckets failed, return a placeholder
    console.warn('All bucket uploads failed, using placeholder image');
    return 'https://via.placeholder.com/800x400?text=No+Image';
  } catch (error) {
    console.error('Error uploading article image:', error);
    // Return a placeholder image URL as fallback
    return 'https://via.placeholder.com/800x400?text=No+Image';
  }
};
