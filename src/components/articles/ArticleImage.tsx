
import React, { useState } from 'react';

interface ArticleImageProps {
  src: string;
  alt: string;
}

const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt }) => {
  const [imgError, setImgError] = useState(false);
  
  // Use a reliable local placeholder image if the image fails to load
  const imageSrc = imgError || !src || src.includes('via.placeholder.com')
    ? '/placeholder.svg'
    : src;

  return (
    <div className="aspect-w-16 aspect-h-9 mb-8 rounded-lg overflow-hidden">
      <img 
        src={imageSrc} 
        alt={alt}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
};

export default ArticleImage;
