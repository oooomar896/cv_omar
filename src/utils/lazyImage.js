import { useState, useEffect, useRef } from 'react';

/**
 * Hook for lazy loading images
 * @param {string} src - Image source URL
 * @param {string} fallback - Fallback image URL
 * @returns {Object} - Image state and loading status
 */
export const useLazyImage = (src, fallback = '') => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  const handleLoad = () => {
    setLoaded(true);
    setError(false);
  };

  const handleError = () => {
    setError(true);
    setLoaded(false);
    if (fallback) {
      setImgSrc(fallback);
    }
  };

  return {
    imgRef,
    imgSrc,
    loaded,
    error,
    handleLoad,
    handleError,
  };
};

/**
 * Lazy Image Component
 * Usage:
 * <LazyImage src="/path/to/image.jpg" alt="Description" />
 */
export const LazyImage = ({ src, alt, fallback, className, ...props }) => {
  const { imgRef, imgSrc, loaded, error, handleLoad, handleError } =
    useLazyImage(src, fallback);

  return (
    <div ref={imgRef} className={className}>
      {!loaded && !error && (
        <div className="animate-pulse bg-gray-700 w-full h-full" />
      )}
      {imgSrc && (
        <img
          src={imgSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}
    </div>
  );
};

export default LazyImage;
