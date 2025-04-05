
import { supabase } from '@/integrations/supabase/client';
import { articleCategoryOptions } from '@/components/admin/articles/articleSchema';

// Sample article content templates
const articleTemplates = {
  title: [
    "מדריך מקיף ל{profession}",
    "איך לבחור {profession} מקצועי",
    "5 טיפים חשובים לעבודה עם {profession}",
    "הטעויות הנפוצות בבחירת {profession}",
    "כל מה שצריך לדעת על {profession}",
    "מדריך לבחירת {profession} מומחה",
    "הכירו את התחום: {profession}"
  ],
  content: [
    `# מדריך מקיף ל{profession}

## למה חשוב לבחור {profession} מקצועי?

בחירת {profession} מקצועי היא החלטה קריטית שיכולה להשפיע על איכות העבודה וחיי היומיום שלכם. {profession} מקצועי מביא איתו ידע, ניסיון וכלים מתאימים כדי לוודא שהעבודה תתבצע באופן בטיחותי ואיכותי.

## מה לבדוק לפני שבוחרים {profession}?

1. **ניסיון והכשרה** - ודאו שיש לבעל המקצוע ניסיון בתחום ושהוא עבר הכשרה מתאימה
2. **המלצות** - בקשו המלצות מלקוחות קודמים או קראו ביקורות באינטרנט
3. **מחיר** - השוו מחירים בין כמה בעלי מקצוע, אך זכרו שלא תמיד הזול ביותר הוא הטוב ביותר
4. **זמינות** - בדקו את זמני התגובה ויכולת העמידה בלוחות זמנים

## איך למצוא את ה{profession} הטוב ביותר?

באתר שלנו תוכלו למצוא מגוון בעלי מקצוע מובילים בתחום ה{profession}. אנחנו מאמתים את כל בעלי המקצוע ומציגים רק את אלו שעומדים בסטנדרטים הגבוהים ביותר שלנו.

## סיכום

בחירה נכונה של {profession} תחסוך לכם זמן, כסף וכאבי ראש בעתיד. השקיעו בתהליך הבחירה ותיהנו מתוצאות מקצועיות ואיכותיות.`,

    `# 5 טיפים חשובים לעבודה עם {profession}

כשאתם מחפשים {profession} איכותי, חשוב שתדעו מה לחפש וכיצד להתנהל מולו. הנה חמישה טיפים חשובים שיעזרו לכם לקבל את השירות הטוב ביותר:

## 1. בדקו הסמכות ורישיונות

ודאו שה{profession} מחזיק בכל ההסמכות והרישיונות הנדרשים לעבודה בתחומו. זה לא רק עניין חוקי, אלא גם מעיד על מקצועיות ומחויבות לסטנדרטים גבוהים.

## 2. בקשו הערכת מחיר מפורטת

לפני תחילת העבודה, בקשו הצעת מחיר מפורטת שכוללת עלויות חומרים, שעות עבודה, ותנאי תשלום. הדבר יעזור למנוע אי הבנות ותוספות מחיר לא צפויות.

## 3. בדקו עבודות קודמות

בקשו לראות דוגמאות של עבודות קודמות או לשוחח עם לקוחות קודמים. עבודה איכותית מהעבר היא המדד הטוב ביותר להבטחת איכות בעתיד.

## 4. וודאו שיש חוזה ברור

חוזה ברור שמפרט את כל תנאי ההתקשרות הוא חיוני. הוא מגן על שני הצדדים ומבטיח שכולם יודעים למה לצפות.

## 5. עקבו אחר התקדמות העבודה

אל תהססו לבקר באתר העבודה ולעקוב אחר ההתקדמות. תקשורת פתוחה עם ה{profession} תעזור לפתור בעיות במהירות ולהבטיח שהתוצאה הסופית תהיה לשביעות רצונכם.`
  ],
  summary: [
    "המדריך המקיף שלנו ל{profession} יעזור לכם לבחור את בעל המקצוע הנכון ולהבטיח עבודה איכותית",
    "גלו את הטיפים החשובים ביותר לעבודה עם {profession} מקצועי שיחסוך לכם זמן, כסף וכאב ראש",
    "כל מה שצריך לדעת לפני שמזמינים {profession}: המדריך המלא לבחירה נכונה ושקטה",
    "מדריך הצעד-אחר-צעד לבחירת {profession} מקצועי והתנהלות נכונה מולו"
  ]
};

// Helper function to get random element from array
const getRandomElement = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Helper function to format profession name into the template
const formatTemplate = (template: string, profession: string): string => {
  return template.replace(/{profession}/g, profession);
};

// Function to generate sample articles
export const generateSampleArticles = async () => {
  try {
    console.log("Starting to generate sample articles...");
    const imageUrls = [
      "https://via.placeholder.com/800x400?text=Professional+Tips",
      "https://via.placeholder.com/800x400?text=Home+Improvement",
      "https://via.placeholder.com/800x400?text=DIY+Guide",
      "https://via.placeholder.com/800x400?text=Expert+Advice"
    ];
    
    const authors = ["יוסי כהן", "מיכל לוי", "אברהם גולדשטיין", "יעל אברהמי", "עומר שלום"];
    
    // Check how many articles we already have
    const { data: existingArticles, error: countError } = await supabase
      .from('articles')
      .select('category');

    if (countError) {
      throw countError;
    }

    // Group existing articles by category
    const articlesByCategory: Record<string, number> = {};
    existingArticles?.forEach(article => {
      if (article.category) {
        articlesByCategory[article.category] = (articlesByCategory[article.category] || 0) + 1;
      }
    });

    const articlesToCreate = [];

    // For each category, create 2 articles if needed
    for (const category of articleCategoryOptions) {
      const existingCount = articlesByCategory[category.value] || 0;
      const neededCount = Math.max(0, 2 - existingCount);
      
      // Skip if we already have enough articles for this category
      if (neededCount <= 0) continue;
      
      console.log(`Generating ${neededCount} articles for category "${category.label}"`);
      
      // Create the needed number of articles
      for (let i = 0; i < neededCount; i++) {
        const title = formatTemplate(getRandomElement(articleTemplates.title), category.label);
        const content = formatTemplate(getRandomElement(articleTemplates.content), category.label);
        const summary = formatTemplate(getRandomElement(articleTemplates.summary), category.label);
        
        articlesToCreate.push({
          title,
          content,
          summary,
          category: category.value,
          author: getRandomElement(authors),
          image: getRandomElement(imageUrls),
          published: true
        });
      }
    }

    // Batch insert all new articles
    if (articlesToCreate.length > 0) {
      const { data: insertedData, error: insertError } = await supabase
        .from('articles')
        .insert(articlesToCreate)
        .select();

      if (insertError) {
        throw insertError;
      }

      console.log(`Successfully created ${articlesToCreate.length} sample articles`);
      return insertedData;
    } else {
      console.log("No articles needed to be created - all categories have enough content");
      return [];
    }
  } catch (error) {
    console.error("Error generating sample articles:", error);
    throw error;
  }
};
