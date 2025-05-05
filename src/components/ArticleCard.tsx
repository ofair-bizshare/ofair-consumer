
import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  category?: string;
  author?: string;
}

const getCategoryLabel = (categoryValue: string): string => {
  const categories: Record<string, string> = {
    'general': 'כללי',
    'professionals': 'בעלי מקצוע',
    'home-improvement': 'שיפוץ הבית',
    'diy': 'עשה זאת בעצמך',
    'tips': 'טיפים',
    'guides': 'מדריכים',
    'electrician': 'חשמלאי',
    'plumber': 'אינסטלטור',
    'carpenter': 'נגר',
    'painter': 'צבע',
    'gardener': 'גנן',
    'renovation': 'שיפוצניק',
    'locksmith': 'מנעולן',
    'air-conditioning': 'מיזוג אוויר'
  };
  
  return categories[categoryValue] || 'מאמר';
};

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  summary,
  image,
  date,
  category,
  author
}) => {
  const categoryLabel = category ? getCategoryLabel(category) : 'מאמר';
  const [imgError, setImgError] = React.useState(false);

  const handleImageError = () => {
    setImgError(true);
  };

  // Use a better fallback image and ensure consistent image quality
  const imageUrl = imgError 
    ? 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80&w=800&h=450' 
    : image;

  return (
    <div className="glass-card overflow-hidden group h-full flex flex-col shadow-md hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-cover" 
          onError={handleImageError}
          loading="lazy"
        />
        {categoryLabel && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-teal-500 to-teal-400 text-white text-xs px-3 py-1.5 rounded-full shadow-sm">
            {categoryLabel}
          </div>
        )}
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
          <div className="flex items-center">
            <Calendar size={14} className="ml-1" />
            <span>{date}</span>
          </div>
          {author && <span className="text-gray-600">מאת: {author}</span>}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-teal-500 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {summary}
        </p>
        
        <Link to={`/articles/${id}`} className="mt-auto text-teal-500 font-medium text-sm hover:text-teal-600 inline-flex items-center">
          קרא עוד
          <span className="mr-1 transform group-hover:translate-x-1 transition-transform">←</span>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
