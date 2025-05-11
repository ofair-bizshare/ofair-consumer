
import React from 'react';

interface ArticleContentProps {
  content?: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  return (
    <div className="prose prose-lg max-w-none">
      {content 
        ? <div dangerouslySetInnerHTML={{ __html: content }} /> 
        : <p>תוכן המאמר אינו זמין כרגע.</p>
      }
    </div>
  );
};

export default ArticleContent;
