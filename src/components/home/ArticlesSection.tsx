
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArticleCard from '@/components/ArticleCard';

// Sample data for articles
const articles = [{
  id: '1',
  title: '10 טיפים לחיסכון בחשמל בבית',
  summary: 'למדו כיצד לחסוך בהוצאות החשמל באמצעות שינויים קטנים בהרגלי השימוש היומיומיים שלכם.',
  image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  date: '10 במאי, 2023',
  category: 'חשמל וחיסכון'
}, {
  id: '2',
  title: 'מדריך לבחירת קבלן שיפוצים אמין',
  summary: 'כיצד לבחור את הקבלן הנכון לפרויקט השיפוץ שלכם וכיצד להימנע מטעויות נפוצות בתהליך.',
  image: 'https://images.unsplash.com/photo-1581165825571-4d25acd0e396?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
  date: '18 באפריל, 2023',
  category: 'שיפוצים'
}];

const ArticlesSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-blue-700 mb-3">טיפים <span className="text-custom-green">ומאמרים</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto">מאמרים מקצועיים וטיפים שימושיים שיעזרו לכם להפיק את המיטב מהפרויקט שלכם</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 stagger-animation">
          {articles.map(article => <ArticleCard key={article.id} {...article} />)}
        </div>
        
        <div className="text-center">
          <Link to="/articles">
            <Button className="text-white button-transition bg-[#00d09e]">
              לכל המאמרים
              <ArrowLeft size={16} className="mr-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;
