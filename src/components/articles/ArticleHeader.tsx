
import React from 'react';

interface ArticleHeaderProps {
  title: string;
  date?: string;
  category?: string;
  author?: string;
}

const ArticleHeader: React.FC<ArticleHeaderProps> = ({ 
  title,
  date,
  category,
  author
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between text-gray-500 text-sm mb-2">
        {date && <span>{date}</span>}
        {category && <span>{category}</span>}
      </div>
      <h1 className="text-3xl font-bold text-blue-700 mb-4">{title}</h1>
      {author && <p className="text-gray-600">מאת: {author}</p>}
    </div>
  );
};

export default ArticleHeader;
