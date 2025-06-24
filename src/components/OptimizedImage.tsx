
import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  placeholder?: string;
  sizes?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y0ZjRmNCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate responsive image URLs for different formats and sizes
  const generateResponsiveUrls = (originalSrc: string) => {
    if (originalSrc.includes('unsplash.com')) {
      return {
        webp: {
          small: `${originalSrc}&fm=webp&w=640&q=70`,
          medium: `${originalSrc}&fm=webp&w=1200&q=75`,
          large: `${originalSrc}&fm=webp&w=1920&q=80`
        },
        jpeg: {
          small: `${originalSrc}&fm=jpg&w=640&q=65`,
          medium: `${originalSrc}&fm=jpg&w=1200&q=70`,
          large: `${originalSrc}&fm=jpg&w=1920&q=75`
        }
      };
    }
    return null;
  };

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (isInView && imageSrc === placeholder) {
      setImageSrc(src);
    }
  }, [isInView, src, placeholder, imageSrc]);

  const responsiveUrls = generateResponsiveUrls(src);

  return (
    <picture ref={imgRef}>
      {responsiveUrls && (
        <>
          <source
            media="(max-width: 640px)"
            srcSet={`${responsiveUrls.webp.small} 640w`}
            type="image/webp"
          />
          <source
            media="(max-width: 1200px)"
            srcSet={`${responsiveUrls.webp.medium} 1200w`}
            type="image/webp"
          />
          <source
            srcSet={`${responsiveUrls.webp.large} 1920w`}
            type="image/webp"
          />
          <source
            media="(max-width: 640px)"
            srcSet={`${responsiveUrls.jpeg.small} 640w`}
            type="image/jpeg"
          />
          <source
            media="(max-width: 1200px)"
            srcSet={`${responsiveUrls.jpeg.medium} 1200w`}
            type="image/jpeg"
          />
          <source
            srcSet={`${responsiveUrls.jpeg.large} 1920w`}
            type="image/jpeg"
          />
        </>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-all duration-500 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-70 blur-sm'} ${className}`}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = placeholder;
        }}
      />
    </picture>
  );
};

export default OptimizedImage;
