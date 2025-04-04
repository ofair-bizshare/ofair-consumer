
import React from 'react';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ArticleCardProps {
  id: string;
  title: string;
  summary: string; // Changed from excerpt to summary
  image: string;
  date: string;
  category?: string; // Made optional
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  summary, // Changed from excerpt to summary
  image,
  date,
  category = "מאמר" // Default value
}) => {
  return (
    <div className="glass-card overflow-hidden group">
      <div className="relative overflow-hidden h-48">
        <img src={image} alt={title} className="w-full h-full transition-transform duration-500 group-hover:scale-105 object-fill" />
        {category && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white text-xs px-2 py-1 rounded-full">
            {category}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-gray-500 text-xs mb-2">
          <Calendar size={14} className="ml-1" />
          <span>{date}</span>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-teal-500 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {summary}
        </p>
        
        <Link to={`/article/${id}`} className="text-teal-500 font-medium text-sm hover:text-teal-600 inline-flex items-center">
          קרא עוד
          <span className="mr-1 transform group-hover:translate-x-1 transition-transform">←</span>
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
