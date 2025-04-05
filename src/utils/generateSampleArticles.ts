
import { supabase } from '@/integrations/supabase/client';
import { articleCategoryOptions } from '@/components/admin/articles/articleSchema';

export const generateSampleArticles = async () => {
  try {
    // First, check if articles already exist
    const { data: existingArticles, error: checkError } = await supabase
      .from('articles')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing articles:', checkError);
      return;
    }
    
    // If articles already exist, don't create sample ones
    if (existingArticles && existingArticles.length > 0) {
      console.log('Articles already exist. Skipping sample generation.');
      return;
    }
    
    console.log('No articles found. Creating sample articles...');
    
    // Check if the articles table has a category column
    const { error: categoryCheckError } = await supabase
      .from('articles')
      .select('category')
      .limit(1)
      .maybeSingle();
    
    const hasCategoryColumn = !categoryCheckError || 
      !categoryCheckError.message.includes("column 'category' does not exist");
    
    // If the category column doesn't exist, we'll add it
    if (!hasCategoryColumn) {
      console.log('Adding category column to articles table...');
      // This is handled separately through SQL migrations
    }
    
    // Create sample articles for each category
    await Promise.all(articleCategoryOptions.map(async (categoryOption) => {
      // Create two articles per category
      for (let i = 1; i <= 2; i++) {
        const title = `מאמר ${i} על ${categoryOption.label}`;
        const summary = `זהו סיכור קצר למאמר ${i} בקטגוריה ${categoryOption.label}. כאן תוכל למצוא מידע מועיל.`;
        const content = `
# ${title}

זהו תוכן לדוגמה עבור מאמר בקטגוריה ${categoryOption.label}.

## כותרת משנה

כאן יש מידע נוסף שיעניין את הקוראים שלנו. אנחנו מספקים מידע איכותי ומקצועי בתחום.

- נקודה חשובה ראשונה
- נקודה חשובה שנייה
- נקודה חשובה שלישית

## סיכום

לסיכום, אנו מקווים שמצאתם את המידע הזה שימושי. אם יש לכם שאלות נוספות, אנא צרו קשר.
`;
        
        const article = {
          title,
          summary,
          content,
          author: 'צוות אופייר',
          published: true,
          category: categoryOption.value
        };
        
        const { error: insertError } = await supabase
          .from('articles')
          .insert(article);
          
        if (insertError) {
          console.error(`Error creating sample article for category ${categoryOption.label}:`, insertError);
        }
      }
    }));
    
    console.log('Sample articles created successfully!');
    
  } catch (error) {
    console.error('Error generating sample articles:', error);
  }
};
