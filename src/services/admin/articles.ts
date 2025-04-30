
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { formatError } from '@/utils/errorUtils';
import { createBucketIfNotExists, findBucketByName } from './utils/storageUtils';
import { ArticleInterface } from '@/types/dashboard';

/**
 * Creates a new article
 * @param {object} articleData - Article data
 * @returns {Promise<ArticleInterface | null>} - Created article
 */
export const createArticle = async (articleData: any): Promise<ArticleInterface | null> => {
  try {
    console.log('Creating article with data:', articleData);
    
    // Prepare data for insert
    const articleToInsert = {
      ...articleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // Insert the article
    const { data, error } = await supabase
      .from('articles')
      .insert(articleToInsert)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating article:', error);
      throw error;
    }
    
    console.log('Article created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createArticle:', error);
    throw new Error(formatError(error, 'Failed to create article'));
  }
};

/**
 * Updates an article
 * @param {string} id - Article ID
 * @param {object} articleData - Article data to update
 * @returns {Promise<ArticleInterface | null>} - Updated article
 */
export const updateArticle = async (id: string, articleData: any): Promise<ArticleInterface | null> => {
  try {
    console.log(`Updating article ${id} with data:`, articleData);
    
    // Prepare data for update
    const articleToUpdate = {
      ...articleData,
      updated_at: new Date().toISOString(),
    };
    
    // Update the article
    const { data, error } = await supabase
      .from('articles')
      .update(articleToUpdate)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      console.error('Error updating article:', error);
      throw error;
    }
    
    console.log('Article updated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in updateArticle:', error);
    throw new Error(formatError(error, 'Failed to update article'));
  }
};

/**
 * Deletes an article
 * @param {string} id - Article ID
 * @returns {Promise<boolean>} - Whether deletion was successful
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
      throw error;
    }
    
    console.log('Article deleted successfully');
    return true;
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    throw new Error(formatError(error, 'Failed to delete article'));
  }
};

/**
 * Uploads an article image and returns the URL
 * @param {File} imageFile - Image file to upload
 * @returns {Promise<string>} - URL of the uploaded image
 */
export const uploadArticleImage = async (imageFile: File): Promise<string> => {
  try {
    console.log('Uploading article image', imageFile.name);
    
    // First ensure the bucket exists
    await createBucketIfNotExists('articles', true);
    
    // Generate a unique file name to avoid conflicts
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `cover/${fileName}`;
    
    // Try to find the bucket with case-insensitive matching
    const bucketName = await findBucketByName('articles') || 'articles';
    console.log(`Using bucket: ${bucketName} for article image upload`);
    
    // Upload the file
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(filePath, imageFile, {
        cacheControl: '3600',
        upsert: true,
      });
      
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      throw uploadError;
    }
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
      
    console.log('Image uploaded successfully:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadArticleImage:', error);
    throw new Error(formatError(error, 'Failed to upload image'));
  }
};
